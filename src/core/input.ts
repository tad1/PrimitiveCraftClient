// Input System, that gives both, low level API, and Action binding abstraction.
import { Mouse, Keyboard, MouseButton, InputType } from "./input_devices";
import { _Mouse, _Keyboard } from "./input_devices";


class _Input {
    //Extends Keyboard, and Mouse API, updated once per frame
    _keys : Record<string, boolean> = {} // reference to Keyboard
    _previous_keys : Record<string, boolean> = {}

    _mouse_buttons : Record<number, boolean> = {} // reference to Mouse
    _previous_mouse_buttons : Record<number, boolean> = {};
    //Action - input
    //TODO: dynamic action adding or something like that
    _bindings : Record<string|number, [InputType, number | string]> = {};

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

    bind(action : string|number, device : InputType, value : number | string){
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

    isPressed(action : string|number): boolean{
        if (! (action in this._bindings) ) {
            return false;
        }
        let [type, value] = this._bindings[action];
        let [state, previousState] = this._get_buffors(type)

        return state[value];
    }

    isJustPressed(action : string|number) : boolean {
        if( ! (action in this._bindings)) return false;
        let [type, value] = this._bindings[action];
        let [state, previousState] = this._get_buffors(type)

        return state[value] && ! previousState[value];
    }

    isReleased(action : string|number): boolean {
        if( ! (action in this._bindings)) return false;
        let [type, value] = this._bindings[action];
        let [state, previousState] = this._get_buffors(type)

        return !state[value]
    }

    isJustReleased(action : string|number) : boolean {
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

export const Input = new _Input(Keyboard, Mouse);