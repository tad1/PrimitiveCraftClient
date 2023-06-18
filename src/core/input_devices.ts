import {Point} from "./point.js";

// A global state buffers for input detection.
export class _Keyboard {
    _keys : Record<string, boolean> = {};

    constructor() {
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

export enum MouseButton{
    Primary = 0,
    Secondary = 2,
    Auxiliary = 1,
    Fourth = 3,
    Fifth = 4
}

export class _Mouse {
    _buttons : Record<number, boolean> = {}

    //avoiding null at first frame
    local_position : Point = new Point(-1,-1) 
    position : Point = new Point(-1,-1)
    global_position : Point = new Point(-1,-1)

    constructor() {
        window.addEventListener('mousedown', this._onMouseDown.bind(this));
        window.addEventListener('mouseup', this._onMouseUp.bind(this));
        window.addEventListener('mousemove', this._onMouseMove.bind(this));
        Object.values(MouseButton).forEach(function (key: string) {
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

export enum InputType {
    Keyboard,
    Mouse,
    Gamepad
}

export const Keyboard : _Keyboard = new _Keyboard();
export const Mouse : _Mouse = new _Mouse();

