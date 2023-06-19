import { Point } from "./point.js";
// A global state buffers for input detection.
var _Keyboard = /** @class */ (function () {
    function _Keyboard() {
        this._keys = {};
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
    }
    _Keyboard.prototype._onKeyDown = function (event) {
        var key = event.key;
        this._keys[key] = true;
    };
    _Keyboard.prototype._onKeyUp = function (event) {
        var key = event.key;
        this._keys[key] = false;
    };
    _Keyboard.prototype.isDown = function (key) {
        if (!(key in this._keys)) {
            return false;
        }
        return this._keys[key];
    };
    return _Keyboard;
}());
export { _Keyboard };
export var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Primary"] = 0] = "Primary";
    MouseButton[MouseButton["Secondary"] = 2] = "Secondary";
    MouseButton[MouseButton["Auxiliary"] = 1] = "Auxiliary";
    MouseButton[MouseButton["Fourth"] = 3] = "Fourth";
    MouseButton[MouseButton["Fifth"] = 4] = "Fifth";
})(MouseButton || (MouseButton = {}));
var _Mouse = /** @class */ (function () {
    function _Mouse() {
        this._buttons = {};
        //avoiding null at first frame
        this.local_position = new Point(-1, -1);
        this.position = new Point(-1, -1);
        this.global_position = new Point(-1, -1);
        window.addEventListener('mousedown', this._onMouseDown.bind(this));
        window.addEventListener('mouseup', this._onMouseUp.bind(this));
        window.addEventListener('mousemove', this._onMouseMove.bind(this));
        Object.values(MouseButton).forEach(function (key) {
            this._buttons[key] = false;
        }.bind(this));
    }
    _Mouse.prototype._onMouseMove = function (event) {
        this.position.x = event.pageX;
        this.position.y = event.pageY;
        this.local_position.x = event.x;
        this.local_position.y = event.y;
        this.global_position.x = event.screenX;
        this.global_position.y = event.screenY;
    };
    _Mouse.prototype._onMouseDown = function (event) {
        var button = event.button;
        if (button in this._buttons) {
            event.preventDefault();
            this._buttons[button] = true;
        }
    };
    _Mouse.prototype._onMouseUp = function (event) {
        var button = event.button;
        if (button in this._buttons) {
            event.preventDefault();
            this._buttons[button] = false;
        }
    };
    _Mouse.prototype.isDown = function (button) {
        if (!(button in this._buttons)) {
            throw new Error('Key ' + button + ' is not being listed');
        }
        return this._buttons[button];
    };
    return _Mouse;
}());
export { _Mouse };
export var InputType;
(function (InputType) {
    InputType[InputType["Keyboard"] = 0] = "Keyboard";
    InputType[InputType["Mouse"] = 1] = "Mouse";
    InputType[InputType["Gamepad"] = 2] = "Gamepad";
})(InputType || (InputType = {}));
export var Keyboard = new _Keyboard();
export var Mouse = new _Mouse();
//# sourceMappingURL=input_devices.js.map