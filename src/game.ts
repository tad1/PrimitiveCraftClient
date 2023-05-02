

class _Keyboard {
    _keys : Record<string, boolean> = {};

    listenForEvents(keys : Array<string>) {
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
    }

    _onKeyDown(event : KeyboardEvent) {
        const key : string = event.key;
        this._keys[key] = true;
    }
    _onKeyUp(event : KeyboardEvent) {
        const key = event.key;
        this._keys[key] = false;
    }
    isDown(key : string) : boolean {
        if(!(key in this._keys)) {
            return false;
        }
        return this._keys[key];
    }
}

class Point{
    public x : number = 0
    public y : number = 0
    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }
    static add(a : Point, b: Point|Rect) : Point{
        return new Point(a.x + b.x, a.y + b.y);
    }
    static sub(a : Point, b : Point|Rect) : Point{
        return new Point(a.x - b.x, a.y - b.y)
    }
    static mul(a : Point, b : Point) : Point{
        return new Point(a.x * b.x, a.y * b.y);
    }
    static div(a : Point, b : Point) : Point{
        return new Point(a.x / b.x, a.y / b.y);
    }

}

class _Mouse {
    _buttons : Record<number, boolean> = {}
    local_position : Point = {x: -1, y: -1}
    position : Point = {x: -1, y: -1}
    global_position : Point = {x: -1, y: -1}
    LEFT = 0;
    MIDDLE = 1;
    RIGHT = 2;

    listenForEvents() {
        window.addEventListener('mousedown', this._onMouseDown.bind(this));
        window.addEventListener('mouseup', this._onMouseUp.bind(this));
        window.addEventListener('mousemove', this._onMouseMove.bind(this));
        
        [this.LEFT, this.MIDDLE, this.RIGHT].forEach(function (key: string) {
            this._buttons[key] = false;
        }.bind(this));
    }

    _onMouseMove(event : MouseEvent) {
        this.position.x = event.pageX;
        this.position.y = event.pageY;
        this.local_position.x = event.x;
        this.local_position.y = event.y;
        this.global_position.x = event.screenX;
        this.global_position.y = event.screenY;
    }

    _onMouseDown(event : MouseEvent) {
        const button = event.button;
        if (button in this._buttons) {
            event.preventDefault();
            this._buttons[button] = true;
        }
    }
    _onMouseUp(event : MouseEvent) {
        const button = event.button;
        if (button in this._buttons) {
            event.preventDefault();
            this._buttons[button] = false;
        }
    }
    isDown(button : number) : boolean {
        if(!(button in this._buttons)) {
            throw new Error('Key ' + button + ' is not being listed');
        }
        return this._buttons[button];
    }
}

const Keyboard : _Keyboard = new _Keyboard();
Keyboard.listenForEvents(["e", "j", "k"]);

const Mouse : _Mouse = new _Mouse();
Mouse.listenForEvents();

enum InputType {
    Keyboard,
    Mouse,
    Gamepad
}

enum MouseButton{
    NoButton = 0,
    Primary = 1,
    Secondary = 2,
    Auxiliary = 4,
    Fourth = 8,
    Fifth = 16
}

class _Input {
    //Extends Keyboard, and Mouse API, updated once per frame
    _keys : Record<string, boolean> = {} // reference to Keyboard
    _previous_keys : Record<string, boolean> = {}

    _mouse_buttons : Record<number, boolean> = {} // reference to Mouse
    _previous_mouse_buttons : Record<number, boolean> = {};
    //Action - input
    //TODO: dynamic action adding or something like that
    _bindings : Record<number, [InputType, number | string]> = {};

    constructor(keyboard : _Keyboard, mouse : _Mouse) {
        this._keys = keyboard._keys
        this._mouse_buttons = mouse._buttons

        for (const key in this._keys) {
            this._previous_keys[key] = false
        }

        for (const key in this._mouse_buttons) {
            this._previous_mouse_buttons[key] = false;
        }
    }

    bind(action : Action, device : InputType, value : number | string){
        this._bindings[action] = [device, value];
    }

