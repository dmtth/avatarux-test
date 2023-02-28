import { EventDispatcher } from "../event/EventDispatcher";
import { SpinEvent } from "../event/SpinEvent";
import { SymbolId } from "../symbol/SymbolId";
import { ExpandingReel } from "./ExpandingReel";
import { ReelManager } from "./ReelManager";

export class ExpandingReelManager extends ReelManager
{
    constructor()
    {
        super();
        EventDispatcher.getInstance().addEventListener(SpinEvent.SPIN, () => this.onSpin());
    }

    protected _reels: ExpandingReel[];

    public get reels(): ExpandingReel[]
    {
        return this._reels;
    }

    public expandReelBy(reelIdx: number, addRows: number)
    {
        this._reels[reelIdx].expandBy(addRows);
    }

    public insertSymbol(symbolId: SymbolId, reelIdx: number, rowIdx: number)
    {
        this._reelSymbols[reelIdx].splice(rowIdx, 0, symbolId);
        this._reels[reelIdx].insertSymbol(symbolId, rowIdx);
    }

    public arrangeSymbols()
    {
        this._reels.forEach((reel: ExpandingReel) => reel.arrangeSymbols());
    }

    private onSpin()
    {
        this._reels.forEach((reel: ExpandingReel) => reel.reset());;
    }
}