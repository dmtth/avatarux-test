import TWEEN from "@tweenjs/tween.js";
import { IPointData } from "pixi.js";
import gameSettings from "../../resources/gameSettings.json";
import { Symbol } from "../symbol/Symbol";
import { SymbolId } from "../symbol/SymbolId";
import { Reel } from "./Reel";

export class ExpandingReel extends Reel
{
    constructor(reelIdx: number, numRows: number)
    {
        super(reelIdx, numRows);
        this._currentRows = this.defaultRows;
    }

    private _currentRows: number;

    public get currentRows(): number
    {
        return this._currentRows;
    }

    public get maxRow(): number
    {
        return gameSettings.maxRow;
    }

    public get defaultRows(): number
    {
        return gameSettings.numRows;
    }

    public expandBy(addRows: number)
    {
        if (this._currentRows >= this.maxRow) return;

        this._currentRows += addRows;

        this.expandBackground(this.symbolHeight * this._currentRows);

        this._reelMask.height = this.symbolHeight * this._currentRows;

        const x = this.position.x;
        const y = -this.symbolHeight * (this._currentRows - this.defaultRows) / 2;
        this.moveTo({x, y});

    }

    public insertSymbol(symbolId: SymbolId, rowIdx: number)
    {
        const symbol = new Symbol(symbolId, this._reelIdx, rowIdx);
        this.addChild(symbol);

        this._symbols.splice(rowIdx, 0, symbol)
        this._symbols.forEach((symbol: Symbol, idx: number) =>
        {
            symbol.rowIdx = idx;
        });
    }

    public arrangeSymbols()
    {
        this._symbols.forEach((symbol: Symbol, idx: number) =>
        {
            const x = symbol.position.x;
            const y = symbol.rowIdx * this.symbolHeight;
            symbol.moveTo({x, y}, true);
        });
    }

    public moveTo(targetPos: IPointData)
    {
        const data = this.position;
        new TWEEN.Tween(data)
            .to(targetPos, 150)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() =>
            {
                this.position = data;
            }).start();
    }

    public reset()
    {
        this._symbols.filter((symbol: Symbol) => symbol.rowIdx >= this.defaultRows).forEach((symbol: Symbol) => symbol.removeFromParent());
        this._symbols = this._symbols.filter((symbol: Symbol) => symbol.rowIdx < this.defaultRows);
        this._symbols.forEach((symbol: Symbol, idx: number) =>
        {
            symbol.rowIdx = idx;
            symbol.position.y = symbol.rowIdx * symbol.height;
        });
        this._reelDropper.symbols = this._symbols;
        this._currentRows = this.defaultRows;
        this._background.height = this.symbolHeight * this._currentRows;
        this._reelMask.height = this.symbolHeight * this._currentRows;
        this.y = 0;
    }

    private expandBackground(height: number)
    {
        const data = {height: this._background.height};
        new TWEEN.Tween(data)
            .to({height}, 150)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() =>
            {
                this._background.height = data.height;
            }).start();
    }
}