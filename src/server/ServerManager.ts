import gameSettings from "../../resources/gameSettings.json";
import { SymbolId } from "../symbol/SymbolId";

export class ServerManager
{
    constructor()
    {
    }

    private get numReels(): number
    {
        return gameSettings.numReels;
    }

    private get numRows(): number
    {
        return gameSettings.numRows;
    }

    private get minWayLength(): number
    {
        return gameSettings.minWayLength;
    }

    public getRandomSymbols(): number[][]
    {
        // return [
        //     [0, 1, 2],
        //     [0, 1, 2],
        //     [0, 1, 2],
        //     [0, 1, 2],
        //     [0, 1, 2]
        // ];

        // return [
        //     [3, 1, 2],
        //     [4, 1, 1],
        //     [5, 1, 2],
        //     [0, 9, 2],
        //     [0, 1, 12]
        // ];


        const serverSymbols: number[][] = [];

        for (let reelIdx = 0; reelIdx < this.numReels; reelIdx++)
        {
            const randoms = []
            for (let rowIdx = 0; rowIdx < this.numRows; rowIdx++)
            {
                const random = Math.floor(Math.random() * (SymbolId.HP6 + 1));
                randoms.push(random);
            }

            serverSymbols.push(randoms);
        }

        const shouldWin = Math.floor(Math.random() * 100) <= 30;
        const winnerSymbol = Math.floor(Math.random() * SymbolId.HP6 + 1);
        const winLength = this.minWayLength + Math.floor(Math.random() * (this.numReels - this.minWayLength));

        if(shouldWin)
        {
            for (let reelIdx = 0; reelIdx < winLength; reelIdx++)
            {
                const positions = this.getPositions();
                positions.forEach((rowIdx: number) => {
                    serverSymbols[reelIdx][rowIdx] = winnerSymbol;
                });
            }
        }

        return serverSymbols;
    }

    private getPositions(): number[]
    {
        const positions = [];
        const symbolPerReel = this.getSymbolNumPerReel();
        let rowIndices = [...new Array(this.numRows).keys()];
        for(let i = 0; i < symbolPerReel; i++)
        {
            const idx = Math.floor(Math.random() * rowIndices.length);
            positions.push(rowIndices[idx]);
            rowIndices = rowIndices.filter((rowIdx: number) => rowIdx !== idx);
        }

        return positions;
    }

    private getSymbolNumPerReel(): number
    {
        const ran = Math.random() * 10;
        if(ran < 1) return 3;
        if(ran < 4) return 2;
        return 1;
    }
}