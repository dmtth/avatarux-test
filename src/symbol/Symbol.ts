import TWEEN from "@tweenjs/tween.js";
import { Container, Graphics, IPointData, Sprite } from "pixi.js";
import { AssetManager } from "../asset/AssetManager";
import { SymbolId } from "./SymbolId";

export class Symbol extends Container
{
    private _symbolId: SymbolId;
    private _sprite: Sprite;
    private _spriteWin: Sprite;

    constructor(symbolId: SymbolId, reelIdx: number, rowIdx: number, width?: number, height?: number)
    {
        super();

        this._symbolId = symbolId;
        this._reelIdx = reelIdx;
        this._rowIdx = rowIdx;

        const graphics = this.createGraphics(width, height);
        this.addChild(graphics);

        this._sprite = new Sprite();
        this._spriteWin = new Sprite();

        this.addChild(this._sprite);
        this.addChild(this._spriteWin);

        this.setSymbol(symbolId);
    }

    private _reelIdx: number;

    get reelIdx(): number
    {
        return this._reelIdx;
    }

    private _rowIdx: number;

    get rowIdx(): number
    {
        return this._rowIdx;
    }

    set rowIdx(value: number)
    {
        this._rowIdx = value;
    }

    public setSymbol(symbolId: SymbolId)
    {
        this._symbolId = symbolId;

        if (this._symbolId !== SymbolId.EMPTY)
        {
            this._sprite.texture = AssetManager.getInstance().get(this._symbolId.toString());
            this._spriteWin.texture = AssetManager.getInstance().get(`${this._symbolId.toString()}_win`);
        }
        else
        {
            this._sprite.texture = null;
            this._spriteWin.texture = null;
        }

        this.reset();
        this.stop();
    }

    public stop()
    {
        this._spriteWin.alpha = 0;
        this._spriteWin.visible = false;
    }

    public win()
    {
        this._spriteWin.visible = true;

        const data = {alpha: 0};
        new TWEEN.Tween(data)
            .to({alpha: 1}, 150)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() =>
            {
                this._spriteWin.alpha = data.alpha;
            }).start();
    }

    public pop()
    {
        const data = {alpha: 1};
        new TWEEN.Tween(data)
            .to({alpha: 0}, 80)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() =>
            {
                this.alpha = data.alpha;
            })
            .onComplete(() =>
            {
                this.setSymbol(SymbolId.EMPTY);
            }).start();
    }

    public moveTo(targetPos: IPointData, animate: boolean = false)
    {
        if (!animate)
        {
            this.position = targetPos;
            return;
        }

        const data = this.position;
        new TWEEN.Tween(data)
            .to(targetPos, 150)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() =>
            {
                this.position = data;
            }).start();
    }

    private createGraphics(width: number, height: number): Graphics
    {
        const graphics = new Graphics();
        graphics.beginFill(Math.random() * 256 * 256 * 256);
        graphics.drawRect(0, 0, width, height);
        graphics.alpha = 0;
        graphics.endFill();

        return graphics;
    }

    private reset()
    {
        this.alpha = 1;
    }
}