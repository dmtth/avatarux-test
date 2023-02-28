import { EventDispatcher } from "../event/EventDispatcher";
import { SpinEvent } from "../event/SpinEvent";
import { PopManager } from "../pop/PopManager";
import { ReelManager } from "../reel/ReelManager";
import { ServerManager } from "../server/ServerManager";
import { UIManager } from "../ui/UIManager";
import { Task } from "../utils/Task";
import { WinManager } from "../win/WinManager";

export class LogicManager
{
    private _serverManager: ServerManager;
    private _reelManager: ReelManager;
    private _winManager: WinManager;
    private _uiManager: UIManager;
    private _popManager: PopManager;

    constructor(serverManager: ServerManager, reelManager: ReelManager, winManager: WinManager, uiManager: UIManager, popManager: PopManager)
    {
        this._serverManager = serverManager;
        this._reelManager = reelManager;
        this._winManager = winManager;
        this._uiManager = uiManager;
        this._popManager = popManager;

        EventDispatcher.getInstance().addEventListener(SpinEvent.SPIN, () => this.onSpin());
    }

    private roundHandler(task: Task)
    {
        switch (task.state)
        {
            case 0:
                const randomSymbols = this._serverManager.getRandomSymbols();
                this._reelManager.onServerSymbols(randomSymbols);
                this._reelManager.drop();
                this._uiManager.hideSpin();
                task.delayMs(1200);
                return;

            case 1:
                this._winManager.onServerSymbols(this._reelManager.reelSymbols);
                this._winManager.showWinPresentation();
                task.delayMs(1);
                return;

            case 2:
                if (!this._winManager.isWinnerRound())
                {
                    task.delayMs(1);
                    task.state = 1000;
                    return;
                }

                if (!this._winManager.getWinPresentationTask().isRunning)
                {
                    task.delayMs(1);
                }
                return;

            case 3:
                this._popManager.destroy();
                task.delayMs(500);
                return;

            case 4:
                this._popManager.expand();
                task.delayMs(700);
                return;

            case 5:
                this._popManager.pop();
                task.delayMs(500);
                task.state = 1;
                return;

            default:
                this._uiManager.showSpin();
                task.complete();
        }
    }

    private onSpin()
    {
        new Task().createHandler((task: Task) => this.roundHandler(task)).start();
    }
}