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
import { AssetType } from "../config/config.js";
var _Assets = /** @class */ (function () {
    function _Assets() {
        this.sprites = {};
        this.audio = {};
    }
    //Errors to handle:
    //  No assets.json
    //  No server connection
    //  Can't fetch certain asset
    //  Can't store asset, type mish mash
    //  Ran out of memory
    _Assets.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, asset_list;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("resources/assets.json")];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error("Couldn't fetch assets.json");
                        return [4 /*yield*/, response.json()];
                    case 2:
                        asset_list = _a.sent();
                        if (asset_list == null || asset_list == undefined)
                            throw new Error("Failed parsing assets.json");
                        //Paraller loading
                        return [4 /*yield*/, Promise.all(asset_list.map(function (asset) { return __awaiter(_this, void 0, void 0, function () {
                                var response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, fetch(asset.url)];
                                        case 1:
                                            response = _a.sent();
                                            return [4 /*yield*/, this.load(asset, response)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        //Paraller loading
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //Responsible for loading data was fetched
    //Errors to handle:
    //  Can't handle such a type of asset
    //  Invalid response
    //  Invalid data
    //  Can't process data (external processing error)
    _Assets.prototype.load = function (asset, response) {
        return __awaiter(this, void 0, void 0, function () {
            var img, blob, audio, blob;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!response.ok)
                            throw new Error("Could not fetch ".concat(asset.url, ", response code: ").concat(response.status));
                        if (!(asset.type == AssetType.Sprite)) return [3 /*break*/, 2];
                        img = new Image();
                        return [4 /*yield*/, response.blob()];
                    case 1:
                        blob = _a.sent();
                        img.src = URL.createObjectURL(blob);
                        this.sprites[asset.id] = img;
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(asset.type == AssetType.Audio)) return [3 /*break*/, 4];
                        audio = new Audio();
                        return [4 /*yield*/, response.blob()];
                    case 3:
                        blob = _a.sent();
                        audio.src = URL.createObjectURL(blob);
                        this.audio[asset.id] = audio;
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    _Assets.prototype.load_from_path = function (key, path) {
        var img = new Image();
        var d = new Promise(function (resolve, reject) {
            img.onload = function () {
                this.sprites[key] = img;
                resolve(img);
            }.bind(this);
            img.onerror = function () {
                reject('Could not load image: ' + path);
            }.bind(this);
        }.bind(this));
        img.src = path;
        return d;
    };
    _Assets.prototype.getImage = function (key) {
        return (key in this.sprites) ? this.sprites[key] : null;
    };
    _Assets.prototype.getAudio = function (key) {
        return (key in this.audio) ? this.audio[key] : null;
    };
    _Assets.prototype.playSFX = function (key) {
        if (key in this.audio) {
            this.audio[key].cloneNode().play();
        }
    };
    return _Assets;
}());
export var Assets = new _Assets();
//# sourceMappingURL=assets.js.map