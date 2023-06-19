import {Assets, Point, Time, Input, InputType, MouseButton, Mouse} from "./core/core.js"
import {Item, ItemType, Player} from "./entities/entities.js"
import {Chunk, Camera2D, World} from "./game_specifics/game_specifics.js"
import { Action, ChunksSettings } from "./config/config.js";
import { RTCDispatcher, ServerAction, ServerActionType } from "./RTCDispatcher.js";
import { EntityFactory } from "./game_specifics/entity_factory.js";

class Game {
    testChunk : Chunk = new Chunk();
    // assetLoader : AssetLoader = new AssetLoader();
    world : World = new World();
    entity_factory : EntityFactory = new EntityFactory(this.world)
    
    main_camera : Camera2D = new Camera2D(this.world);
    player : Player = new Player(this.world); 
    dispatcher : RTCDispatcher
    playerID : string
    logged_in : boolean = false


    async start() {
        (window as any).login = this.login.bind(this)
        await Assets.fetch();
        this.init();
    }


    async login(login: string, secret: string, server: string = "localhost:10002"){
        this.world.entities = {}
        this.world.chunks = {}

        this.player = null
        this.dispatcher = new RTCDispatcher(this.world, this.entity_factory);
        this.playerID = await this.dispatcher.connect(login, secret, server) 
        this.logged_in = true
        console.log("Player id is:", this.playerID)
        this.main_camera.set_targetid(this.playerID)

    }

    splash_screen(){
        let s = 4;
        this.main_camera.target_renderer.drawImage(Assets.getImage("logo"), 400,100 + Math.sin(Time.time) * 10, 360*s, 128*s);        
        this.main_camera.target_renderer.drawImage(Assets.getImage("logo2"), 400,100 + Math.sin(Time.time + 0.6) * 10, 360*s, 128*s);        
    }

    init(){
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API


        // AUDIO Stuff
        const audioContext = new AudioContext();
        const audioElement = Assets.getAudio("music");
        // audioElement.onended = ...
        const track = audioContext.createMediaElementSource(audioElement);
        track.connect(audioContext.destination);
        audioElement.play();


        // TODO: 
        this.world.entities[this.playerID] = this.player;
        Input.bind(Action.MoveUp, InputType.Keyboard, "ArrowUp");
        Input.bind(Action.MoveDown, InputType.Keyboard, "ArrowDown");
        Input.bind(Action.MoveLeft, InputType.Keyboard, "ArrowLeft");
        Input.bind(Action.MoveRight, InputType.Keyboard, "ArrowRight");
        Input.bind(Action.Useage, InputType.Mouse, MouseButton.Secondary);
        Input.bind(Action.Place, InputType.Mouse, MouseButton.Auxiliary);
        Input.bind(Action.Attack, InputType.Mouse, MouseButton.Primary);
        Input.bind(Action.Pickup, InputType.Mouse, MouseButton.Fifth);

        
        const view = document.getElementById("game_view") as HTMLCanvasElement;
        const ctx : CanvasRenderingContext2D = view.getContext("2d") as CanvasRenderingContext2D;
        ctx.imageSmoothingEnabled = false;
        ctx.filter = "none";
        this.main_camera.target_renderer = ctx;
        //init game


    }
    //! Terminology
    // Tick: fixed, partial-synchonized update (game logic)
    // Update: variable, user update (server data, input, render)
    // FixedUpdate: fixed, non-synchonized kinematics update (move & collision prediction).
    
