//For ease in development, I give you this enum.
export enum Action{
    Attack,
    Useage,
    Place,
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
}

export const ChunksSettings = {
    chunk_size : 8,
    tile_size: 16,
    render_distance: 3 
}