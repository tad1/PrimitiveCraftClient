import { Point } from "../core/point.js"

//For ease in development, I give you this enum.
export enum Action{
    Attack,
    Useage,
    Place,
    Pickup,
    MoveLeft,
    MoveRight,
    MoveUp,
    MoveDown
}

//!Q: class, or interface?
export interface Asset {
    id: string
    url: any
    type: AssetType
    hash: string
}

export enum AssetType {
    Sprite = "sprite",
    Audio = "audio"
}

export const ChunksSettings = {
    chunk_size : 256/8, //32
    tile_subsections : 8,
    pos_mul : new Point(8,8),
    tile_size: 16,
    render_distance: 3 
}