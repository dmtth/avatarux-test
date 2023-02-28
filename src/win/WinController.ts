import { EventDispatcher } from "../event/EventDispatcher";
import { SpinEvent } from "../event/SpinEvent";
import { Task } from "../utils/Task";
import { WinLabelView } from "././WinLabelView";
import { WinCounterView } from "./WinCounterView";
import { WinData } from "./WinData";
import { WinEvent, WinEventData } from "./WinEvent";

export class WinController
{
    private _data: WinData;
    private _labelView: WinLabelView;
    private _counterView: WinCounterView;
    private _presentationTask: Task;

    private _counter: number;

    constructor(data: WinData, labelView: WinLabelView, counterView: WinCounterView)
    {
        this._data = data;
        this._labelView = labelView;
        this._counterView = counterView;

        this._counter = 0;

        EventDispatcher.getInstance().addEventListener(SpinEvent.SPIN, () => this.onSpin());
    }

    public showWinPresentation()
    {
        this._presentationTask = new Task().createHandler((task: Task) => this.winPresentationHandler(task)).start();
    }

    public getWinPresentationTask(): Task
    {
        return this._presentationTask;
    }

    public showPostWinPresentation()
    {
        const eventData: WinEventData = {wins: this._data.wins};
        EventDispatcher.getInstance().dispatch(new WinEvent(WinEvent.SHOW_ALL, eventData));
    }

    private winPresentationHandler(task: Task): Task
    {
        if (task.state === this._data.wins.length)
        {
            this._labelView.hide();
            return task.complete();
        }

        const win = this._data.wins[task.state];
        this._labelView.show(win.value);

        const eventData: WinEventData = {wins: [win]};
        EventDispatcher.getInstance().dispatch(new WinEvent(WinEvent.SHOW, eventData));

        this._counter += win.value;
        this._counterView.show(this._counter);

        task.delayMs(1000);
    }

    private onSpin()
    {
        this._counterView.hide();
        this._counter = 0;
    }
}