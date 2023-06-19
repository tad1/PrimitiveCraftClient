import {Entity, Point, Time, Assets} from "../core/core.js"
import { ChunksSettings } from "../config/config.js";
import { HandledAction, ServerActionType } from "../RTCDispatcher.js";
import { Change } from "../game_specifics/change.js";
import { Item } from "./item.js";
import { World } from "src/game_specifics/World";

export class Player implements Entity{
    world: World;
    events: Array<Change> = [];
    // TODO: get better
    render_size: Point = {x: 1, y: 1};
    _renderer: HTMLCanvasElement = null;
    id: number;
    set_position: Point = new Point(0,0);
    set_velocity: Point = new Point(0,0);
    position: Point = new Point(0,0);
    position_error: Point = new Point(0,0);
    speed = 100/ChunksSettings.tile_subsections;
    max_error = 1/2

    hand : Item
    
    constructor(world:World){
        this.world = world
    }

    tick(): void {
        // 10ms tick - 1/8
        // try get set position

        this.events.forEach(change => {
            if(change.Property == "position"){
                console.log(change.Value.New)
                this.set_position.x = change.Value.New.X / ChunksSettings.tile_subsections
                this.set_position.y = change.Value.New.Y / ChunksSettings.tile_subsections

                this.position_error = Point.sub(this.set_position, this.position)
                if( Point.mag(this.position_error) > this.max_error){
                    // Assets.playSFX("bonk")
                    this.position = this.set_position;
                }
            }
            if(change.Property == "move_vec"){
                this.set_velocity.x = change.Value.New.X
                this.set_velocity.y = change.Value.New.Y
            }
            if(change.Property == "item"){
                if(change.Value.New == null){
                    this.hand = null
                }
                else{
                    console.log("Picked up item")
                    this.hand = new Item(this.world,change.Value.New.Type)
                }
            }
        });

        this.events = []
    }
    fixedUpdate(): void {
        this.position.x += this.set_velocity.x * this.speed * Time.fixed_delta_time;
        this.position.y += this.set_velocity.y * this.speed * Time.fixed_delta_time;
        // this.position_error = 
        // this.position = this.set_position;

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