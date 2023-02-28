import TWEEN, { Tween } from "@tweenjs/tween.js";
import gameSettings from "../../resources/gameSettings.json";
import { Symbol } from "../symbol/Symbol";

export class ReelDropper
{
    constructor(symbols: Symbol[])
    {
        this._symbols = symbols;
    }

    private _symbols: Symbol[];

    set symbols(value: Symbol[])
    {
        this._symbols = value;
    }

    // @ts-ignore
    private get symbolDropDelay(): number
    {
        return gameSettings.symbolDropDelay;
    }

    private get symbolDropDuration(): number
    {
        return gameSettings.symbolDropDuration;
    }

    public drop(delay: number)
    {
        this._symbols.forEach((symbol: Symbol, idx: number) =>
        {
            this.createTween(symbol, this._symbols.length).delay(delay + (this._symbols.length - idx) * this.symbolDropDelay).start();
        });
    }

    private createTween(symbol: Symbol, symbolsLength: number): Tween<any>
    {
        const from = symbol.rowIdx * symbol.height - symbol.height * symbolsLength;
        const to = symbol.height * symbol.rowIdx;

        symbol.position.y = from;

        const data = {y: from};
        const tween = new TWEEN.Tween(data)
            .to({y: to}, this.symbolDropDuration)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() =>
            {
                symbol.position.y = data.y;
            });

        return tween;
    }
}