    handle_movement_input(){
        if(!this.logged_in) return
        
        let move_vector = new Point(0,0);
        let speed = 1;
        //update
        if(Input.isPressed(Action.MoveLeft)){
            move_vector.x -= 1;
        }
        if(Input.isPressed(Action.MoveRight)){
            move_vector.x += 1;
        }
        if(Input.isPressed(Action.MoveUp)){
            move_vector.y -= 1;
        }
        if(Input.isPressed(Action.MoveDown)){
            move_vector.y += 1;
        }
        if(Input.isJustPressed(Action.Place)){
            // TODO: determine if place or place at
            // aka check if there's target or not
            let camera_pos = this.main_camera.screen_to_world_position(Mouse.position);
            let pos = Point.mul(camera_pos, ChunksSettings.pos_mul)
            this.dispatcher.send_player_action(new ServerAction(
                this.main_camera.selected_entity_id == null ? ServerActionType.Place : ServerActionType.PlaceAt,
                0,
                this.main_camera.selected_entity_id,
                {X: pos.x, Y: pos.y},
                0
            ))
            Assets.playSFX("place")
        }
        if (Input.isJustPressed(Action.Pickup)){
            let camera_pos = this.main_camera.screen_to_world_position(Mouse.position);
            camera_pos = Point.mul(camera_pos, ChunksSettings.pos_mul)
            console.log("Entity id:",this.main_camera.selected_entity_id)
            this.dispatcher.send_player_action(new ServerAction(
                ServerActionType.Pickup,
                0,
                this.main_camera.selected_entity_id,
                {X: camera_pos.x, Y: camera_pos.y},
                0
            ))
        }
        if (Input.isJustPressed(Action.Useage)){
            let action : ServerActionType = ServerActionType.Use;
            if(this.world.entities[this.playerID]){
                if((this.world.entities[this.playerID] as Player).hand == null){
                    action = ServerActionType.Pickup;
                }
            }
            let camera_pos = this.main_camera.screen_to_world_position(Mouse.position);
            camera_pos = Point.mul(camera_pos, ChunksSettings.pos_mul)

            this.dispatcher.send_player_action(new ServerAction(
                action,
                0,
                this.main_camera.selected_entity_id,
                {X: camera_pos.x, Y: camera_pos.y},
                0
            ))
        }
        if (Input.isJustPressed(Action.Attack)){
            let camera_pos = this.main_camera.screen_to_world_position(Mouse.position);
            camera_pos = Point.mul(camera_pos, ChunksSettings.pos_mul)

            this.dispatcher.send_player_action(new ServerAction(
                ServerActionType.Attack,
                0,
                this.main_camera.selected_entity_id,
                {X: camera_pos.x, Y: camera_pos.y},
                0
            ))
        }

        if(this.world.entities[this.playerID])
            this.world.entities[this.playerID].set_velocity = move_vector;
        
        // TODO: avoid sending too much zeros!
        // Send input
        let action = new ServerAction(
            ServerActionType.Move,
            0,
            "",
            {X: move_vector.x, Y: move_vector.y},
            0
        )
        this.dispatcher.send_player_action(action)
    }

    update(tFrame: number){

        //Fetch events, and recive data
        Time.calculateDelta();

        while(Time.fixed_time + Time.fixed_delta_time <= Time.time){
            Time.calculateFixedTime();
            this.fixedUpdate();
        }
        this.world.tick();

        this.handle_movement_input();
        if(Input.isJustPressed(Action.Useage)){
            console.log("Selected:")
            console.log(this.main_camera.screen_to_world_position(Mouse.local_position))
            // * Mind Controll
            
        }

        Input.updatePreviousInput();

        // update camera position
        // update scene positions

        // render
        // swap buffers!!!

        this.main_camera.update();
        this.main_camera.render();
        if(!this.logged_in){
            this.splash_screen();
        }

    }



    fixedUpdate(){
        //* Responsibilities:
        // Based on entity data predict what will happen next
        // Fix all errors in position (probabilistics methods???)
        //? Q: in what order entity should be predicted?
        for(const key in this.world.entities){
            this.world.entities[key].fixedUpdate();
        }
    }
}
//Helpers:
// - [X] input
// - [x] audio
// - [x] server
// - [x] game state
// - [X] render
// - [X] loaders


//Basic idea of making the fullscreen work
window.onload = async () => {
    const view = document.getElementById("game_view");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const ctx = view.getContext("2d");
    ctx.fillStyle = "#FF0000"; 
    ctx.fillRect(0, 0, 150, 75); 
    window.addEventListener('keydown', (event) => {
        if (event.key == "f") {
            view.requestFullscreen();
        }
    });
}

let game : Game = new Game();

;(async () => {
await game.start();
// Main Game Loop
//* NOTE: when using window.requestAnimationFrame you must specify funciton, not method
function main(tFrame: number) {
    tFrame;
    window.requestAnimationFrame(main);
    //add if to end the game loop
    game.update(tFrame);
}

main(window.performance.now());
})();

