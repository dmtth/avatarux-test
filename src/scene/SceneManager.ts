import TWEEN from "@tweenjs/tween.js";
import { Application, Container, DisplayObject, IRenderer } from "pixi.js";
import gameSettings from "../../resources/gameSettings.json";

export class SceneManager
{
    private static _instance: SceneManager;
    private _app: Application;

    constructor()
    {
        if (SceneManager._instance) return;

        SceneManager._instance = this;
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this._app = new Application({
            view: canvas,
            resizeTo: window,
            antialias: true,
            autoDensity: true,
            background: 0x110022
        });

        this._scene = new Container();
        this._scene.pivot.x = this._scene.width / 2;
        this._scene.pivot.y = this._scene.height / 2;
        this._scene.position.x = this._app.renderer.width / 2;
        this._scene.position.y = this._app.renderer.height / 2;

        this._app.stage.addChild(this._scene);

        this._app.ticker.add((dt) => this.onUpdate(dt));
    }

    public get width(): number
    {
        return gameSettings.width;
    }

    public get height(): number
    {
        return gameSettings.height;
    }

    private _scene: Container;

    public get scene(): Container
    {
        return this._scene;
    }

    public get renderer(): IRenderer
    {
        return this._app.renderer
    }

    public static getInstance(): SceneManager
    {
        if (!SceneManager._instance)
        {
            SceneManager._instance = new SceneManager();
        }

        return SceneManager._instance;
    }

    public add(displayObject: DisplayObject)
    {
        this._scene.addChild(displayObject);
    }

    private onUpdate(dt: number)
    {
        TWEEN.update(this._app.ticker.lastTime);

        const scaleX = Math.min(this._app.renderer.width / this.width, 1);
        const scaleY = Math.min(this._app.renderer.height / this.height, 1);
        const scale = scaleX < scaleY ? scaleX : scaleY;
        this._scene.scale = {x: scale, y: scale};

        this._scene.position.x = this._app.renderer.width / 2;
        this._scene.position.y = this._app.renderer.height / 2;
    }
}