    updatePreviousInput(){
        this._previous_keys = { ... this._keys}
        this._previous_mouse_buttons = { ... this._mouse_buttons}
    }

    isKeyJustPressed(key : string) {
        return this._keys[key] && ! this._previous_keys[key];
    }
    isKeyPressed(key : string) {
        return this._keys[key];
    }
    isKeyReleased(key : string) {
        return !this._keys[key];
    }
    isKeyJustReleased(key : string) {
        return !this._keys[key] && this._previous_keys[key];
    }

    isMouseJustPressed(key : number) {
        return this._mouse_buttons[key] && ! this._previous_mouse_buttons[key];
    }
    isMousePressed(key : number) {
        return this._mouse_buttons[key];
    }
    isMouseReleased(key : number) {
        return !this._mouse_buttons[key];
    }
    isMouseJustReleased(key : number) {
        return !this._mouse_buttons[key] && this._previous_mouse_buttons[key];
    }

    isPressed(action : Action): boolean{
        if (! (action in this._bindings) ) {
            return false;
        }
        let [type, value] = this._bindings[action];
        let [state, previousState] = this._get_buffors(type)

        return state[value];
    }

    isJustPressed(action : Action) : boolean {
        if( ! (action in this._bindings)) return false;
        let [type, value] = this._bindings[action];
        let [state, previousState] = this._get_buffors(type)

        return state[value] && ! previousState[value];
    }

    isReleased(action : Action): boolean {
        if( ! (action in this._bindings)) return false;
        let [type, value] = this._bindings[action];
        let [state, previousState] = this._get_buffors(type)

        return !state[value]
    }

    isJustReleased(action : Action) : boolean {
        if( ! (action in this._bindings)) return false;
        let [type, value] = this._bindings[action];
        let [state, previousState] = this._get_buffors(type)

        return !state[value] && previousState[value];
    }


    _get_buffors(type : InputType) : [Record<string|number, boolean>, Record<string|number, boolean>]{
        switch (type) {
            case InputType.Keyboard:
                return [this._keys, this._previous_keys];
            
            case InputType.Mouse:
                return [this._mouse_buttons, this._previous_mouse_buttons]
        }
        throw new Error("Unkown kind of input: " + type)
    }

}

const Input = new _Input(Keyboard, Mouse);

//Note: this is defined per game, it's not general enough
enum Action{
    Attack,
    Useage,
    Place,
    MoveLeft,
    MoveRight,
    MoveUp,
    MoveDown
}

const ChunksSettings = {
    chunk_size : 8,
    tile_size: 16,
    render_distance: 3 
}

class _Assets {
    sprites : Record<string, any> = {};

    //Errors to handle:
    //  No assets.json
    //  No server connection
    //  Can't fetch certain asset
    //  Can't store asset, type mish mash
    //  Ran out of memory
    async fetch(){
        //Get assets.json
        //!NOTE: Here I will use API instead
        const response = await fetch("resources/assets.json")
        if(!response.ok)
            throw new Error("Couldn't fetch assets.json")
        const asset_list = await response.json() as Array<Asset>;
        if(asset_list == null || asset_list == undefined)
            throw new Error("Failed parsing assets.json")
            
        //Paraller loading
        await Promise.all(asset_list.map(async (asset) => {
            const response = await fetch(asset.url);
            await this.load(asset, response);
        }))
    }

    //Responsible for loading data was fetched
    //Errors to handle:
    //  Can't handle such a type of asset
    //  Invalid response
    //  Invalid data
    //  Can't process data (external processing error)
    async load(asset : Asset, response : Response){
        if(!response.ok)
            throw new Error(`Could not fetch ${asset.url}, response code: ${response.status}`)

        //A magic switch???
        //* Make sure that enum corresponds to asset type
        if(asset.type == AssetType.Sprite){

            //*NOTE: The following code violates Content Security Protocol if it's not set in HTML meta header
            //see: https://stackoverflow.com/questions/59484216/refused-to-load-the-image-blob-because-it-violates-the-following-content-s
            let img = new Image();
            const blob = await response.blob();
            img.src = URL.createObjectURL(blob);
            this.sprites[asset.id] = img
        }
    }


