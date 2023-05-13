import {Entity, Point, Time, Assets} from "../core/core.js"
import { ChunksSettings } from "../config/config.js";
import { HandledAction, ServerActionType } from "src/RTCDispatcher";

export class Player implements Entity{
    events: Array<HandledAction> = [];
    // TODO: get better
    render_size: Point = {x: 48, y: 48};
    _renderer: HTMLCanvasElement = null;
    id: number;
    set_position: Point = new Point(0,0);
    set_velocity: Point = new Point(0,0);
    position: Point = new Point(0,0);
    position_error: Point = new Point(0,0);
    speed = 5;

    hand : Entity
    
    tick(): void {
        throw new Error("Method not implemented.");
        // try get set position
    }
    fixedUpdate(): void {
        this.position.x += this.set_velocity.x * Time.fixed_delta_time;
        this.position.y += this.set_velocity.y * Time.fixed_delta_time;
    }
    render(): void {
        if (this._renderer === null){
            this._renderer = document.createElement('canvas');
            this._renderer.width = ChunksSettings.tile_size;
            this._renderer.height = ChunksSettings.tile_size;
        }
        const context = this._renderer.getContext("2d");
        context.clearRect(0,0, ChunksSettings.tile_size, ChunksSettings.tile_size)
        context.drawImage(Assets.getImage("player"), 0,ChunksSettings.tile_size, ChunksSettings.tile_size, -Math.sin(Time.time*4)*ChunksSettings.tile_size/8 - 7*ChunksSettings.tile_size/8);
        if(this.hand != null)
            context.drawImage(this.hand._renderer, 0,0, ChunksSettings.tile_size, ChunksSettings.tile_size)
    }

}