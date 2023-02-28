import { UIController } from "./UIController";
import { UIView } from "./UIView";

export class UIManager
{
    private _controller: UIController;

    constructor()
    {
        const view = new UIView();
        this._controller = new UIController(view);
    }

    public showSpin()
    {
        this._controller.showSpin();
    }

    public hideSpin()
    {
        this._controller.hideSpin();
    }
}