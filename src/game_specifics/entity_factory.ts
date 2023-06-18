import { Item, ItemType } from "../entities/item.js";
import { Player } from "../entities/player.js";
import { World } from "./World.js";
import { Point } from "../core/point.js";

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
        console.log(object)
        if (object.TypeName == "placed_item"){
            // TODO: get name
            let item = new Item((object as ItemServer).Item.Type)
            item.position = new Point(object.Position.X, object.Position.Y)
            this.world.entities[id] = item
        } else if (object.TypeName == "entity_player"){
            this.world.entities[id] = new Player();
        }
    }
}