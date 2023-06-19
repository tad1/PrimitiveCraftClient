var _Renderer = /** @class */ (function () {
    function _Renderer() {
    }
    _Renderer.prototype.add_renderer = function (canvas) {
        this.renderers.push(canvas);
    };
    _Renderer.prototype.render = function () {
        var _this = this;
        this.renderers.forEach(function (renderer) {
            _this.canvas.drawImage(renderer.canvas, 0, 0);
        });
    };
    return _Renderer;
}());
//# sourceMappingURL=_Renderer.js.map