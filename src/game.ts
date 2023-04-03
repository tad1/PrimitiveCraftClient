
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

class _Mouse {
    _buttons : Record<number, boolean> = {}
    LEFT = 0;
    MIDDLE = 1;
    RIGHT = 2;

    listenForEvents() {
        window.addEventListener('mousedown', this._onMouseDown.bind(this));
        window.addEventListener('mouseup', this._onMouseUp.bind(this));
        
        [this.LEFT, this.MIDDLE, this.RIGHT].forEach(function (key: string) {
            this._buttons[key] = false;
        }.bind(this));
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

class _Input {
    //Extends Keyboard, and Mouse API, updated once per frame
    _keys : Record<string, boolean> = {} // reference to Keyboard
    _previous_keys : Record<string, boolean> = {}

    _mouse_buttons : Record<number, boolean> = {} // reference to Mouse
    _previous_mouse_buttons : Record<number, boolean> = {}
    //Action - input
    _bindings : Record<Action, string | number>

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

}

const Input = new _Input(Keyboard, Mouse);

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

class _Assets {
    sprites : Record<string, ImageData>

} 

class AssetLoader {
    missing_assets : Array<string>
    require(name : string) {
        //checks if there's asset in database, otherwise download it.
    }
    flush(){
        //downloads all missing assets
        
    }
}

enum Action{
    Attack,
    Useage,
    Place,
    MoveLeft,
    MoveRight,
    MoveUp,
    MoveDown
}

class Game {
    start() {
        this.init();
        window.requestAnimationFrame(this.tick);
    }
    init(){
        //init game
    }
    tick(){
        window.requestAnimationFrame(this.tick);
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
// - input
// - audio
// - server
// - game state
// - render
// - loaders


//Basic idea of making the fullscreen work
window.onload = () => {
    const view = document.getElementById("game_view");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const ctx = view.getContext("2d");
    ctx.fillStyle = "#FF0000"; 
    ctx.fillRect(0, 0, 150, 75); 
    window.addEventListener('keydown', (event) => {
        console.log(event.key)
        if (event.key == "f") {
            view.requestFullscreen();
        }
    })
}

;(() => {
    // Main Game Loop
    function main(tFrame: number) {
        tFrame;
        //add if to end the game loop
        window.requestAnimationFrame(main);


        if(Input.isKeyJustPressed("e")) {
            console.log("Pressed e!");
        }
        if(Input.isMouseJustPressed(0)){
            console.log("Clicked!");
        }
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

        //Check Input()
        {
            //Fetch all inputs
        }

        //Sync
        {
            //Send all 
        }

        Input.updatePreviousInput();
    }

    //Client Init
    {
        //Open up lobby with previous credintials
    }

    //Game Init
    {
        //Prepare all data structures
    }

    main(window.performance.now());
})();

