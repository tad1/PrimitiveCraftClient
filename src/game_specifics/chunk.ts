import { Assets } from "../core/assets";
import { ChunksSettings } from "../config/config";

export interface ChunkCord{
    x: number //TODO: add integer specifics here!
    y: number
}


export enum Ticket{
    VALID,
    OFFLOAD
};

//TODO: find solution for chunk ticketing
export class Chunk{
    _cords : [number, number] //chunk coordinate relative from spawn
    _ticket : Ticket = Ticket.VALID;
    _renderer : HTMLCanvasElement = null

    
    render(){
        // TODO: make rendering word pos based.?
        if (this._renderer === null){
            this._renderer = document.createElement('canvas');
            this._renderer.width = ChunksSettings.chunk_size * ChunksSettings.tile_size;
            this._renderer.height = ChunksSettings.chunk_size * ChunksSettings.tile_size;
            this._renderer.getContext("2d").filter = "none";
        }

        const context = this._renderer.getContext("2d");
        for (let i = 0; i < ChunksSettings.chunk_size; i++) {
            for (let ii = 0; ii < ChunksSettings.chunk_size; ii++) {
                //TODO: get cell and render
                context.drawImage(Assets.getImage("tmp"), ii * ChunksSettings.tile_size, i*ChunksSettings.tile_size);
            }
        }
        //Renders chunk to it's renderer
        //Chunck is rendered only when it's updated, and in view.
    }

    tick(){
        //TODO
    }
}