import { Assets } from "../core/assets.js";
import { ChunksSettings } from "../config/config.js";
export var Ticket;
(function (Ticket) {
    Ticket[Ticket["VALID"] = 0] = "VALID";
    Ticket[Ticket["OFFLOAD"] = 1] = "OFFLOAD";
})(Ticket || (Ticket = {}));
;
//TODO: find solution for chunk ticketing
var Chunk = /** @class */ (function () {
    function Chunk() {
        this._ticket = Ticket.VALID;
        this._renderer = null;
    }
    Chunk.prototype.render = function () {
        // TODO: make rendering word pos based.?
        if (this._renderer === null) {
            this._renderer = document.createElement('canvas');
            this._renderer.width = ChunksSettings.chunk_size * ChunksSettings.tile_size;
            this._renderer.height = ChunksSettings.chunk_size * ChunksSettings.tile_size;
            this._renderer.getContext("2d").filter = "none";
        }
        var context = this._renderer.getContext("2d");
        for (var i = 0; i < ChunksSettings.chunk_size; i++) {
            for (var ii = 0; ii < ChunksSettings.chunk_size; ii++) {
                //TODO: get cell and render
                context.drawImage(Assets.getImage("grass_".concat((i * ii + i) % 3)), ii * ChunksSettings.tile_size, i * ChunksSettings.tile_size);
            }
        }
        //Renders chunk to it's renderer
        //Chunck is rendered only when it's updated, and in view.
    };
    Chunk.prototype.tick = function () {
        //TODO
    };
    return Chunk;
}());
export { Chunk };
//# sourceMappingURL=chunk.js.map