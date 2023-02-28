import { AssetManager } from "./asset/AssetManager";
import { LogicManager } from "./logic/LogicManager";
import { PopManager } from "./pop/PopManager";
import { ExpandingReelManager } from "./reel/ExpandingReelManager";
import { SceneManager } from "./scene/SceneManager";
import { ServerManager } from "./server/ServerManager";
import { UIManager } from "./ui/UIManager";
import { WinManager } from "./win/WinManager";

export class Game
{
    constructor()
    {
        new SceneManager();
    }

    public async init()
    {
        await AssetManager.getInstance().load();
        const serverManager = new ServerManager();
        const reelManager = new ExpandingReelManager();
        const winManager = new WinManager(reelManager);
        const popManager = new PopManager(reelManager, winManager);
        const uiManager = new UIManager();
        new LogicManager(serverManager, reelManager, winManager, uiManager, popManager);
    }
}