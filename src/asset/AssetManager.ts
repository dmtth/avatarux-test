import { Assets } from "pixi.js";
import bundles from "../../resources/bundles.json";

export class AssetManager
{
    private static _instance: AssetManager;

    private constructor()
    {
    }

    public static getInstance(): AssetManager
    {
        if (!AssetManager._instance)
        {
            AssetManager._instance = new AssetManager();
        }

        return AssetManager._instance;
    }

    public async load()
    {
        await Assets.init({basePath: "resources/symbols", manifest: bundles});
        await Assets.loadBundle(['symbols'], (progress) => this.onProgress(progress));
    }

    public get(name: string): any
    {
        return Assets.get(name);
    }

    private onProgress(progress: number)
    {
        if (progress >= 1)
        {
            document.getElementById("loading").remove();
        }
    }
}