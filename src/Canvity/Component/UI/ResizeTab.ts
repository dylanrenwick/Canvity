namespace Canvity.Component.UI {
    // TODO: Refactor into smaller, more generic components
    @Canvity.Component.Requires(UI.Window, Physics.TriangleCollider)
    export class ResizeTab extends CanvasComponent {
        private color: Util.Color;
        public get Color(): Util.Color { return this.color; }
        public set Color(val: Util.Color) { this.color = val; }

        private isDragging: boolean;

        private dragStart: Util.Vector2;

        private vert1Rel: Util.Vector2;
        private vert2Rel: Util.Vector2;
        private vert3Rel: Util.Vector2;

        private window : Window;
        private collider: Physics.TriangleCollider;

        public constructor(color: Util.Color = new Util.Color(255, 255, 255, 150)) {
            super();

            this.Color = color;
            this.isDragging = false;
        }

        public Draw(deltaTime: Util.Time, ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle = this.window.Color.CssString;

            let vertices = this.collider.Vertices;

            ctx.beginPath();

            ctx.moveTo(vertices[0].X, vertices[0].Y);
            ctx.lineTo(vertices[1].X, vertices[1].Y);
            ctx.lineTo(vertices[2].X, vertices[2].Y);

            ctx.fill();

            ctx.strokeStyle = this.Color.CssString;
            ctx.lineWidth = 1;

            let rect: Util.Rect = (<RectTransform>this.Transform).Rect;

            ctx.beginPath();

            ctx.moveTo(rect.X + rect.W - 4, rect.Y + rect.H - 2);
            ctx.lineTo(rect.X + rect.W - 2, rect.Y + rect.H - 4);

            ctx.moveTo(rect.X + rect.W - 6, rect.Y + rect.H - 2);
            ctx.lineTo(rect.X + rect.W - 2, rect.Y + rect.H - 6);

            ctx.moveTo(rect.X + rect.W - 8, rect.Y + rect.H - 2);
            ctx.lineTo(rect.X + rect.W - 2, rect.Y + rect.H - 8);

            ctx.stroke();
        }

        public Update(deltaTime: Util.Time): void {
            super.Update(deltaTime);

            Messaging.MessageBus.GetGlobalMessages('input').forEach(message => { this.handleInputMessage(message); }, this);
        }

        public GetRequiredComponents(obj: CanvasObject): Array<CanvasComponent> {
            // Add the window straight away rather than returning it,
            // because this guarantees that we will have a RectTransform rather than a Transform
            if (!obj.HasComponent(Window)) this.window = <Window>obj.AddComponent(new Window(Util.Color.Black), true);
            let rect: Util.Rect = (<RectTransform>obj.Transform).Rect;
            let v1: Util.Vector2 = new Util.Vector2(rect.W, rect.H);
            let v2: Util.Vector2 = v1.Sub(new Util.Vector2(12, 0));
            let v3: Util.Vector2 = v1.Sub(new Util.Vector2(0, 12));
            let tri = new Physics.TriangleCollider(v1, v2, v3);
            this.collider = tri;
            return new Array<CanvasComponent>(tri);
        }

        protected onMouseDown() {
            if (InputManager.IsLeftButtonDown) {
                this.isDragging = true;
                this.dragStart = InputManager.MousePos;
                this.vert1Rel = InputManager.MousePos.Sub(this.collider.Vertices[0]);
                this.vert2Rel = InputManager.MousePos.Sub(this.collider.Vertices[1]);
                this.vert3Rel = InputManager.MousePos.Sub(this.collider.Vertices[2]);
            }
        }
        protected onMouseUp() {
            if (!InputManager.IsLeftButtonDown) {
                this.isDragging = false;
            }
        }
        protected onMouseMove() {
            if (this.isDragging) {
                let rectTransform: RectTransform = this.RectTransform;
                
                rectTransform.Size = rectTransform.Size.Add(InputManager.MousePos.Sub(this.dragStart));
                this.dragStart = InputManager.MousePos;

                let v1: Util.Vector2 = InputManager.MousePos.Sub(this.vert1Rel);
                let v2: Util.Vector2 = InputManager.MousePos.Sub(this.vert2Rel);
                let v3: Util.Vector2 = InputManager.MousePos.Sub(this.vert3Rel);

                this.collider.Vertices = new Array<Util.Vector2>(v1, v2, v3);
            }
        }

        protected onParentSet(): void {
            if (this.window === null || this.window === undefined) {
                let window = this.CanvasObject.GetComponent(Window);
                if (window !== null) {
                    this.window = window;
                }
            }

            if (this.collider === null || this.collider === undefined) {
                let tri = this.CanvasObject.GetComponent(Physics.TriangleCollider);
                if (tri !== null) {
                    this.collider = tri;
                }
            }
        }

        protected handleObjectMessage(message: Messaging.Message): void {
            let messageParts: Array<string> = message.Message.split('.');
            if (messageParts[0] === 'collider') {
                if (message.Data[0] !== this.collider) return;
                if (messageParts[1] !== 'mouse') return;
                if (messageParts[2] === 'down') this.onMouseDown();
            }
        }

        protected handleInputMessage(message: Messaging.Message): void {
            let messageParts: Array<string> = message.Message.split('.');
            if (messageParts[0] === 'mouse') {
                if (messageParts[1] === 'move') this.onMouseMove();
                else if (messageParts[1] === 'up') this.onMouseUp();
            }
        }
    }
}