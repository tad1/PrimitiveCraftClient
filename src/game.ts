import {Assets, Point, Time, Input, InputType, MouseButton, Mouse} from "./core/core.js"
import {Item, Player} from "./entities/entities.js"
import {Chunk, Camera2D, World} from "./game_specifics/game_specifics.js"
import { Action } from "./config/config.js";
import { RTCDispatcher } from "./RTCDispatcher.js";

class Game {
    testChunk : Chunk = new Chunk();
    // assetLoader : AssetLoader = new AssetLoader();
    world : World = new World();
    main_camera : Camera2D = new Camera2D(this.world);
    player : Player = new Player();
    
    async start() {
        await Assets.fetch();
        this.init();

    }
    init(){
        let rtc : RTCDispatcher = new RTCDispatcher(this.world);
        rtc.connect() 
        this.world.entities["you"] = this.player;
        this.player.hand = new Item("stick");
        this.world.entities["rock"] = new Item("rock");
        this.world.entities["rock"].position = new Point(2,2)
        this.player.position = new Point(0,0)
        Input.bind(Action.MoveUp, InputType.Keyboard, "ArrowUp");
        Input.bind(Action.MoveDown, InputType.Keyboard, "ArrowDown");
        Input.bind(Action.MoveLeft, InputType.Keyboard, "ArrowLeft");
        Input.bind(Action.MoveRight, InputType.Keyboard, "ArrowRight");
        Input.bind(Action.Useage, InputType.Mouse, MouseButton.Secondary);

        this.world.chunks["0@0"] = this.testChunk;
        const view = document.getElementById("game_view") as HTMLCanvasElement;
        const ctx : CanvasRenderingContext2D = view.getContext("2d") as CanvasRenderingContext2D;
        ctx.imageSmoothingEnabled = false;
        ctx.filter = "none";
        this.main_camera.target_renderer = ctx;
        this.main_camera.set_target(this.player)
        //init game


    }
    //! Terminology
    // Tick: fixed, partial-synchonized update (game logic)
    // Update: variable, user update (server data, input, render)
    // FixedUpdate: fixed, non-synchonized kinematics update (move & collision prediction).
    
    update(tFrame: number){

        //Fetch events, and recive data
        Time.calculateDelta();

        while(Time.fixed_time + Time.fixed_delta_time <= Time.time){
            Time.calculateFixedTime();
            this.fixedUpdate();
        }
        this.player.set_velocity = new Point(0,0);
        //update
        if(Input.isPressed(Action.MoveLeft)){
            this.player.set_velocity.x -= 5;
        }
        if(Input.isPressed(Action.MoveRight)){
            this.player.set_velocity.x += 5;
        }
        if(Input.isPressed(Action.MoveUp)){
            this.player.set_velocity.y -= 5;
        }
        if(Input.isPressed(Action.MoveDown)){
            this.player.set_velocity.y += 5;
        }
        if(Input.isJustPressed(Action.Useage)){
            console.log("Selected:")
            console.log(this.main_camera.screen_to_world_position(Mouse.local_position))
        }

        Input.updatePreviousInput();

        // update camera position
        // update scene positions

        // render
        // swap buffers!!!

        this.main_camera.update();
        this.main_camera.render();
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
// - [ ] audio
// - [ ] server
// - [ ] game state
// - [ ] render
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

;(async () => {
    let game : Game = new Game();
    await game.start();
    // Main Game Loop
    //* NOTE: when using window.requestAnimationFrame you must specify funciton, not method
    function main(tFrame: number) {
        tFrame;
        window.requestAnimationFrame(main);
        //add if to end the game loop
        game.update(tFrame);

        //Render()
        {
            //map is divided into chunks
            //when there's update from server only one chunk is redrawed
            //chunks will be utilized on chunk unload
            //check if maps needs to be rerendered
            //render entities

            //canvas can be divided into layers.
            //and at the end I can use prerendered canvas..
            //and that's nice I guess!
        }


    }

    main(window.performance.now());
})();

