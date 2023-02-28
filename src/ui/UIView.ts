import { Container, Graphics, Text } from "pixi.js";
import { SceneManager } from "../scene/SceneManager";

export class UIView
{
    constructor()
    {
        this._spinButton = this.createSpinButton();

        const sceneManager = SceneManager.getInstance();
        const [x, y] = [sceneManager.width / 2 - 100, 0];
        this._spinButton.position.set(x, y);

        SceneManager.getInstance().add(this._spinButton);
    }

    private _spinButton: Container;

    get spinButton(): Container
    {
        return this._spinButton;
    }

    private createSpinButton(): Container
    {
        const spin = new Container();

        const bg = new Graphics();
        bg.beginFill(0x553388);
        bg.drawCircle(0, 0, 82);
        bg.endFill();

        const text = new Text('SPIN', {
            fontFamily: 'Arial',
            fontSize: 32,
            fontWeight: 'bold',
            fill: 'white',
            align: "center",
            lineHeight: 32
        });
        text.position.set(-text.width / 2, -text.style.lineHeight / 2);

        spin.addChild(bg);
        spin.addChild(text);

        return spin;
    }
}