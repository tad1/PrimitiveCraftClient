import {Entity, Point, Assets} from "../core/core.js"

export class Item implements Entity{
    id: number;
    set_position: Point;
    set_velocity: Point;
    position: Point;
    position_error: Point;
    _renderer: HTMLCanvasElement | HTMLImageElement;
    render_size: Point;
    image : any;
    item_type : string;

    constructor(name: string){
        this.item_type = name
        this._renderer =  Assets.getImage(name)
    }

    tick(): void {
    }
    fixedUpdate(): void {
    }
    render(): void {
    }

}