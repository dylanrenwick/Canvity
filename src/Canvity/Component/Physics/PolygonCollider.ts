namespace Canvity.Component.Physics {
    export class PolygonCollider extends RectCollider {
        private vertices: Array<Util.Vector2>;

        public get Rect(): Util.Rect { return this.rect; }
        public set Rect(val: Util.Rect) { this.rect = val;}

        public constructor(...vertices: Array<Util.Vector2>) {
            super();

            this.vertices = vertices;
            let minX = vertices.map(x => x.X).reduce((a, b) => Math.min(a, b));
            let maxX = vertices.map(x => x.X).reduce((a, b) => Math.max(a, b));
            let minY = vertices.map(x => x.Y).reduce((a, b) => Math.min(a, b));
            let maxY = vertices.map(x => x.Y).reduce((a, b) => Math.max(a, b));

            this.Rect = new Util.Rect(minX, minY, maxX - minX, maxY - minY);
        }

        public CheckIsCollision(point: Util.Vector2): boolean {
            let rectTest: boolean = super.CheckIsCollision(point);
            if (!rectTest) return rectTest;

            let lineIntersections: number = 0;
            // Raycast to the point from <0, 0>, count number of side collisions with raycast
            let raycastOrigin: Util.Vector2 = new Util.Vector2();
            for(let i: number = 0; i < this.vertices.length; i++) {
                let a = this.vertices[i];
                let b = (i + 1 >= this.vertices.length) ? this.vertices[(i + 1) % this.vertices.length] : this.vertices[i + 1];

                if (this.lineIsIntersecting(a, b, raycastOrigin, point)) {
                    lineIntersections++;
                }
            }

            // If there are an odd number of collisions, point is inside the polygon
            return lineIntersections % 2 === 1;
        }

        private lineIsIntersecting(a: Util.Vector2, b: Util.Vector2, c: Util.Vector2, d: Util.Vector2): boolean {
            let denominator: number = ((b.X - a.X) * (d.Y - c.Y)) - ((b.Y - a.Y) * (d.X - c.X));
            let numerator1: number = ((a.Y - c.Y) * (d.X - c.X)) - ((a.X - c.X) * (d.Y - c.Y));
            let numerator2: number = ((a.Y - c.Y) * (b.X - a.X)) - ((a.X - c.X) * (b.Y - a.Y));

            if (denominator == 0) return numerator1 == 0 && numerator2 == 0;

            let r: number = numerator1 / denominator;
            let s: number = numerator2 / denominator;

            return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
        }
    }
}