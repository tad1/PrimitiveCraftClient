import { Change } from "../game_specifics/change.js";
import {Entity, Point, Assets} from "../core/core.js"
import { HandledAction } from "../RTCDispatcher.js";
import { World } from "../game_specifics/World.js";
import { ItemType } from "./item.js";

export class ResourceNode implements Entity{
    id: number;
    set_position: Point;
    set_velocity: Point;
    position: Point;
    position_error: Point;
    _renderer: HTMLCanvasElement | HTMLImageElement;
    render_size: Point = {x: 1, y: 2};;
    image : any;
    hp : number = 3
    item_type : ItemType;

    constructor(world: World, type: ItemType, hp : number){
        this.item_type = type
        this.world = world
        this.hp = hp

        this._renderer =  Assets.getImage(`node_${type}_${this.hp}`)
    }
    world: World;
    events: Array<Change> = [];

    tick(): void {
        this.events.forEach(change => {
            console.log(change.Property)
            if(change.Property == "hp"){
                if(change.Value.New == null){
                    delete this.world.entities[change.Id]
                } else {
                    console.log(change.Value.New)
                    this.hp = change.Value.New
                    console.log(`node_${this.item_type}_${this.hp}`)
                    this._renderer =  Assets.getImage(`node_${this.item_type}_${this.hp}`)
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
