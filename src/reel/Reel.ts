import { Container, Graphics } from "pixi.js";
import gameSettings from "../../resources/gameSettings.json";
import { Symbol } from "../symbol/Symbol";
import { SymbolId } from "../symbol/SymbolId";
import { ReelDropper } from "./ReelDropper";

export class Reel extends Container
{
    protected _reelIdx: number;
    protected _background: Graphics;
    protected _reelMask: Graphics;
    protected _reelDropper: ReelDropper;

    constructor(reelIdx: number, numRows: number)
    {
        super();

        this._reelIdx = reelIdx;
        this._background = this.createBackground(numRows);
        this._symbols = this.createSymbols(numRows);
        this._reelMask = this.createMask(numRows);
        this.mask = this._reelMask;

        this._reelDropper = new ReelDropper(this._symbols);
    }

    public get symbolWidth(): number
    {
        return gameSettings.symbolWidth;
    }

    public get symbolHeight(): number
    {
        return gameSettings.symbolHeight;
    }

    protected _symbols: Symbol[];

    public get symbols(): Symbol[]
    {
        return this._symbols;
    }

    protected get dropDelay(): number
    {
        return gameSettings.reelDropDelay;
    }

    public drop()
    {
        this._reelDropper.drop(this._reelIdx * this.dropDelay);
    }

    protected createSymbols(numRows: number): Symbol[]
    {
        const symbols = [];
        for (let rowIdx = 0; rowIdx < numRows; rowIdx++)
        {
            const symbol = new Symbol(SymbolId.EMPTY, this._reelIdx, rowIdx, this.symbolWidth, this.symbolHeight);

            const y = this.symbolHeight * rowIdx;

            symbol.position.set(0, y);
            symbols.push(symbol);

            this.addChild(symbol);
        }

        return symbols;
    }

    protected createBackground(numRows: number): Graphics
    {
        const bg = new Graphics();
        bg.beginFill(0x050010);
        bg.drawRect(0, 0, this.symbolWidth, this.symbolHeight * numRows);
        bg.endFill();
        this.addChild(bg);

        return bg;
    }

    protected createMask(numRows: number): Graphics
    {
        const mask = new Graphics();
        mask.beginFill(0xff00ff);
        mask.drawRect(0, 0, this.symbolWidth, this.symbolHeight * numRows);
        mask.endFill();
        this.addChild(mask);

        return mask;
    }
}