    load_from_path(key : string, path : string){
        var img = new Image();


        var d = new Promise(function (resolve: (arg0: HTMLImageElement) => void, reject: (arg0: string) => void) {
            img.onload = function(){
                this.sprites[key] = img;
                resolve(img);
            }.bind(this);

            img.onerror = function () {
                reject('Could not load image: '+path)
            }.bind(this);
        }.bind(this));

        img.src = path;
        return d
    }

    getImage(key : string) {
        return (key in this.sprites) ? this.sprites[key] : null
    }

}

const Assets : _Assets = new _Assets();

//TODO: find solution for chunk ticketing
class Chunk{
    _cords : [number, number] //chunk coordinate relative from spawn
    _ticket : Ticket = Ticket.VALID;
    _renderer : HTMLCanvasElement = null

    
    render(){
        // TODO: make rendering word pos based.?
        if (this._renderer === null){
            this._renderer = document.createElement('canvas');
            this._renderer.width = ChunksSettings.chunk_size * ChunksSettings.tile_size;
            this._renderer.height = ChunksSettings.chunk_size * ChunksSettings.tile_size;
            this._renderer.getContext("2d").filter = "none";
        }

        const context = this._renderer.getContext("2d");
        for (let i = 0; i < ChunksSettings.chunk_size; i++) {
            for (let ii = 0; ii < ChunksSettings.chunk_size; ii++) {
                //TODO: get cell and render
                context.drawImage(Assets.getImage("tmp"), ii * ChunksSettings.tile_size, i*ChunksSettings.tile_size);
            }
        }
        //Renders chunk to it's renderer
        //Chunck is rendered only when it's updated, and in view.
    }

    tick(){
        //TODO
    }
}

class _Renderer {
    renderers : Array<CanvasRenderingContext2D>
    canvas : CanvasRenderingContext2D

    add_renderer(canvas : CanvasRenderingContext2D){
        this.renderers.push(canvas);
    }

    render() {
        this.renderers.forEach((renderer) => {
            this.canvas.drawImage(renderer.canvas,0,0);
        })
    }
}


enum AssetType {
    Sprite = "sprite",
}

class Asset {
    id: string
    url: any
    type: AssetType
    hash: string
}

//* Not used, left for using indexedDB reference
class AssetLoader {
    db : IDBDatabase
    storeName : string = "assets"
    indexes : Array<string> = []


    async localdb_connect(){
        //JS Hoisting! Let's go!!
        const that = this;
        return new Promise(function(resolve: () => any) {
            const request = window.indexedDB.open("primitive-craft",3);
            request.onerror = (event) => {
                throw new Error("AssetLoader: Couldn't open indexedDB");
            }
            request.onupgradeneeded = (event : any) => {
                that.db = event.target.result;
                try {
                    that.db.createObjectStore(that.storeName, {keyPath: "name"});
                } catch (error) {
                    console.log(error);
                }
            }
            request.onsuccess = (event : any) => {
                that.db = event.target.result;
                return resolve();
            }

        }.bind(this));
    }

    async localdb_init(){
        const that = this;
        return new Promise(function(resolve: any){
            var transaction = that.db.transaction([that.storeName]);
            var index_request = transaction.objectStore(that.storeName).getAllKeys();
            index_request.onsuccess = () => {
                //@ts-ignore
                that.indexes = index_request.result;
                return resolve();
            }
        });
    }

}


//! TODO: the next thing!
//* the purpose of camera is to determine which objects are needed to be rendered.
//* there may be a multiple cameras
//* another feature of camera is to determine mouse world position
//? basically it's cast of world to screen, and allows to go backward from screen to world.
class Camera{
    //it renders all chunks, and all entities.
    // but it should provide general API.

    //Position should be anything, any dimension, any other props
    position : Point

    // First responsibility: detect visible objects...
}

class Rect{
    x: number = 0
    y: number = 0
    w: number = 0
    h: number = 0

