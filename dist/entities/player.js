import { Point, Time, Assets } from "../core/core.js";
import { ChunksSettings } from "../config/config.js";
import { Item } from "./item.js";
var Player = /** @class */ (function () {
    function Player(world) {
        this.events = [];
        // TODO: get better
        this.render_size = { x: 1, y: 1 };
        this._renderer = null;
        this.set_position = new Point(0, 0);
        this.set_velocity = new Point(0, 0);
        this.position = new Point(0, 0);
        this.position_error = new Point(0, 0);
        this.speed = 100 / ChunksSettings.tile_subsections;
        this.max_error = 1 / 2;
        this.world = world;
    }
    Player.prototype.tick = function () {
        // 10ms tick - 1/8
        // try get set position
        var _this = this;
        this.events.forEach(function (change) {
            if (change.Property == "position") {
                console.log(change.Value.New);
                _this.set_position.x = change.Value.New.X / ChunksSettings.tile_subsections;
                _this.set_position.y = change.Value.New.Y / ChunksSettings.tile_subsections;
                _this.position_error = Point.sub(_this.set_position, _this.position);
                if (Point.mag(_this.position_error) > _this.max_error) {
                    // Assets.playSFX("bonk")
                    _this.position = _this.set_position;
                }
            }
            if (change.Property == "move_vec") {
                _this.set_velocity.x = change.Value.New.X;
                _this.set_velocity.y = change.Value.New.Y;
            }
            if (change.Property == "item") {
                if (change.Value.New == null) {
                    _this.hand = null;
                }
                else {
                    console.log("Picked up item");
                    _this.hand = new Item(_this.world, change.Value.New.Type);
                }
            }
        });
        this.events = [];
    };
    Player.prototype.fixedUpdate = function () {
        this.position.x += this.set_velocity.x * this.speed * Time.fixed_delta_time;
        this.position.y += this.set_velocity.y * this.speed * Time.fixed_delta_time;
        // this.position_error = 
        // this.position = this.set_position;
    };
    Player.prototype.render = function () {
        if (this._renderer === null) {
            this._renderer = document.createElement('canvas');
            this._renderer.width = ChunksSettings.tile_size;
            this._renderer.height = ChunksSettings.tile_size;
        }
        var context = this._renderer.getContext("2d");
        context.clearRect(0, 0, ChunksSettings.tile_size, ChunksSettings.tile_size);
        context.drawImage(Assets.getImage("player"), 0, ChunksSettings.tile_size, ChunksSettings.tile_size, -Math.sin(Time.time * 4) * ChunksSettings.tile_size / 8 - 7 * ChunksSettings.tile_size / 8);
        if (this.hand != null)
            context.drawImage(this.hand._renderer, 0, 0, ChunksSettings.tile_size, ChunksSettings.tile_size);
    };
    return Player;
}());
export { Player };
//# sourceMappingURL=player.js.map