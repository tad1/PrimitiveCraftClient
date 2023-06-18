export class Point{
    public x : number = 0
    public y : number = 0
    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }
    static add(a : Point, b: Point) : Point{
        return new Point(a.x + b.x, a.y + b.y);
    }
    static sub(a : Point, b : Point) : Point{
        return new Point(a.x - b.x, a.y - b.y)
    }
    static mul(a : Point, b : Point) : Point{
        return new Point(a.x * b.x, a.y * b.y);
    }
    static div(a : Point, b : Point) : Point{
        return new Point(a.x / b.x, a.y / b.y);
    }
    static mag(a : Point) : number{
        return a.x*a.x + a.y*a.y
    }

}