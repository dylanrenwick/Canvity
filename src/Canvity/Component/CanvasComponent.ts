namespace Canvity.Component {
    export abstract class CanvasComponent extends CanvityObject {
        private requires: Array<{ new (...args: any[]): CanvasComponent; }> = new Array<{ new (...args: any[]): CanvasComponent; }>();
        public get Requires(): Array<{ new (...args: any[]): CanvasComponent; }> { return this.requires; }

        private unique: boolean = false;
        public get Unique(): boolean { return this.unique; }

        protected canvasObject: CanvasObject;
        public get CanvasObject(): CanvasObject { return this.canvasObject; }
        public set CanvasObject(obj: CanvasObject) {
            if (!this.canvasObject) {
                this.canvasObject = obj;
                this.onParentSet();
            }
        }

        public get Transform(): Transform | null {
            if (this.canvasObject) {
                return this.canvasObject.Transform;
            } else {
                return null;
            }
        }
        
        public Draw(time: Util.Time, ctx: CanvasRenderingContext2D): void { }
        public Update(time: Util.Time): void {
            Messaging.MessageBus.GetMessages(this.InstanceID).forEach(message => { this.handleMessage(message); }, this);
            Messaging.MessageBus.GetMessages(this.CanvasObject.InstanceID).forEach(message => { this.handleMessage(message); }, this);
        }

        public GetRequiredComponents(obj: CanvasObject): Array<CanvasComponent> {
            let required = new Array<CanvasComponent>();
            this.requires.forEach(component => required.push(new component()))
            return required;
        }

        protected onParentSet(): void { }
        protected handleMessage(message: Messaging.Message): void {
            console.warn("Object", this.InstanceID, "was sent a message, but has not implemented handleMessage!\n", message);
        }
        protected handleObjectMessage(message: Messaging.Message): void { }
    }
}
