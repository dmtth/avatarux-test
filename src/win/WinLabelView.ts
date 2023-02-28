import TWEEN from "@tweenjs/tween.js";
import { Container, Text } from "pixi.js";
import { SceneManager } from "../scene/SceneManager";

export class WinLabelView extends Container
{
    private _label: Text;

    constructor()
    {
        super();
        SceneManager.getInstance().add(this);

        this._label = new Text('WIN', {
            fontFamily: 'Arial',
            fontSize: 96,
            fontWeight: 'bold',
            fill: 'gold',
            stroke: 'yellow',
            strokeThickness: 10,
            align: "center",
            lineHeight: 96
        });

        this.addChild(this._label);
        this.hide();
    }

    public show(value: number)
    {
        this.scale = {x: 0.3, y: 0.3};
        this._label.text = `WIN ${value}`;
        this._label.position.x = -this._label.width / 2;
        this._label.position.y = -this._label.height / 2;
        this._label.visible = true;

        const data = {s: 0.3, a: 0};
        new TWEEN.Tween(data)
            .to({s: 1, a: 1}, 150)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() =>
            {
                this.scale = {x: data.s, y: data.s};
                this.alpha = data.a;
            }).start();
    }

    public hide()
    {
        const data = {s: 1, a: 1};
        new TWEEN.Tween(data)
            .to({s: 0.5, a: 0}, 100)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() =>
            {
                this.scale = {x: data.s, y: data.s};
                this.alpha = data.a;
            }).start();
        this._label.visible = false;
    }
}