    static intersect(a : Rect, b : Rect) : boolean {
        return (
          a.x <= b.x + b.w &&
          a.x + a.w >= b.x &&
          a.y <= b.y + b.h &&
          a.y + a.h >= b.y
        )
    }

    static div(a : Rect, b : number) : Point{
        let res = new Rect();
        res.x = a.x / b
        res.y = a.y / b
        res.w = a.w / b
        res.h = a.h / b
        return res;
    }
      
}

//Camera in 2D world
class Camera2D{
    position : Point //center of camera
    resolution : Point //practically it's resolution
    size: number // more like a zoom, determines size of camera
    tile_size : Point // size translated to game grid, pixels per grid
    _raycast_box : Rect // result of raycast box (x1,y1, x2,y2)
    world : World

    buffer : any // stores data that is visible.
    target_renderer : CanvasRenderingContext2D;
    target : Entity = null

    
    constructor(world : World){
        this.position = {x: 0, y: 0};
        this.resolution = {x: 1920, y: 1080}
        this.size = 1/4 //1/16; //(0,inf) camera size, the lower it is the bigger zoom is. ex. 1/4 is 4x zoom
        //raycast of screen over the world position
        this.tile_size = new Point(ChunksSettings.tile_size / this.size, ChunksSettings.tile_size / this.size)
        this._raycast_box = {h: 0, w: 0, x: 0, y: 0};
        this.world = world;
    }

    //! How it will work
    // Camera fetches data from world
    // Camera will know what chunks it needs to render (logical grid), so it will fetch from world
    //      Possible optimalization here
    // Camera don't know what entities it needs to render, so it will box-cast all entities
    //      Again there's a possible optimalization here

    update(){
        //TODO: update position
        if(this.target != null){
            this.position = this.target.position
        }

        this._raycast_box.x = this.position.x - (this.resolution.x / this.tile_size.x / 2);
        this._raycast_box.y = this.position.y - (this.resolution.y / this.tile_size.y / 2);
        this._raycast_box.w = this.resolution.x / this.tile_size.x;
        this._raycast_box.h = this.resolution.y / this.tile_size.y;
    }

    set_target(target : Entity){
        this.target = target
    }

    // this, works as intented
    world_to_screen_position(position : Point) : Point{
        let res : Point
        res = Point.sub(position, this._raycast_box)
        res = Point.mul(res, this.tile_size)
        return res
    }

    screen_to_world_position(position : Point) : Point{
        let res : Point
        res = Point.div(position, this.tile_size)
        res = Point.add(res, this._raycast_box)
        res.x = Math.floor(res.x)
        res.y = Math.floor(res.y)
        return res
    }


    render_chunks(){
        //! Q: what represents (0,0) coordinates? Center of world? Is that in middle of chunk, or edge of chunk?
        //Step 1: Render Chunks
        let chunk_coords : ChunkCord = {x:0, y:0};
        
        let draw_size : Point = {x:0, y:0};
        draw_size.x = ChunksSettings.chunk_size * this.tile_size.x;        
        draw_size.y = ChunksSettings.chunk_size * this.tile_size.y;

        let chunk_raycast = Rect.div(this._raycast_box, ChunksSettings.chunk_size);

        //* Fun fact: In JS we can use NOT NOT to get integer from number ~~(a/b)
        //! What about camera zoom?
        // NOTE: I'm using floor to get -3 for -2.3
        chunk_coords.x = Math.floor(chunk_raycast.x);
        chunk_coords.y = Math.floor(chunk_raycast.y);

        //Next we need to know position of chunk on screen
        let screen_position : Point = {x: 0, y:0};
        screen_position.x = (chunk_coords.x - chunk_raycast.x) * draw_size.x;
        screen_position.y = (chunk_coords.y - chunk_raycast.y) * draw_size.y;

        var chunk : Chunk; //TODO: get chunk & request render
        while(screen_position.y < this.resolution.y){
            while(screen_position.x < this.resolution.x){
                screen_position.x = (chunk_coords.x - chunk_raycast.x) * draw_size.x;

                chunk = this.world.getChunck(chunk_coords);
                chunk_coords.x += 1;
                if(chunk === undefined) continue;
                chunk.render()
                //todo: reduce renders

                this.target_renderer.drawImage(
                    chunk._renderer, //image
                    screen_position.x, screen_position.y, // target (x,y)
                    draw_size.x, draw_size.y //target (w,h)
                )
            }
            chunk_coords.x = Math.floor(chunk_raycast.x)
            chunk_coords.y += 1


            screen_position.y = (chunk_coords.y - chunk_raycast.y) * draw_size.y;
            screen_position.x = (chunk_coords.x - chunk_raycast.x) * draw_size.x;

        }
    }

