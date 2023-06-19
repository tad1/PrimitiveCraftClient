import { Point, Mouse, Assets } from "../core/core.js";
import { Rect } from "./rect.js";
import { ChunksSettings } from "../config/config.js";
//Camera in 2D world
var Camera2D = /** @class */ (function () {
    function Camera2D(world) {
        this.target = null;
        this.target_id = null;
        this.selected_entity_id = null;
        this.position = { x: 0, y: 0 };
        this.resolution = { x: 1920, y: 1080 };
        this.size = 1 / 4; //1/16; //(0,inf) camera size, the lower it is the bigger zoom is. ex. 1/4 is 4x zoom
        //raycast of screen over the world position
        this.tile_size = new Point(ChunksSettings.tile_size / this.size, ChunksSettings.tile_size / this.size);
        this._raycast_box = { h: 0, w: 0, x: 0, y: 0 };
        this.world = world;
    }
    //! How it will work
    // Camera fetches data from world
    // Camera will know what chunks it needs to render (logical grid), so it will fetch from world
    //      Possible optimalization here
    // Camera don't know what entities it needs to render, so it will box-cast all entities
    //      Again there's a possible optimalization here
    Camera2D.prototype.update = function () {
        //TODO: update position
        if (this.target_id != null) {
            this.target = this.world.entities[this.target_id];
        }
        if (this.target != null) {
            this.position = this.target.position;
        }
        this._raycast_box.x = this.position.x - (this.resolution.x / this.tile_size.x / 2);
        this._raycast_box.y = this.position.y - (this.resolution.y / this.tile_size.y / 2);
        this._raycast_box.w = this.resolution.x / this.tile_size.x;
        this._raycast_box.h = this.resolution.y / this.tile_size.y;
    };
    Camera2D.prototype.set_target = function (target) {
        this.target = target;
    };
    Camera2D.prototype.set_targetid = function (target_id) {
        this.target_id = target_id;
    };
    // this, works as intented
    Camera2D.prototype.world_to_screen_position = function (position) {
        var res;
        res = Point.sub(position, this._raycast_box);
        res = Point.mul(res, this.tile_size);
        return res;
    };
    Camera2D.prototype.screen_to_world_position = function (position) {
        var res;
        res = Point.div(position, this.tile_size);
        res = Point.add(res, this._raycast_box);
        res.x = Math.floor(res.x);
        res.y = Math.floor(res.y);
        return res;
    };
    Camera2D.prototype.render_chunks = function () {
        //! Q: what represents (0,0) coordinates? Center of world? Is that in middle of chunk, or edge of chunk?
        //Step 1: Render Chunks
        var chunk_coords = { x: 0, y: 0 };
        var draw_size = { x: 0, y: 0 };
        draw_size.x = ChunksSettings.chunk_size * this.tile_size.x;
        draw_size.y = ChunksSettings.chunk_size * this.tile_size.y;
        var chunk_raycast = Rect.div(this._raycast_box, ChunksSettings.chunk_size);
        //* Fun fact: In JS we can use NOT NOT to get integer from number ~~(a/b)
        //! What about camera zoom?
        // NOTE: I'm using floor to get -3 for -2.3
        chunk_coords.x = Math.floor(chunk_raycast.x);
        chunk_coords.y = Math.floor(chunk_raycast.y);
        //Next we need to know position of chunk on screen
        var screen_position = { x: 0, y: 0 };
        screen_position.x = (chunk_coords.x - chunk_raycast.x) * draw_size.x;
        screen_position.y = (chunk_coords.y - chunk_raycast.y) * draw_size.y;
        var chunk; //TODO: get chunk & request render
        while (screen_position.y < this.resolution.y) {
            while (screen_position.x < this.resolution.x) {
                screen_position.x = (chunk_coords.x - chunk_raycast.x) * draw_size.x;
                chunk = this.world.getChunck(chunk_coords);
                chunk_coords.x += 1;
                if (chunk === undefined)
                    continue;
                chunk.render();
                //todo: reduce renders
                this.target_renderer.drawImage(chunk._renderer, screen_position.x, screen_position.y, draw_size.x, draw_size.y //target (w,h)
                );
            }
            chunk_coords.x = Math.floor(chunk_raycast.x);
            chunk_coords.y += 1;
            screen_position.y = (chunk_coords.y - chunk_raycast.y) * draw_size.y;
            screen_position.x = (chunk_coords.x - chunk_raycast.x) * draw_size.x;
        }
    };
    Camera2D.prototype.render_tooltip = function (object_id) {
        if (object_id == null)
            return;
        var object = this.world.entities[object_id];
        var position = this.world_to_screen_position(object.position);
        // todo, dynamic size calculation
        var size = new Point(100, 20);
        // background
        this.target_renderer.beginPath();
        this.target_renderer.fillStyle = "#111";
        this.target_renderer.fillRect(position.x, position.y, size.x, size.y);
        // text
        this.target_renderer.fillStyle = '#EEE';
        position = Point.add(position, new Point(0, 10));
        this.target_renderer.fillText("id: ".concat(object_id, "\n pos:").concat(object.position.x, ", ").concat(object.position.y), position.x, position.y);
        this.target_renderer.closePath();
    };
    Camera2D.prototype.render = function () {
        this.selected_entity_id = null;
        var mouse_world_pos = this.screen_to_world_position(Mouse.local_position);
        //TODO: remove that clear
        this.target_renderer.beginPath();
        this.target_renderer.fillStyle = "#111";
        this.target_renderer.fillRect(0, 0, this.resolution.x, this.resolution.y);
        this.target_renderer.closePath();
        this.render_chunks();
        // Step 2: render entities
        var render_hitbox = new Rect();
        for (var key in this.world.entities) {
            // TODO: find a better way to render player
            var entity = this.world.entities[key];
            render_hitbox.x = entity.position.x;
            render_hitbox.y = entity.position.y;
            render_hitbox.w = entity.render_size.x;
            render_hitbox.h = entity.render_size.y;
            if (Rect.intersect(render_hitbox, this._raycast_box)) {
                if (Rect.point_in(render_hitbox, mouse_world_pos)) {
                    this.selected_entity_id = key;
                }
                // ! Assumption: entity position is at render is (x/2, 0) - middle at bottom
                // TODO: next this thing you need to do
                //Draw
                entity.render();
                var screen_pos = this.world_to_screen_position(entity.position);
                var render_size = Point.mul(entity.render_size, this.tile_size);
                this.target_renderer.drawImage(entity._renderer, screen_pos.x, screen_pos.y, render_size.x, render_size.y);
            }
        }
        // Step 3: HUD, and effects
        // TODO: simplify math
        var pos = this.world_to_screen_position(this.screen_to_world_position(Mouse.local_position));
        this.target_renderer.drawImage(Assets.getImage("select"), pos.x, pos.y, this.tile_size.x, this.tile_size.y);
        this.target_renderer.fillStyle = "#EEE";
        this.target_renderer.fillText("world pos: x: " + mouse_world_pos.x + " y:" + mouse_world_pos.y, 0, 10);
        this.target_renderer.fillText("Mouse local pos: x: " + Mouse.local_position.x + " y:" + Mouse.local_position.y, 0, 20);
        // Tooltip
        this.render_tooltip(this.selected_entity_id);
    };
    return Camera2D;
}());
export { Camera2D };
//# sourceMappingURL=Camera2D.js.map