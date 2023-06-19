"use strict";
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
exports.__esModule = true;
exports.Action = exports.Input = exports._Input = exports.InputType = exports.Mouse = exports.Keyboard = exports._Mouse = exports._Keyboard = void 0;
var _Keyboard = /** @class */ (function () {
    function _Keyboard() {
        this._keys = {};
    }
    _Keyboard.prototype.listenForEvents = function (keys) {
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
        keys.forEach(function (key) {
            this._keys[key] = false;
        }.bind(this));
    };
    _Keyboard.prototype._onKeyDown = function (event) {
        var key = event.key;
        if (key in this._keys) {
            event.preventDefault();
            this._keys[key] = true;
        }
    };
    _Keyboard.prototype._onKeyUp = function (event) {
        var key = event.key;
        if (key in this._keys) {
            event.preventDefault();
            this._keys[key] = false;
        }
    };
    _Keyboard.prototype.isDown = function (key) {
        if (!(key in this._keys)) {
            throw new Error('Key ' + key + ' is not being listed');
        }
        return this._keys[key];
    };
    return _Keyboard;
}());
exports._Keyboard = _Keyboard;
//TODO: add mouse position
var _Mouse = /** @class */ (function () {
    function _Mouse() {
        this._buttons = {};
        this.LEFT = 0;
        this.MIDDLE = 1;
        this.RIGHT = 2;
    }
    _Mouse.prototype.listenForEvents = function () {
        window.addEventListener('mousedown', this._onMouseDown.bind(this));
        window.addEventListener('mouseup', this._onMouseUp.bind(this));
        window.addEventListener('mousemove', function (e) { console.log(e); });
        [this.LEFT, this.MIDDLE, this.RIGHT].forEach(function (key) {
            this._buttons[key] = false;
        }.bind(this));
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
exports._Mouse = _Mouse;
exports.Keyboard = new _Keyboard();
exports.Keyboard.listenForEvents(["e", "j", "k"]);
exports.Mouse = new _Mouse();
exports.Mouse.listenForEvents();
var InputType;
(function (InputType) {
    InputType[InputType["Keyboard"] = 0] = "Keyboard";
    InputType[InputType["Mouse"] = 1] = "Mouse";
    InputType[InputType["Gamepad"] = 2] = "Gamepad";
})(InputType = exports.InputType || (exports.InputType = {}));
var _Input = /** @class */ (function () {
    function _Input(keyboard, mouse) {
        //Extends Keyboard, and Mouse API, updated once per frame
        this._keys = {}; // reference to Keyboard
        this._previous_keys = {};
        this._mouse_buttons = {}; // reference to Mouse
        this._previous_mouse_buttons = {};
        this._keys = keyboard._keys;
        this._mouse_buttons = mouse._buttons;
        for (var key in this._keys) {
            this._previous_keys[key] = false;
        }
        for (var key in this._mouse_buttons) {
            this._previous_mouse_buttons[key] = false;
        }
    }
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
exports._Input = _Input;
exports.Input = new _Input(exports.Keyboard, exports.Mouse);
//Note: this is defined per game, it's not general enough
var Action;
(function (Action) {
    Action[Action["Attack"] = 0] = "Attack";
    Action[Action["Useage"] = 1] = "Useage";
    Action[Action["Place"] = 2] = "Place";
    Action[Action["MoveLeft"] = 3] = "MoveLeft";
    Action[Action["MoveRight"] = 4] = "MoveRight";
    Action[Action["MoveUp"] = 5] = "MoveUp";
    Action[Action["MoveDown"] = 6] = "MoveDown";
})(Action = exports.Action || (exports.Action = {}));
//# sourceMappingURL=input.js.map