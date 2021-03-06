import { SpriteAsset } from "../Asset/SpriteAsset";
import { Color } from "../Util/Color";
import { Rect } from "../Util/Rect";
import { Time } from "../Util/Time";
import { Vector2 } from "../Util/Vector2";

export interface IRenderingContext {
    contextWidth: number;
    contextHeight: number;

    context: any;

    draw(time: Time): void;

    drawRect(rect: Rect, color: Color): void;
    drawRectFromCoords(x: number, y: number, w: number, h: number, color: Color): void;

    drawPoly(vertices: Array<Vector2>, color: Color): void;

    strokeRect(rect: Rect, color: Color, lineWidth: number): void;
    strokeRectFromCoords(x: number, y: number, w: number, h: number, color: Color, lineWidth: number): void;

    drawSprite(sprite: SpriteAsset, x: number, y: number): void;
    drawTintedSprite(sprite: SpriteAsset, x: number, y: number, color: Color): void;

    drawText(text: string, x: number, y: number, color: Color): void;
    drawTextWithFont(text: string, x: number, y: number, font: string, color: Color): void;

    drawLine(start: Vector2, end: Vector2, color: Color, lineWidth: number): void;
    drawLineFromCoords(startX: number, startY: number, endX: number, endY: number, color: Color, lineWidth: number): void;
}
