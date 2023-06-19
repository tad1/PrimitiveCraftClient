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
import { Player } from "./entities/player.js";
import { Chunk, UpdateType } from "./game_specifics/game_specifics.js";
// TODO: single responsibility
var RTCDispatcher = /** @class */ (function () {
    function RTCDispatcher(world, entity_factory) {
        var _this = this;
        this.connected = false;
        this.player_actions = null;
        this.preload = null;
        this.handled_actions = null;
        this.chunks_loaded = 0;
        this.world = world;
        this.entity_factory = entity_factory;
        this.pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }); //TODO: add configuration
        //?NOTE: Funny, it appears that I have to create at least one DataChannel to make sending offer work.
        this.player_actions = this.pc.createDataChannel("PlayerActions");
        this.pc.ondatachannel = function (ev) {
            if (ev.channel.label == "HandledActions") {
                _this.handled_actions = ev.channel;
                console.log("HandledActions created!");
                // TODO: simplify
                _this.handled_actions.addEventListener("message", _this.dispatch_changes.bind(_this));
                _this.send_player_action(new ServerAction(ServerActionType.Join, 0, "", { X: 0, Y: 0 }, 0));
            }
            else if (ev.channel.label == "Preload") {
                _this.preload = ev.channel;
                _this.preload.addEventListener("message", _this.dispatch.bind(_this));
            }
        };
    }
    RTCDispatcher.prototype.send_player_action = function (action) {
        if (this.player_actions.readyState == 'open') {
            this.player_actions.send(JSON.stringify(action));
        }
    };
    RTCDispatcher.prototype.connect = function (login, secret, server) {
        if (server === void 0) { server = "localhost:10002"; }
        return __awaiter(this, void 0, void 0, function () {
            var playerId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        playerId = null;
                        return [4 /*yield*/, this.pc.createOffer()
                                .then(function (offer) {
                                _this.pc.setLocalDescription(offer);
                                return fetch("http://".concat(server, "/game/join"), {
                                    method: 'post',
                                    headers: {
                                        'Accept': 'application/json, text/plain, */*',
                                        'Content-Type': 'application/json'
                                    },
                                    // So this must be passed by user
                                    body: JSON.stringify({
                                        login: login,
                                        secret: secret,
                                        offer: offer
                                    })
                                });
                            })
                                .then(function (res) { console.log(res); return res.json(); })
                                .then(function (res) { console.log(res); _this.pc.setRemoteDescription(res["WebrtcData"]); playerId = res["PlayerId"]; _this.connected = true; })["catch"](alert)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, playerId];
                }
            });
        });
    };
    RTCDispatcher.prototype.dispatch = function (event) {
        var enc = new TextDecoder("utf-8");
        var data = JSON.parse(enc.decode(event.data));
        var pos = "".concat(data.Id.X, "@").concat(data.Id.Y);
        // check if there's chunk
        if (!this.world.chunks[pos]) {
            this.world.chunks[pos] = new Chunk();
        }
        // Load entities
        for (var entityId in data.Entities) {
            // TODO: remove responsibility
            this.entity_factory.create_from_server(entityId, data.Entities[entityId]);
        }
    };
    RTCDispatcher.prototype.dispatch_changes = function (event) {
        var _this = this;
        // get data, decide what entity it is
        var enc = new TextDecoder("utf-8");
        var action = JSON.parse(enc.decode(event.data));
        if (!this.world.entities[action.Source.EntityId]) {
            // TODO: remove this responsibility
            if (action.Source.TypeName == "entity_player") {
                this.world.entities[action.Source.EntityId] = new Player(this.world);
            }
        }
        if (action.Changes == null)
            return;
        action.Changes.forEach(function (change) {
            if (change.Option == UpdateType.UpdateSet) {
                _this.world.entities[change.Id].events.push(change);
            }
            else if (change.Option == UpdateType.UpdateDestroy) {
                delete _this.world.entities[change.Id];
            }
            else if (change.Option == UpdateType.UpdateCreate) {
                // create entity
                _this.entity_factory.create_from_server(change.Id, change.Value.New);
            }
        });
    };
    return RTCDispatcher;
}());
export { RTCDispatcher };
export var ServerActionType;
(function (ServerActionType) {
    ServerActionType[ServerActionType["Move"] = 0] = "Move";
    ServerActionType[ServerActionType["Attack"] = 1] = "Attack";
    ServerActionType[ServerActionType["Use"] = 2] = "Use";
    ServerActionType[ServerActionType["Place"] = 3] = "Place";
    ServerActionType[ServerActionType["PlaceAt"] = 4] = "PlaceAt";
    ServerActionType[ServerActionType["Pickup"] = 5] = "Pickup";
    ServerActionType[ServerActionType["Join"] = 6] = "Join";
    ServerActionType[ServerActionType["Disconnect"] = 7] = "Disconnect";
    ServerActionType[ServerActionType["Tick"] = 8] = "Tick";
})(ServerActionType || (ServerActionType = {}));
var ServerAction = /** @class */ (function () {
    function ServerAction(action, slotid, target, position, arg) {
        this.Action = action;
        this.SlotId = slotid;
        this.Target = target;
        this.Position = position;
        this.Arg = arg;
    }
    return ServerAction;
}());
export { ServerAction };
//# sourceMappingURL=RTCDispatcher.js.map