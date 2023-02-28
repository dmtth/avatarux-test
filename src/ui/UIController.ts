import { EventDispatcher } from "../event/EventDispatcher";
import { SpinEvent } from "../event/SpinEvent";
import { UIView } from "./UIView";

export class UIController
{
    private _view: UIView;

    constructor(view: UIView)
    {
        this._view = view;
        this._view.spinButton.interactive = true;
        this._view.spinButton.on("click", () => this.onSpinButton());
        this._view.spinButton.on("touchend", () => this.onSpinButton());
    }

    public showSpin()
    {
        this._view.spinButton.visible = true;
    }

    public hideSpin()
    {
        this._view.spinButton.visible = false;
    }

    private onSpinButton()
    {
        EventDispatcher.getInstance().dispatch(new SpinEvent());
    }
}