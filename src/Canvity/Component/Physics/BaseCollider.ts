namespace Canvity.Component.Physics {
    export abstract class BaseCollider extends CanvasComponent {
        private isTrigger: boolean;
        public get IsTrigger(): boolean { return this.isTrigger; }
        public set IsTrigger(val: boolean) { this.isTrigger = val; }

        protected constructor() {
            super();
        }

        public Update(deltaTime: Util.Time): void {
            super.Update(deltaTime);
            Messaging.MessageBus.GetGlobalMessages('input').forEach(message => { this.handleInputMessage(message); }, this);
        }

        public abstract CheckIsCollision(point: Util.Vector2): boolean;

        protected handleInputMessage(message: Messaging.Message): void {
            if (message.Message.split('.')[0] === 'mouse') {
                if (this.CheckIsCollision(InputManager.MousePos)) {
                    switch(message.Message.split('.')[1]) {
                        case 'move':
                            Messaging.MessageBus.PushMessage(new Messaging.Message(App.CurrentUpdateTime, 'collider.mouse.move', this.CanvasObject.InstanceID, this));
                            break;
                        case 'down':
                            Messaging.MessageBus.PushMessage(new Messaging.Message(App.CurrentUpdateTime, 'collider.mouse.down', this.CanvasObject.InstanceID, this, message.Data[0]));
                            break;
                        case 'up':
                            Messaging.MessageBus.PushMessage(new Messaging.Message(App.CurrentUpdateTime, 'collider.mouse.up', this.CanvasObject.InstanceID, this, message.Data[0]));
                            break;
                    }
                }
            }
        }
    }
}