// A game specific data structure
// ! How it works:
// World loosely holds data, it's unordered.
// In assumption world never have current state, it stores the past state.
// That's why it needs to simulate current state of world.
// The resources needs to be offloaded, the chunks and entities will be removed based on algorithm.
var World = /** @class */ (function () {
    function World() {
        //Later I need to think of better solution, some sort of numeric comparasion
        this.chunks = {};
        this.entities = {};
    }
    World.prototype.tick = function () {
        //NOTE: during tick update, it's determined whenever object should be unloaded
        for (var key in this.chunks) {
            this.chunks[key].tick();
            if (this.chunks[key]._ticket == Ticket.OFFLOAD) {
                delete this.chunks[key];
            }
            //or should I use `for...of`??
        }
        //TODO: check if for-of isn't a better option
        for (var id in this.entities) {
            this.entities[id].tick();
        }
        //TODO: offload
    };
    World.prototype.getChunck = function (cords) {
        //TODO: create that hash function
        var hash = cords.x.toString() + "@" + cords.y.toString();
        return this.chunks[hash];
    };
    return World;
}());
//# sourceMappingURL=World.js.map