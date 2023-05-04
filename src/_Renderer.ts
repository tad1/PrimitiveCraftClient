export class _Renderer {
    renderers: Array<CanvasRenderingContext2D>;
    canvas: CanvasRenderingContext2D;

    add_renderer(canvas: CanvasRenderingContext2D) {
        this.renderers.push(canvas);
    }

    render() {
        this.renderers.forEach((renderer) => {
            this.canvas.drawImage(renderer.canvas, 0, 0);
        });
    }
}