    render() : void{

        //TODO: remove that clear
        this.target_renderer.beginPath();
        this.target_renderer.fillStyle = "#111";
        this.target_renderer.fillRect(0,0, this.resolution.x, this.resolution.y);
        this.target_renderer.closePath();
        
        this.render_chunks();

        // Step 2: render entities
        let render_hitbox : Rect = new Rect();
        for (const key in this.world.entities) {
            // TODO: find a better way to render player
            let entity = this.world.entities[key];
            render_hitbox.x = entity.position.x;
            render_hitbox.y = entity.position.y;
            render_hitbox.w = 1;
            render_hitbox.h = 1;

            if(Rect.intersect(render_hitbox, this._raycast_box)){
                // ! Assumption: entity position is at render is (x/2, 0) - middle at bottom
                // TODO: next this thing you need to do
                //Draw
                entity.render()
                let screen_pos = this.world_to_screen_position(entity.position)
                this.target_renderer.drawImage(entity._renderer, screen_pos.x, screen_pos.y, this.tile_size.x, this.tile_size.y)
            }
        }

        // Step 3: HUD, and effects
        // TODO: simplify math
        let pos: Point = this.world_to_screen_position(this.screen_to_world_position(Mouse.local_position));
        this.target_renderer.drawImage(Assets.getImage("select"), pos.x, pos.y, this.tile_size.x, this.tile_size.y)

    }
}

// Spawn relative chunk coordinates
interface ChunkCord{
    x: number //TODO: add integer specifics here!
    y: number
}


enum Ticket{
    VALID,
    OFFLOAD
};

// A game specific data structure
// ! How it works:
// World loosely holds data, it's unordered.
// In assumption world never have current state, it stores the past state.
// That's why it needs to simulate current state of world.
// The resources needs to be offloaded, the chunks and entities will be removed based on algorithm.
class World{
    //Later I need to think of better solution, some sort of numeric comparasion
    chunks : Record<string,Chunk> = {}
    entities : Record<string, Entity> = {}
    
    
    tick(){
        //NOTE: during tick update, it's determined whenever object should be unloaded
        for (const key in this.chunks) {
            this.chunks[key].tick()

            if (this.chunks[key]._ticket == Ticket.OFFLOAD) {
                delete this.chunks[key]
            }
            //or should I use `for...of`??
        }

        //TODO: check if for-of isn't a better option
        for (let id in this.entities) {
            this.entities[id].tick();
        }

        //TODO: offload
    }

    getChunck(cords : ChunkCord) : Chunk{
        //TODO: create that hash function
        let hash : string = cords.x.toString() + "@" + cords.y.toString();
        return this.chunks[hash]
    }
}


//? What about this idea??
interface IRenderable{
    render() : void;
}

class Time_{

    cycleTime : number = 0 //* int
    lastTick : number

    delta_time : number;
    time : number = 0.0;

    fixed_time : number = 0.0;
    fixed_delta_time : number = 0.1;
    maximum_delta_time : number;

    constructor(){
        this.delta_time = 0.0;
        this.time = 0.0;
        this.fixed_time = 0.0;

        this.fixed_delta_time = 0.01 //default: 100 physics update per second
        this.maximum_delta_time = 0.1 //default
        this.lastTick = window.performance.now()
    }

