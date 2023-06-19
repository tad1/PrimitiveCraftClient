import { Point } from "../core/point.js";
//For ease in development, I give you this enum.
export var Action;
(function (Action) {
    Action[Action["Attack"] = 0] = "Attack";
    Action[Action["Useage"] = 1] = "Useage";
    Action[Action["Place"] = 2] = "Place";
    Action[Action["Pickup"] = 3] = "Pickup";
    Action[Action["MoveLeft"] = 4] = "MoveLeft";
    Action[Action["MoveRight"] = 5] = "MoveRight";
    Action[Action["MoveUp"] = 6] = "MoveUp";
    Action[Action["MoveDown"] = 7] = "MoveDown";
})(Action || (Action = {}));
export var AssetType;
(function (AssetType) {
    AssetType["Sprite"] = "sprite";
    AssetType["Audio"] = "audio";
})(AssetType || (AssetType = {}));
export var ChunksSettings = {
    chunk_size: 256 / 8,
    tile_subsections: 8,
    pos_mul: new Point(8, 8),
    tile_size: 16,
    render_distance: 3
};
//# sourceMappingURL=config.js.map