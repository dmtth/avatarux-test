import { ReelManager } from "../reel/ReelManager";
import { SymbolId } from "../symbol/SymbolId";
import { Task } from "../utils/Task";
import { WinLabelView } from "././WinLabelView";
import { WinController } from "./WinController";
import { WinCounterView } from "./WinCounterView";
import { WinData, WinWaysData } from "./WinData";

export class WinManager
{
    private _data: WinData;
    private _controller: WinController;
    private _reelManager: ReelManager;

    constructor(reelManager: ReelManager)
    {
        this._reelManager = reelManager;
        this._data = new WinData();
        const labelView = new WinLabelView();
        const counterView = new WinCounterView();
        this._controller = new WinController(this._data, labelView, counterView);
    }

    public get wins(): WinWaysData[]
    {
        return this._data.wins;
    }

    public isWinnerRound(): boolean
    {
        return this._data.wins.length > 0;
    }

    public showWinPresentation()
    {
        this._controller.showWinPresentation();
    }

    public showPostWinPresentation()
    {
        this._controller.showPostWinPresentation();
    }

    public getWinPresentationTask(): Task
    {
        return this._controller.getWinPresentationTask();
    }

    public onServerSymbols(serverSymbols: SymbolId[][])
    {
        this._data.onServerSymbols(serverSymbols);
    }
}