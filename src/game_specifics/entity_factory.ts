import { Item, ItemType } from "../entities/item.js";
import { Player } from "../entities/player.js";
import { World } from "./World.js";
import { Point } from "../core/point.js";
import { ChunksSettings } from "../config/config.js";
import { ResourceNode } from "../entities/resource_node.js";

interface Entity{
    EntityId : string
    ToDelete : boolean
    TypeName : string
    Position : {X: number, Y: number}
}

interface ItemServer extends Entity{
    Item : {
        Type : ItemType
    }
}

export class EntityFactory{
    world: World
    
    constructor(world: World){
        this.world = world;
    }

    // TODO: move this responsibility
    register(type: string, cls : any){
        // TODO: for later
    }

    create_from_server(id : string, object : Entity){
        if (object.TypeName == "placed_item"){
            // TODO: get name
            if((object as ItemServer).Item == null)
                return

            let item = new Item(this.world,(object as ItemServer).Item.Type)
            item.position = new Point(object.Position.X, object.Position.Y)
            
            item.position = Point.div(item.position, new Point(ChunksSettings.tile_subsections, ChunksSettings.tile_subsections))
            
            item.position.x = Math.floor(item.position.x);
            item.position.y = Math.floor(item.position.y);
            
            this.world.entities[id] = item
        } else if (object.TypeName == "entity_player"){
            let player = new Player(this.world);

            player.set_position = new Point(object.Position.X, object.Position.Y)
            player.set_position = Point.div(player.set_position, new Point(ChunksSettings.tile_subsections, ChunksSettings.tile_subsections))
            if(this.world.entities[id]){
                player.position = this.world.entities[id].position
                player.set_velocity = this.world.entities[id].set_velocity
            } else {
                player.position = player.set_position
            }


            // TODO: remove this hard code
            if((object as any).Inventory[0].Item != null){
                let item = new Item(this.world, (object as any).Inventory[0].Item.Type)
                player.hand = item;
            }
            this.world.entities[id] = player;

            console.log(object)
            // TODO: add item
        } else if (object.TypeName == "resource_node"){
            let item = new ResourceNode(this.world,(object as any).ItemId, (object as any).HP)
            item.position = new Point(object.Position.X, object.Position.Y)
            
            item.position = Point.div(item.position, new Point(ChunksSettings.tile_subsections, ChunksSettings.tile_subsections))
            
            item.position.x = Math.floor(item.position.x);
            item.position.y = Math.floor(item.position.y);
            
            this.world.entities[id] = item   
        }
    }
}