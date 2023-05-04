import {Point} from "src/core/core"


export class Rect{
    x: number = 0
    y: number = 0
    w: number = 0
    h: number = 0

    static intersect(a : Rect, b : Rect) : boolean {
        return (
          a.x <= b.x + b.w &&
          a.x + a.w >= b.x &&
          a.y <= b.y + b.h &&
          a.y + a.h >= b.y
        )
    }

    static div(a : Rect, b : number) : Point{
        let res = new Rect();
        res.x = a.x / b
        res.y = a.y / b
        res.w = a.w / b
        res.h = a.h / b
        return res;
    }
      
}