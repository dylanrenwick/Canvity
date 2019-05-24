import { Aspect } from "./Aspect";
import { Component } from "./Component/Component";
import { ComponentManager } from "./Component/ComponentManager";
import { IComponentManager } from "./Component/IComponentManager";
import { IRenderingContext } from "./Render/IRenderingContext";
import { System } from "./System/System";
import { Color } from "./Util/Color";
import { HashSet } from "./Util/HashSet";
import { Time } from "./Util/Time";

export class Scene {
    private started: boolean;

    private systems: HashSet<System>;
    private componentManagers: HashSet<IComponentManager>;
    private background: Color;

    public get Background(): Color { return this.background; }
    public set Background(val: Color) { this.background = val; }

    public constructor() {
        this.componentManagers = new HashSet<IComponentManager>();
        this.Background = Color.Transparent;
        this.started = false;
    }

    public GetComponentManager<T extends Component>(c: new(id: number) => T): ComponentManager<T> | null {
        let TManagers = this.componentManagers.filter(x => x.Type === c).ToArray();
        if (TManagers.length === 0) return null;
        return TManagers[0] as ComponentManager<T>;
    }

    public Draw(time: Time, ctx: IRenderingContext): void {
        if (!this.started) return;
        this.systems.forEach(element => {
            element.Draw(time, ctx, this.GetAspects(...element.AspectType));
        });
    }

    public Update(time: Time): void {
        if (!this.started) return;
        this.systems.forEach(element => {
            element.Update(time, this.GetAspects(...element.AspectType));
        });
    }

    public GetAspects(... components: Array<new(id: number) => Component>): Array<Aspect> {
        let managers = new Array<IComponentManager>();
        components.forEach(comp => {
            let man = this.GetComponentManager(comp);
            if (man === null) {
                // TODO: do something
                return;
            }
            managers.push(man);
        });

        return this.GetAspectsByManagers(...managers);
    }

    public GetAspectsByManagers(... components: Array<IComponentManager>): Array<Aspect> {
        if (components.length === 0) throw new Error("No Component Managers passed!");
        let aspects = new Array<Aspect>();
        let control = components.sort((a, b) => a.Count - b.Count)[0];
        components = components.filter(x => x !== control);
        control.forEach(component => {
            let comps = new Aspect();
            let id = component.EntityID;
            let found = true;
            for (let c of components) {
                let comp = c.getComponent(id);
                if (comp === null) {
                    found = false;
                    break;
                }
                comps.Add(comp);
            }
            if (found) {
                aspects.push(comps);
            }
        });

        return aspects;
    }
}
