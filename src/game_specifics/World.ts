
import {Entity} from "../core/core.js"
import { Chunk, Ticket, ChunkCord } from "./chunk.js";

// A game specific data structure
// ! How it works:
// World loosely holds data, it's unordered.
// In assumption world never have current state, it stores the past state.
// That's why it needs to simulate current state of world.
// The resources needs to be offloaded, the chunks and entities will be removed based on algorithm.
export class World {
    //Later I need to think of better solution, some sort of numeric comparasion
    chunks: Record<string, Chunk> = {};
    entities: Record<string, Entity> = {};


    tick() {
        //NOTE: during tick update, it's determined whenever object should be unloaded
        for (const key in this.chunks) {
            this.chunks[key].tick();

            if (this.chunks[key]._ticket == Ticket.OFFLOAD) {
                delete this.chunks[key];
            }
            //or should I use `for...of`??
        }

        //TODO: check if for-of isn't a better option
        for (let id in this.entities) {
            this.entities[id].tick();
        }

        //TODO: offload
    }

    getChunck(cords: ChunkCord): Chunk {
        //TODO: create that hash function
        let hash: string = cords.x.toString() + "@" + cords.y.toString();
        return this.chunks[hash];
    }
}
