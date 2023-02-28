import gameSettings from "../../resources/gameSettings.json";
import { ExpandingReel } from "../reel/ExpandingReel";
import { ExpandingReelManager } from "../reel/ExpandingReelManager";
import { SymbolId } from "../symbol/SymbolId";
import { WinWaysData } from "../win/WinData";
import { WinManager } from "../win/WinManager";

export class PopManager
{
    private _reelManager: ExpandingReelManager;
    private _winManager: WinManager;

    constructor(reelManager: ExpandingReelManager, winManager: WinManager)
    {
        this._reelManager = reelManager;
        this._winManager = winManager;
    }

    public get maxRow(): number
    {
        return gameSettings.maxRow;
    }

    public destroy()
    {
        this._winManager.wins.forEach((win: WinWaysData) =>
        {
            win.positions.forEach((rowIndices: number[], reelIdx: number) =>
            {
                rowIndices.forEach((rowIdx: number) =>
                {
                    this._reelManager.getSymbol(reelIdx, rowIdx).pop();
                    this._reelManager.setSymbol(SymbolId.EMPTY, reelIdx, rowIdx);
                });
            });
        });
    }

    public expand()
    {
        this._winManager.wins.forEach((win: WinWaysData) =>
        {
            win.positions.forEach((rowIndices: number[], reelIdx: number) =>
            {
                const addRows = this.getAdditionalRows(reelIdx, rowIndices.length);
                this._reelManager.expandReelBy(reelIdx, addRows);
                this.insertEmptySymbols(reelIdx, rowIndices);
            });
        });

        this._reelManager.arrangeSymbols();
    }

    public pop()
    {
        this._reelManager.reelSymbols.forEach((symbolIds: SymbolId[], reelIdx: number) =>
        {
            symbolIds.forEach((symbolId: SymbolId, rowIdx: number) =>
            {
                if (symbolId === SymbolId.EMPTY)
                {
                    const newSymbolId = this.getRandomSymbolId();
                    this._reelManager.setSymbol(newSymbolId, reelIdx, rowIdx);
                }
            });
        });
    }

    private insertEmptySymbols(reelIdx: number, rowIndices: number[])
    {
        rowIndices.forEach((rowIdx: number) =>
        {
            if (this._reelManager.reelSymbols[reelIdx].length >= this._reelManager.reels[reelIdx].maxRow) return;
            this._reelManager.insertSymbol(SymbolId.EMPTY, reelIdx, rowIdx);
        });
    }

    private getAdditionalRows(reelIdx: number, positions: number): number
    {
        const currentRows = (this._reelManager.getReel(reelIdx) as ExpandingReel).currentRows;
        const diff = this.maxRow - currentRows;
        return Math.min(diff, positions);
    }

    private getRandomSymbolId(): SymbolId
    {
        return Math.floor(Math.random() * SymbolId.HP6);
    }
}