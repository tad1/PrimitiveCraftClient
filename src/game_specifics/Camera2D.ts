import {Entity, Point, Mouse, Assets} from "../core/core"
import { Rect } from "./rect";
import {ChunkCord, Chunk} from "./chunk";
import { ChunksSettings} from "../config/config";
import { World } from "./World";


//Camera in 2D world
export class Camera2D {
    position: Point; //center of camera
    resolution: Point; //practically it's resolution
    size: number; // more like a zoom, determines size of camera
    tile_size: Point; // size translated to game grid, pixels per grid
    _raycast_box: Rect; // result of raycast box (x1,y1, x2,y2)
    world: World;

    buffer: any; // stores data that is visible.
    target_renderer: CanvasRenderingContext2D;
    target: Entity = null;


    constructor(world: World) {
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
    update() {
        //TODO: update position
        if (this.target != null) {
            this.position = this.target.position;
        }

        this._raycast_box.x = this.position.x - (this.resolution.x / this.tile_size.x / 2);
        this._raycast_box.y = this.position.y - (this.resolution.y / this.tile_size.y / 2);
        this._raycast_box.w = this.resolution.x / this.tile_size.x;
        this._raycast_box.h = this.resolution.y / this.tile_size.y;
    }

    set_target(target: Entity) {
        this.target = target;
    }

    // this, works as intented
    world_to_screen_position(position: Point): Point {
        let res: Point;
        res = Point.sub(position, this._raycast_box);
        res = Point.mul(res, this.tile_size);
        return res;
    }

    screen_to_world_position(position: Point): Point {
        let res: Point;
        res = Point.div(position, this.tile_size);
        res = Point.add(res, this._raycast_box);
        res.x = Math.floor(res.x);
        res.y = Math.floor(res.y);
        return res;
    }


    render_chunks() {
        //! Q: what represents (0,0) coordinates? Center of world? Is that in middle of chunk, or edge of chunk?
        //Step 1: Render Chunks
        let chunk_coords: ChunkCord = { x: 0, y: 0 };

        let draw_size: Point = { x: 0, y: 0 };
        draw_size.x = ChunksSettings.chunk_size * this.tile_size.x;
        draw_size.y = ChunksSettings.chunk_size * this.tile_size.y;

        let chunk_raycast = Rect.div(this._raycast_box, ChunksSettings.chunk_size);

        //* Fun fact: In JS we can use NOT NOT to get integer from number ~~(a/b)
        //! What about camera zoom?
        // NOTE: I'm using floor to get -3 for -2.3
        chunk_coords.x = Math.floor(chunk_raycast.x);
        chunk_coords.y = Math.floor(chunk_raycast.y);

        //Next we need to know position of chunk on screen
        let screen_position: Point = { x: 0, y: 0 };
        screen_position.x = (chunk_coords.x - chunk_raycast.x) * draw_size.x;
        screen_position.y = (chunk_coords.y - chunk_raycast.y) * draw_size.y;

        var chunk: Chunk; //TODO: get chunk & request render
        while (screen_position.y < this.resolution.y) {
            while (screen_position.x < this.resolution.x) {
                screen_position.x = (chunk_coords.x - chunk_raycast.x) * draw_size.x;

                chunk = this.world.getChunck(chunk_coords);
                chunk_coords.x += 1;
                if (chunk === undefined)
                    continue;
                chunk.render();
                //todo: reduce renders
                this.target_renderer.drawImage(
                    chunk._renderer,
                    screen_position.x, screen_position.y,
                    draw_size.x, draw_size.y //target (w,h)
                );
            }
            chunk_coords.x = Math.floor(chunk_raycast.x);
            chunk_coords.y += 1;


            screen_position.y = (chunk_coords.y - chunk_raycast.y) * draw_size.y;
            screen_position.x = (chunk_coords.x - chunk_raycast.x) * draw_size.x;

        }
    }

    render(): void {

        //TODO: remove that clear
        this.target_renderer.beginPath();
        this.target_renderer.fillStyle = "#111";
        this.target_renderer.fillRect(0, 0, this.resolution.x, this.resolution.y);
        this.target_renderer.closePath();

        this.render_chunks();

        // Step 2: render entities
        let render_hitbox: Rect = new Rect();
        for (const key in this.world.entities) {
            // TODO: find a better way to render player
            let entity = this.world.entities[key];
            render_hitbox.x = entity.position.x;
            render_hitbox.y = entity.position.y;
            render_hitbox.w = 1;
            render_hitbox.h = 1;

            if (Rect.intersect(render_hitbox, this._raycast_box)) {
                // ! Assumption: entity position is at render is (x/2, 0) - middle at bottom
                // TODO: next this thing you need to do
                //Draw
                entity.render();
                let screen_pos = this.world_to_screen_position(entity.position);
                this.target_renderer.drawImage(entity._renderer, screen_pos.x, screen_pos.y, this.tile_size.x, this.tile_size.y);
            }
        }

        // Step 3: HUD, and effects
        // TODO: simplify math
        let pos: Point = this.world_to_screen_position(this.screen_to_world_position(Mouse.local_position));
        this.target_renderer.drawImage(Assets.getImage("select"), pos.x, pos.y, this.tile_size.x, this.tile_size.y);

        let world_pos = this.screen_to_world_position(Mouse.local_position);
        this.target_renderer.fillStyle = "#EEE";
        this.target_renderer.fillText("world pos: x: " + world_pos.x + " y:" + world_pos.y, 0, 10);
        this.target_renderer.fillText("Mouse local pos: x: " + Mouse.local_position.x + " y:" + Mouse.local_position.y, 0, 20);

    }
}
