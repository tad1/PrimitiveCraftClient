class _Keyboard {
    _keys : Record<string, boolean> = {};

    listenForEvents(keys : Array<string>) {
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
    
        keys.forEach(function (key: string) {
            this._keys[key] = false;
        }.bind(this));
    }

    _onKeyDown(event : KeyboardEvent) {
        const key : string = event.key;
        if (key in this._keys) {
            event.preventDefault();
            this._keys[key] = true;
        }
    }
    _onKeyUp(event : KeyboardEvent) {
        const key = event.key;
        if (key in this._keys) {
            event.preventDefault();
            this._keys[key] = false;
        }
    }
    isDown(key : string) : boolean {
        if(!(key in this._keys)) {
            throw new Error('Key ' + key + ' is not being listed');
        }
        return this._keys[key];
    }
}

interface Point{
    x : number,
    y : number
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

class _Input {
    //Extends Keyboard, and Mouse API, updated once per frame
    _keys : Record<string, boolean> = {} // reference to Keyboard
    _previous_keys : Record<string, boolean> = {}

    _mouse_buttons : Record<number, boolean> = {} // reference to Mouse
    _previous_mouse_buttons : Record<number, boolean> = {}
    //Action - input
    //TODO: dynamic action adding or something like that
    _bindings : Record<Action, [InputType, number | string]>

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


enum TicketType{
    Player
}

interface Ticket{
    level: number
    type: TicketType
}

const ChunksSettings = {
    chunk_size : 16,
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
    _ticket : Ticket
    _renderer : HTMLCanvasElement = null

    render(){
        if (this._renderer === null){
            this._renderer = document.createElement('canvas');
            this._renderer.width = ChunksSettings.chunk_size * ChunksSettings.tile_size;
            this._renderer.height = ChunksSettings.chunk_size * ChunksSettings.tile_size;
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
//! TODO: while making camera system, determine how world will be stored
class Camera{

}

class Game {
    testChunk : Chunk = new Chunk();
    assetLoader : AssetLoader = new AssetLoader();
    async start() {
        await Assets.fetch();
        this.init();

    }
    init(){

        //init game
        this.testChunk.render();
        const view = document.getElementById("game_view");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const ctx : CanvasRenderingContext2D = view.getContext("2d");
        ctx.drawImage(this.testChunk._renderer,0,0);


    }
    tick(tFrame: number){
        this.testChunk.render();
        const view = document.getElementById("game_view");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const ctx : CanvasRenderingContext2D = view.getContext("2d");
        ctx.drawImage(this.testChunk._renderer,0,0);
        //Fetch events
        //Calculate time

        //Input update

        //while (Time.fixedUnscaledTime + Time.fixedUnscaledDeltaTime <= Time.unscaledTime)
            //Update fixed time
            //Fixed Update

        //update

        // Input.updatePreviousInput();

        //render
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
        game.tick(tFrame);

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


        Input.updatePreviousInput();
    }

    main(window.performance.now());
})();

