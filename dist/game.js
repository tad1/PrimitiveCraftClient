var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Assets, Point, Time, Input, InputType, MouseButton, Mouse } from "./core/core.js";
import { Player } from "./entities/entities.js";
import { Chunk, Camera2D, World } from "./game_specifics/game_specifics.js";
import { Action, ChunksSettings } from "./config/config.js";
import { RTCDispatcher, ServerAction, ServerActionType } from "./RTCDispatcher.js";
import { EntityFactory } from "./game_specifics/entity_factory.js";
var Game = /** @class */ (function () {
    function Game() {
        this.testChunk = new Chunk();
        // assetLoader : AssetLoader = new AssetLoader();
        this.world = new World();
        this.entity_factory = new EntityFactory(this.world);
        this.main_camera = new Camera2D(this.world);
        this.player = new Player(this.world);
        this.logged_in = false;
    }
    Game.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.login = this.login.bind(this);
                        return [4 /*yield*/, Assets.fetch()];
                    case 1:
                        _a.sent();
                        this.init();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.login = function (login, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.player = null;
                        this.dispatcher = new RTCDispatcher(this.world, this.entity_factory);
                        _a = this;
                        return [4 /*yield*/, this.dispatcher.connect(login, secret)];
                    case 1:
                        _a.playerID = _b.sent();
                        this.logged_in = true;
                        console.log("Player id is:", this.playerID);
                        this.main_camera.set_targetid(this.playerID);
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.splash_screen = function () {
        var s = 4;
        this.main_camera.target_renderer.drawImage(Assets.getImage("logo"), 400, 100 + Math.sin(Time.time) * 10, 360 * s, 128 * s);
        this.main_camera.target_renderer.drawImage(Assets.getImage("logo2"), 400, 100 + Math.sin(Time.time + 0.3) * 10, 360 * s, 128 * s);
    };
    Game.prototype.init = function () {
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API
        // // AUDIO Stuff
        // const audioContext = new AudioContext();
        // const audioElement = Assets.getAudio("music");
        // // audioElement.onended = ...
        // const track = audioContext.createMediaElementSource(audioElement);
        // const distortion = audioContext.createWaveShaper();
        // const filter = audioContext.createBiquadFilter();
        // function makeDistortion(amount : number) {
        //     const n_samples = 44100;
        //     const curve = new Float32Array(n_samples);
        //     const deg = Math.PI / 180;
        //     for (let i = 0; i < n_samples; i++) {
        //         const x = (i * 2) / n_samples - 1;
        //         curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        //       }
        //       return curve;
        // }
        // distortion.curve = makeDistortion(100);
        // distortion.oversample = "4x";
        // track.connect(filter).connect(audioContext.destination);
        // // filter.type = "highpass"
        // // filter.frequency.setValueAtTime(1000, audioContext.currentTime);
        // // filter.gain.setValueAtTime(25, audioContext.currentTime);
        // audioElement.play();
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
        var view = document.getElementById("game_view");
        var ctx = view.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.filter = "none";
        this.main_camera.target_renderer = ctx;
        //init game
    };
    //! Terminology
    // Tick: fixed, partial-synchonized update (game logic)
    // Update: variable, user update (server data, input, render)
    // FixedUpdate: fixed, non-synchonized kinematics update (move & collision prediction).
    Game.prototype.handle_movement_input = function () {
        if (!this.logged_in)
            return;
        var move_vector = new Point(0, 0);
        var speed = 1;
        //update
        if (Input.isPressed(Action.MoveLeft)) {
            move_vector.x -= 1;
        }
        if (Input.isPressed(Action.MoveRight)) {
            move_vector.x += 1;
        }
        if (Input.isPressed(Action.MoveUp)) {
            move_vector.y -= 1;
        }
        if (Input.isPressed(Action.MoveDown)) {
            move_vector.y += 1;
        }
        if (Input.isJustPressed(Action.Place)) {
            // TODO: determine if place or place at
            // aka check if there's target or not
            var camera_pos = this.main_camera.screen_to_world_position(Mouse.position);
            var pos = Point.mul(camera_pos, ChunksSettings.pos_mul);
            this.dispatcher.send_player_action(new ServerAction(this.main_camera.selected_entity_id == null ? ServerActionType.Place : ServerActionType.PlaceAt, 0, this.main_camera.selected_entity_id, { X: pos.x, Y: pos.y }, 0));
            Assets.playSFX("place");
        }
        if (Input.isJustPressed(Action.Pickup)) {
            var camera_pos = this.main_camera.screen_to_world_position(Mouse.position);
            camera_pos = Point.mul(camera_pos, ChunksSettings.pos_mul);
            console.log("Entity id:", this.main_camera.selected_entity_id);
            this.dispatcher.send_player_action(new ServerAction(ServerActionType.Pickup, 0, this.main_camera.selected_entity_id, { X: camera_pos.x, Y: camera_pos.y }, 0));
        }
        if (Input.isJustPressed(Action.Useage)) {
            var camera_pos = this.main_camera.screen_to_world_position(Mouse.position);
            camera_pos = Point.mul(camera_pos, ChunksSettings.pos_mul);
            this.dispatcher.send_player_action(new ServerAction(ServerActionType.Use, 0, this.main_camera.selected_entity_id, { X: camera_pos.x, Y: camera_pos.y }, 0));
        }
        if (Input.isJustPressed(Action.Attack)) {
            var camera_pos = this.main_camera.screen_to_world_position(Mouse.position);
            camera_pos = Point.mul(camera_pos, ChunksSettings.pos_mul);
            this.dispatcher.send_player_action(new ServerAction(ServerActionType.Attack, 0, this.main_camera.selected_entity_id, { X: camera_pos.x, Y: camera_pos.y }, 0));
        }
        if (this.world.entities[this.playerID])
            this.world.entities[this.playerID].set_velocity = move_vector;
        // TODO: avoid sending too much zeros!
        // Send input
        var action = new ServerAction(ServerActionType.Move, 0, "", { X: move_vector.x, Y: move_vector.y }, 0);
        this.dispatcher.send_player_action(action);
    };
    Game.prototype.update = function (tFrame) {
        //Fetch events, and recive data
        Time.calculateDelta();
        while (Time.fixed_time + Time.fixed_delta_time <= Time.time) {
            Time.calculateFixedTime();
            this.fixedUpdate();
        }
        this.world.tick();
        this.handle_movement_input();
        if (Input.isJustPressed(Action.Useage)) {
            console.log("Selected:");
            console.log(this.main_camera.screen_to_world_position(Mouse.local_position));
            // * Mind Controll
        }
        Input.updatePreviousInput();
        // update camera position
        // update scene positions
        // render
        // swap buffers!!!
        this.main_camera.update();
        this.main_camera.render();
        if (!this.logged_in) {
            this.splash_screen();
        }
    };
    Game.prototype.fixedUpdate = function () {
        //* Responsibilities:
        // Based on entity data predict what will happen next
        // Fix all errors in position (probabilistics methods???)
        //? Q: in what order entity should be predicted?
        for (var key in this.world.entities) {
            this.world.entities[key].fixedUpdate();
        }
    };
    return Game;
}());
//Helpers:
// - [X] input
// - [x] audio
// - [x] server
// - [x] game state
// - [X] render
// - [X] loaders
//Basic idea of making the fullscreen work
window.onload = function () { return __awaiter(void 0, void 0, void 0, function () {
    var view, ctx;
    return __generator(this, function (_a) {
        view = document.getElementById("game_view");
        ctx = view.getContext("2d");
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0, 0, 150, 75);
        window.addEventListener('keydown', function (event) {
            if (event.key == "f") {
                view.requestFullscreen();
            }
        });
        return [2 /*return*/];
    });
}); };
var game = new Game();
;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    // Main Game Loop
    //* NOTE: when using window.requestAnimationFrame you must specify funciton, not method
    function main(tFrame) {
        tFrame;
        window.requestAnimationFrame(main);
        //add if to end the game loop
        game.update(tFrame);
    }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, game.start()];
            case 1:
                _a.sent();
                main(window.performance.now());
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=game.js.map