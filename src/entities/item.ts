import { Change } from "../game_specifics/change.js";
import {Entity, Point, Assets} from "../core/core.js"
import { HandledAction } from "../RTCDispatcher.js";
import { World } from "../game_specifics/World.js";

export class Item implements Entity{
    id: number;
    set_position: Point;
    set_velocity: Point;
    position: Point;
    position_error: Point;
    _renderer: HTMLCanvasElement | HTMLImageElement;
    render_size: Point = {x: 1, y: 1};;
    image : any;
    item_type : ItemType;

    constructor(world: World, type: ItemType){
        this.item_type = type
        this.world = world

        this._renderer =  Assets.getImage(`item_${type}`)
    }
    world: World;
    events: Array<Change> = [];

    tick(): void {
        this.events.forEach(change => {
            if(change.Property == "item"){
                if(change.Value.New == null){
                    delete this.world.entities[change.Id]
                } else {
                    this.item_type = change.Value.New.Type
                    this._renderer =  Assets.getImage(`item_${this.item_type}`)
                }
            }
        });
        this.events = []
    }
    fixedUpdate(): void {
    }
    render(): void {
    }

}

export enum ItemType {
	_ = 0, // skip 0 for bug catching
	Rock,
	Stick,
	Axe
}