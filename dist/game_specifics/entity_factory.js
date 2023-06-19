import { Item } from "../entities/item.js";
import { Player } from "../entities/player.js";
import { Point } from "../core/point.js";
import { ChunksSettings } from "../config/config.js";
import { ResourceNode } from "../entities/resource_node.js";
var EntityFactory = /** @class */ (function () {
    function EntityFactory(world) {
        this.world = world;
    }
    // TODO: move this responsibility
    EntityFactory.prototype.register = function (type, cls) {
        // TODO: for later
    };
    EntityFactory.prototype.create_from_server = function (id, object) {
        if (object.TypeName == "placed_item") {
            // TODO: get name
            if (object.Item == null)
                return;
            var item = new Item(this.world, object.Item.Type);
            item.position = new Point(object.Position.X, object.Position.Y);
            item.position = Point.div(item.position, new Point(ChunksSettings.tile_subsections, ChunksSettings.tile_subsections));
            item.position.x = Math.floor(item.position.x);
            item.position.y = Math.floor(item.position.y);
            this.world.entities[id] = item;
        }
        else if (object.TypeName == "entity_player") {
            var player = new Player(this.world);
            player.set_position = new Point(object.Position.X, object.Position.Y);
            player.set_position = Point.div(player.set_position, new Point(ChunksSettings.tile_subsections, ChunksSettings.tile_subsections));
            if (this.world.entities[id]) {
                player.position = this.world.entities[id].position;
                player.set_velocity = this.world.entities[id].set_velocity;
            }
            else {
                player.position = player.set_position;
            }
            // TODO: remove this hard code
            if (object.Inventory[0].Item != null) {
                var item = new Item(this.world, object.Inventory[0].Item.Type);
                player.hand = item;
            }
            this.world.entities[id] = player;
            console.log(object);
            // TODO: add item
        }
        else if (object.TypeName == "resource_node") {
            var item = new ResourceNode(this.world, object.ItemId, object.HP);
            item.position = new Point(object.Position.X, object.Position.Y);
            item.position = Point.div(item.position, new Point(ChunksSettings.tile_subsections, ChunksSettings.tile_subsections));
            item.position.x = Math.floor(item.position.x);
            item.position.y = Math.floor(item.position.y);
            this.world.entities[id] = item;
        }
    };
    return EntityFactory;
}());
export { EntityFactory };
//# sourceMappingURL=entity_factory.js.map