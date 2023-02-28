import { Container, Graphics } from "pixi.js";
import gameSettings from "../../resources/gameSettings.json";
import { EventDispatcher } from "../event/EventDispatcher";
import { SceneManager } from "../scene/SceneManager";
import { Symbol } from "../symbol/Symbol";
import { SymbolId } from "../symbol/SymbolId";
import { WinWaysData } from "../win/WinData";
import { WinEvent, WinEventData } from "../win/WinEvent";
import { ExpandingReel } from "./ExpandingReel";
import { Reel } from "./Reel";

export class ReelManager
{
    protected _reelsContainer: Container;

    constructor()
    {
        this._reelsContainer = new Container();
        SceneManager.getInstance().add(this._reelsContainer);

        this.createBackground();
        this.createReels();
        this.initSymbols();

        this._reelsContainer.pivot.x = this._reelsContainer.width / 2;
        this._reelsContainer.pivot.y = this._reelsContainer.height / 2;

        this._reelsContainer.position.x = 0;
        this._reelsContainer.position.y = 0;

        this._reelSymbols = [];

        EventDispatcher.getInstance().addEventListener(WinEvent.SHOW, (e: WinEventData) => this.onWinShowEvent(e));
        EventDispatcher.getInstance().addEventListener(WinEvent.SHOW_ALL, (e: WinEventData) => this.onWinShowAllEvent(e));
    }

    public get defaultNumReels(): number
    {
        return gameSettings.numReels;
    }

    public get defaultNumRows(): number
    {
        return gameSettings.numRows;
    }

    protected _reels: Reel[];

    public get reels(): Reel[]
    {
        return this._reels;
    }

    protected _reelSymbols: SymbolId[][];

    public get reelSymbols(): SymbolId[][]
    {
        return this._reelSymbols;
    }

    public getNumRows(reelIdx: number): number
    {
        return this._reels[reelIdx].symbols.length;
    }

    public getNumReels(): number
    {
        return this._reels.length;
    }

    public getReel(reelIdx: number)
    {
        return this._reels[reelIdx];
    }

    public setSymbol(symbolId: SymbolId, reelIdx: number, rowIdx: number)
    {
        this._reelSymbols[reelIdx][rowIdx] = symbolId;
        this._reels[reelIdx].symbols[rowIdx].setSymbol(symbolId);
    }

    public getSymbol(reelIdx: number, rowIdx: number): Symbol
    {
        return this._reels[reelIdx].symbols[rowIdx];
    }

    public onServerSymbols(serverSymbols: SymbolId[][])
    {
        this._reelSymbols = serverSymbols;

        for (let reelIdx = 0; reelIdx < this.defaultNumReels; reelIdx++)
        {
            serverSymbols[reelIdx].forEach((symbolId: SymbolId, rowIdx: number) =>
            {
                this._reels[reelIdx].symbols[rowIdx].setSymbol(symbolId);
            });
        }
    }

    public drop()
    {
        this._reels.forEach((reel: Reel) =>
        {
            reel.drop();
        });
    }

    protected createReels()
    {
        this._reels = [];

        for (let reelIdx = 0; reelIdx < this.defaultNumReels; reelIdx++)
        {
            const reel = new ExpandingReel(reelIdx, this.defaultNumRows);
            reel.x = reel.width * reelIdx;
            this._reelsContainer.addChild(reel);

            this._reels.push(reel);
        }
    }

    protected createBackground()
    {
        const graphics = new Graphics();
        graphics.beginFill(0x060012);
        graphics.drawRect(0, 0, this.defaultNumReels * gameSettings.symbolWidth, this.defaultNumRows * gameSettings.symbolHeight);
        graphics.endFill();
        this._reelsContainer.addChild(graphics);
    }

    protected onWinShowEvent(e: WinEventData)
    {
        for (let reelIdx = 0; reelIdx < this.getNumReels(); reelIdx++)
        {
            for (let rowIdx = 0; rowIdx < this.getNumRows(reelIdx); rowIdx++)
            {
                e.wins.forEach((win: WinWaysData) =>
                {
                    if (win.positions[reelIdx]?.includes(rowIdx))
                    {
                        this.getSymbol(reelIdx, rowIdx).win();
                    }
                    else
                    {
                        this.getSymbol(reelIdx, rowIdx).stop();
                    }
                });
            }
        }
    }

    protected onWinShowAllEvent(e: WinEventData)
    {
        for (let reelIdx = 0; reelIdx < this.getNumReels(); reelIdx++)
        {
            for (let rowIdx = 0; rowIdx < this.getNumRows(reelIdx); rowIdx++)
            {
                e.wins.forEach((win: WinWaysData) =>
                {
                    if (win.positions[reelIdx]?.includes(rowIdx))
                    {
                        this.getSymbol(reelIdx, rowIdx).win();
                    }
                });
            }
        }
    }

    protected initSymbols()
    {
        this._reelSymbols = this.getRandomSymbols();
        this._reelSymbols.forEach((symbolIds: SymbolId[], reelIdx: number) =>
        {
            symbolIds.forEach((symbolId: SymbolId, rowIdx: number) =>
            {
                this.setSymbol(symbolId, reelIdx, rowIdx);
            });
        });
    }

    protected getRandomSymbols(): number[][]
    {
        const serverSymbols = [];

        for (let reelIdx = 0; reelIdx < this.defaultNumReels; reelIdx++)
        {
            const randoms = []
            for (let rowIdx = 0; rowIdx < this.defaultNumRows; rowIdx++)
            {
                const random = Math.floor(Math.random() * (SymbolId.HP6 + 1));
                randoms.push(random);
            }

            serverSymbols.push(randoms);
        }

        return serverSymbols;
    }
}