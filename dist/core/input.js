var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Input System, that gives both, low level API, and Action binding abstraction.
import { Mouse, Keyboard, InputType } from "./input_devices.js";
var _Input = /** @class */ (function () {
    function _Input(keyboard, mouse) {
        //Extends Keyboard, and Mouse API, updated once per frame
        this._keys = {}; // reference to Keyboard
        this._previous_keys = {};
        this._mouse_buttons = {}; // reference to Mouse
        this._previous_mouse_buttons = {};
        //Action - input
        //TODO: dynamic action adding or something like that
        this._bindings = {};
        this._keys = keyboard._keys;
        this._mouse_buttons = mouse._buttons;
        for (var key in this._keys) {
            this._previous_keys[key] = false;
        }
        for (var key in this._mouse_buttons) {
            this._previous_mouse_buttons[key] = false;
        }
    }
    _Input.prototype.bind = function (action, device, value) {
        this._bindings[action] = [device, value];
    };
    _Input.prototype.updatePreviousInput = function () {
        this._previous_keys = __assign({}, this._keys);
        this._previous_mouse_buttons = __assign({}, this._mouse_buttons);
    };
    _Input.prototype.isKeyJustPressed = function (key) {
        return this._keys[key] && !this._previous_keys[key];
    };
    _Input.prototype.isKeyPressed = function (key) {
        return this._keys[key];
    };
    _Input.prototype.isKeyReleased = function (key) {
        return !this._keys[key];
    };
    _Input.prototype.isKeyJustReleased = function (key) {
        return !this._keys[key] && this._previous_keys[key];
    };
    _Input.prototype.isMouseJustPressed = function (key) {
        return this._mouse_buttons[key] && !this._previous_mouse_buttons[key];
    };
    _Input.prototype.isMousePressed = function (key) {
        return this._mouse_buttons[key];
    };
    _Input.prototype.isMouseReleased = function (key) {
        return !this._mouse_buttons[key];
    };
    _Input.prototype.isMouseJustReleased = function (key) {
        return !this._mouse_buttons[key] && this._previous_mouse_buttons[key];
    };
    _Input.prototype.isPressed = function (action) {
        if (!(action in this._bindings)) {
            return false;
        }
        var _a = this._bindings[action], type = _a[0], value = _a[1];
        var _b = this._get_buffors(type), state = _b[0], previousState = _b[1];
        return state[value];
    };
    _Input.prototype.isJustPressed = function (action) {
        if (!(action in this._bindings))
            return false;
        var _a = this._bindings[action], type = _a[0], value = _a[1];
        var _b = this._get_buffors(type), state = _b[0], previousState = _b[1];
        return state[value] && !previousState[value];
    };
    _Input.prototype.isReleased = function (action) {
        if (!(action in this._bindings))
            return false;
        var _a = this._bindings[action], type = _a[0], value = _a[1];
        var _b = this._get_buffors(type), state = _b[0], previousState = _b[1];
        return !state[value];
    };
    _Input.prototype.isJustReleased = function (action) {
        if (!(action in this._bindings))
            return false;
        var _a = this._bindings[action], type = _a[0], value = _a[1];
        var _b = this._get_buffors(type), state = _b[0], previousState = _b[1];
        return !state[value] && previousState[value];
    };
    _Input.prototype.isJustChanged = function (action) {
        if (!(action in this._bindings))
            return false;
        var _a = this._bindings[action], type = _a[0], value = _a[1];
        var _b = this._get_buffors(type), state = _b[0], previousState = _b[1];
        return state[value] != previousState[value];
    };
    _Input.prototype._get_buffors = function (type) {
        switch (type) {
            case InputType.Keyboard:
                return [this._keys, this._previous_keys];
            case InputType.Mouse:
                return [this._mouse_buttons, this._previous_mouse_buttons];
        }
        throw new Error("Unkown kind of input: " + type);
    };
    return _Input;
}());
export var Input = new _Input(Keyboard, Mouse);
//# sourceMappingURL=input.js.map