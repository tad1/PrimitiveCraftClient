var Rect = /** @class */ (function () {
    function Rect() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
    }
    Rect.intersect = function (a, b) {
        return (a.x <= b.x + b.w &&
            a.x + a.w >= b.x &&
            a.y <= b.y + b.h &&
            a.y + a.h >= b.y);
    };
    Rect.point_in = function (a, b) {
        return (a.x <= b.x &&
            a.x + a.w > b.x &&
            a.y <= b.y &&
            a.y + a.h > b.y);
    };
    Rect.div = function (a, b) {
        var res = new Rect();
        res.x = a.x / b;
        res.y = a.y / b;
        res.w = a.w / b;
        res.h = a.h / b;
        return res;
    };
    return Rect;
}());
export { Rect };
//# sourceMappingURL=rect.js.map