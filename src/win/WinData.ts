import gameSettings from "../../resources/gameSettings.json";
import paytable from "../../resources/paytable.json";
import { SymbolId } from "../symbol/SymbolId";

export interface WinWaysData
{
    symbolId: SymbolId;
    positions: number[][];
    value: number;
    ways: number;
}

export class WinData
{
    private _serverSymbol: SymbolId[][];

    constructor()
    {
        this._serverSymbol = [];
        this._wins = [];
    }

    private _wins: WinWaysData[];

    get wins(): WinWaysData[]
    {
        return this._wins;
    }

    public get minWayLength(): number
    {
        return gameSettings.minWayLength;
    }

    public onServerSymbols(serverSymbols: SymbolId[][])
    {
        this._serverSymbol = serverSymbols;
        this._wins = this.getWins();
    }

    private getWins(): WinWaysData[]
    {
        const wins = [];
        const symbolWinsLength: { [key: string]: number } = {};

        for (let rowIdx = 0; rowIdx < this._serverSymbol[0].length; rowIdx++)
        {
            const symbolToCheck = this._serverSymbol[0][rowIdx];
            symbolWinsLength[symbolToCheck] = this.getWayLength(symbolToCheck);
        }

        for (const key in symbolWinsLength)
        {
            const length = symbolWinsLength[key];
            if (length >= this.minWayLength)
            {
                const symbolId = parseInt(key) as SymbolId;
                const positions = this.getAllSymbolPositions(symbolId, symbolWinsLength[key]);
                const ways = this.getNumWays(positions);
                const value = this.getWinValue(symbolId, ways, length);

                const winShowData: WinWaysData = {symbolId, positions, ways, value};

                if (value > 0) wins.push(winShowData);
            }
        }

        return wins;
    }

    private getWinValue(symbolIdx: SymbolId, numWays: number, length: number)
    {
        const lengthIdx = Math.min(length - this.minWayLength, paytable[symbolIdx].length - 1);
        return paytable[symbolIdx][lengthIdx] * numWays;
    }

    private getNumWays(positions: number[][]): number
    {
        let ways = 1;
        for (let reelIdx = 0; reelIdx < positions.length; reelIdx++)
        {
            ways *= positions[reelIdx].length;
        }

        return ways;
    }

    private getWayLength(symbolId: SymbolId): number
    {
        let length = 1;
        for (let reelIdx = 1; reelIdx < this._serverSymbol.length; reelIdx++)
        {
            if (!this.checkSymbolOnReel(symbolId, reelIdx))
            {
                return length;
            }
            length++;
        }

        return length;
    }

    private getAllSymbolPositions(symbolId: SymbolId, length: number): number[][]
    {
        const positions: number[][] = [];
        for (let reelIdx = 0; reelIdx < length; reelIdx++)
        {
            positions[reelIdx] = this.getSymbolPositionsOnReel(symbolId, reelIdx);
        }

        return positions;
    }

    private getSymbolPositionsOnReel(symbolId: SymbolId, reelIdx: number): number[]
    {
        const positions = [];

        for (let rowIdx = 0; rowIdx < this._serverSymbol[reelIdx].length; rowIdx++)
        {
            if (this._serverSymbol[reelIdx][rowIdx] === symbolId)
            {
                positions.push(rowIdx);
            }
        }

        return positions;
    }

    private checkSymbolOnReel(symbolId: SymbolId, reelIdx: number): boolean
    {
        for (let rowIdx = 0; rowIdx < this._serverSymbol[reelIdx].length; rowIdx++)
        {
            if (this._serverSymbol[reelIdx][rowIdx] === symbolId)
            {
                return true;
            }
        }

        return false;
    }
}