    calculateDelta() : void {
        let currentTick = window.performance.now();
        this.cycleTime = currentTick - this.lastTick;
        this.lastTick = currentTick;

        this.delta_time = this.cycleTime / 1000; //convert to seconds
        if(this.delta_time > this.maximum_delta_time)
            this.delta_time = this.maximum_delta_time;
        
        this.time += this.delta_time;
    }

    calculateFixedTime(){
        this.fixed_time += this.fixed_delta_time;
    }    
}

const Time : Time_ = new Time_();

// A game object that goes brrrr....
//! Q: should Entity bechaviour downloaded from server? Yes. Will it be in WebAssembly?
interface Entity{
    id: number //! What type of id?
    set_position : Point // last known position
    set_velocity : Point // last known velocity unit/ms??

    position : Point // predicted position 
    position_error : Point // error calculated on previously fetched data
    _renderer : HTMLCanvasElement | HTMLImageElement
    render_size : Point

    // A time-fixed update...
    //! Oh gosh! the ticks must be synchronized! Or just use 2 different tick system, but that kills tick tracking...
    //TODO: make that working
    //! Q: Some entities will have target, and some will just move??
    tick(): void

    //? I think that I should better name that.. for now applying terminology
    //NOTE: fixed update is update between ticks.
    // It shouldn't have any logic, it just should interlope and fix position
    
    //No operator overloading :(
        //! Q: should velocity describe unit/second or unit/tick?
    fixedUpdate(): void

    //Renders once is nesseacary??? No? Because of animations?
    //* What about animations?
    render(): void
    // This is more difficult.
    // First, we need to know what game tick data comes from.
    
    //! Q: Does the server fires messeages? Or is that more query, response?
    //! Q: Should game tick, and server tick be the same?

}

class Player implements Entity{
    // TODO: get better
    render_size: Point = {x: 48, y: 48};
    _renderer: HTMLCanvasElement = null;
    id: number;
    set_position: Point = new Point(0,0);
    set_velocity: Point = new Point(0,0);
    position: Point = new Point(0,0);
    position_error: Point = new Point(0,0);
    speed = 5;
    
    tick(): void {
        throw new Error("Method not implemented.");
        // try get set position
    }
    fixedUpdate(): void {
        this.position.x += this.set_velocity.x * Time.fixed_delta_time;
        this.position.y += this.set_velocity.y * Time.fixed_delta_time;
    }
    render(): void {
        if (this._renderer === null){
            this._renderer = document.createElement('canvas');
            this._renderer.width = ChunksSettings.tile_size;
            this._renderer.height = ChunksSettings.tile_size;
        }
        const context = this._renderer.getContext("2d");
        context.drawImage(Assets.getImage("player"), 0,0, ChunksSettings.tile_size, ChunksSettings.tile_size);
    }

}

class Item implements Entity{
    id: number;
    set_position: Point;
    set_velocity: Point;
    position: Point;
    position_error: Point;
    _renderer: HTMLCanvasElement | HTMLImageElement;
    render_size: Point;
    image : any;
    item_type : string;

    constructor(name: string){
        this.item_type = name
        this._renderer =  Assets.getImage(name)
    }

    tick(): void {
    }
    fixedUpdate(): void {
    }
    render(): void {
    }

}

class RTCDispatcher{
    pc : RTCPeerConnection
    dc : RTCDataChannel
    world : World

    constructor(world : World){
        this.world = world
        this.pc = new RTCPeerConnection({iceServers: [{urls: "stun:stun.l.google.com:19302"}]}) //TODO: add configuration
        this.dc = this.pc.createDataChannel("my channel");
        this.dc.addEventListener("message", this.dispatch)
    }

    connect(){
        this.pc.createOffer()
        .then(offer => {
          this.pc.setLocalDescription(offer)

          return fetch(`http://localhost:10002/game/join`, {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(offer)
          })
        })
        .then(res => {console.log(res); return res.json() })
        .then(res => this.pc.setRemoteDescription(res))
        .catch(alert)
    }

    dispatch(event : MessageEvent){
        // get data, decide what entity it is
        console.log(event.data)

    }

}

class Game {
    testChunk : Chunk = new Chunk();
    assetLoader : AssetLoader = new AssetLoader();
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

