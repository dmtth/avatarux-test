import { Container, Text } from "pixi.js";
import { SceneManager } from "../scene/SceneManager";

export class WinCounterView extends Container
{
    private _counter: Text;

    constructor()
    {
        super();
        SceneManager.getInstance().add(this);

        this._counter = new Text('WIN', {
            fontFamily: 'Arial',
            fontSize: 72,
            fontWeight: 'bold',
            fill: 'gold',
            stroke: 'white',
            strokeThickness: 10,
            align: "center",
            lineHeight: 96
        });

        this.addChild(this._counter);
        this.hide();
    }

    public show(value: number)
    {
        this._counter.text = `${value}\nWIN`;
        this._counter.position.x = -SceneManager.getInstance().width / 2;
        this._counter.position.y = -this._counter.height / 2;
        this._counter.visible = true;
    }

    public hide()
    {
        this._counter.visible = false;
    }
}