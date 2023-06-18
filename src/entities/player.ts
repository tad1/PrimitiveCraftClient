import {Entity, Point, Time, Assets} from "../core/core.js"
import { ChunksSettings } from "../config/config.js";
import { HandledAction, ServerActionType } from "../RTCDispatcher.js";

export class Player implements Entity{
    events: Array<HandledAction> = [];
    // TODO: get better
    render_size: Point = {x: 1, y: 1};
    _renderer: HTMLCanvasElement = null;
    id: number;
    set_position: Point = new Point(0,0);
    set_velocity: Point = new Point(0,0);
    position: Point = new Point(0,0);
    position_error: Point = new Point(0,0);
    speed = 1;

    hand : Entity
    

    tick(): void {
        
        // try get set position
        // TODO: just ignore the skipped ticks, only for movement?
        this.events.forEach(element => {
            if(element.Action.Action = ServerActionType.Tick && element.Changes != null){
                element.Changes.forEach((change: any) => {
                    if(change.Property == "position"){
                        this.set_position.x = change.Value.New.X
                        this.set_position.y = change.Value.New.Y
                        console.log({...change})
                    } else if(change.Property != "move_vec"){
                        console.log({...change})
                    }
                });
            } else if (element.Action.Action != ServerActionType.Move){
                console.log({...element})
            }
        });

        this.events = []
    }
    fixedUpdate(): void {
        this.position = this.set_position;
        // this.position.x += this.set_velocity.x * Time.fixed_delta_time;
        // this.position.y += this.set_velocity.y * Time.fixed_delta_time;
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