import { App } from "../App";
import { Asset } from "./Asset";

export abstract class Shader extends Asset {
    protected shaderSource: string;
    protected shader: WebGLShader;
    public get Shader(): WebGLShader { return Shader; }

    public parseAsset(httpReq: XMLHttpRequest): void {
        let source = httpReq.response;
        let ctx = App.renderContextWebGL;
        if (ctx == null) throw new Error("Attempted to create a shader but app is not using WebGL!");
        this.shader = this.createShader(ctx.context as WebGLRenderingContext);
        this.shaderSource = source;
    }

    public abstract createShader(gl: WebGLRenderingContext): WebGLShader;
}
