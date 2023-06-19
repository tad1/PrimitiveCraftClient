var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Point.add = function (a, b) {
        return new Point(a.x + b.x, a.y + b.y);
    };
    Point.sub = function (a, b) {
        return new Point(a.x - b.x, a.y - b.y);
    };
    Point.mul = function (a, b) {
        return new Point(a.x * b.x, a.y * b.y);
    };
    Point.div = function (a, b) {
        return new Point(a.x / b.x, a.y / b.y);
    };
    Point.mag = function (a) {
        return a.x * a.x + a.y * a.y;
    };
    return Point;
}());
export { Point };
//# sourceMappingURL=point.js.map