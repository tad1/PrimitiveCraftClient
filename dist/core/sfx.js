// Future api, not used
// In future api you can:
//  - define own parametrized SFX
//  - set local and global parameters to SFX
//  - will allow to use predefined effects
//  - will wrap WebAPI to minimalise cost
var _SFX = /** @class */ (function () {
    function _SFX() {
        this.nodes = {};
        // TODO: move this to Audio, and instead move this to sfx AudioNode??
        this.audioContext = new AudioContext();
    }
    _SFX.prototype.load = function (record) {
        for (var key in record) {
            this.nodes[key] = this.audioContext.createMediaElementSource(record[key]);
            this.nodes[key].connect(this.audioContext.destination);
        }
    };
    _SFX.prototype.getSFX = function (key) {
        return this.nodes[key];
    };
    return _SFX;
}());
//# sourceMappingURL=sfx.js.map