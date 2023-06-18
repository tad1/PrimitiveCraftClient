import {Entity, Point, Assets} from "../core/core.js"
import { HandledAction } from "../RTCDispatcher.js";

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

    constructor(type: ItemType){
        this.item_type = type

        this._renderer =  Assets.getImage(`item_${type}`)
    }
    events: HandledAction[];

    tick(): void {
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