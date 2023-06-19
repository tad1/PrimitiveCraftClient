import { Assets } from "../core/core.js";
var ResourceNode = /** @class */ (function () {
    function ResourceNode(world, type, hp) {
        this.render_size = { x: 1, y: 2 };
        this.hp = 3;
        this.events = [];
        this.item_type = type;
        this.world = world;
        this.hp = hp;
        this._renderer = Assets.getImage("node_".concat(type, "_").concat(this.hp));
    }
    ;
    ResourceNode.prototype.tick = function () {
        var _this = this;
        this.events.forEach(function (change) {
            console.log(change.Property);
            if (change.Property == "hp") {
                if (change.Value.New == null) {
                    delete _this.world.entities[change.Id];
                }
                else {
                    console.log(change.Value.New);
                    _this.hp = change.Value.New;
                    console.log("node_".concat(_this.item_type, "_").concat(_this.hp));
                    _this._renderer = Assets.getImage("node_".concat(_this.item_type, "_").concat(_this.hp));
                }
            }
        });
        this.events = [];
    };
    ResourceNode.prototype.fixedUpdate = function () {
    };
    ResourceNode.prototype.render = function () {
    };
    return ResourceNode;
}());
export { ResourceNode };
//# sourceMappingURL=resource_node.js.map