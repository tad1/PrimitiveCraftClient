import { Assets } from "../core/core.js";
var Item = /** @class */ (function () {
    function Item(world, type) {
        this.render_size = { x: 1, y: 1 };
        this.events = [];
        this.item_type = type;
        this.world = world;
        this._renderer = Assets.getImage("item_".concat(type));
    }
    ;
    Item.prototype.tick = function () {
        var _this = this;
        this.events.forEach(function (change) {
            if (change.Property == "item") {
                if (change.Value.New == null) {
                    delete _this.world.entities[change.Id];
                }
                else {
                    _this.item_type = change.Value.New.Type;
                    _this._renderer = Assets.getImage("item_".concat(_this.item_type));
                }
            }
        });
        this.events = [];
    };
    Item.prototype.fixedUpdate = function () {
    };
    Item.prototype.render = function () {
    };
    return Item;
}());
export { Item };
export var ItemType;
(function (ItemType) {
    ItemType[ItemType["_"] = 0] = "_";
    ItemType[ItemType["Rock"] = 1] = "Rock";
    ItemType[ItemType["Stick"] = 2] = "Stick";
    ItemType[ItemType["Axe"] = 3] = "Axe";
    ItemType[ItemType["Wood"] = 4] = "Wood";
    ItemType[ItemType["Plank"] = 5] = "Plank";
})(ItemType || (ItemType = {}));
//# sourceMappingURL=item.js.map