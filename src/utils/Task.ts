import { Ticker } from "@pixi/ticker";

export class Task
{
    private _handler: (task: Task, ...args: any[]) => void;
    private _ticker: Ticker;
    private _delay: number;
    private _elapsedTime: number;

    constructor()
    {
        this._ticker = new Ticker();
        this._ticker.add(() => this.update());
        this.reset();

        window.onblur = () =>
        {
            this._ticker?.stop();
        }

        window.onfocus = () =>
        {
            this._ticker?.start();
        }
    }

    private _state: number;

    get state(): number
    {
        return this._state;
    }

    set state(value: number)
    {
        this._state = value;
    }

    private _isRunning: boolean;

    get isRunning(): boolean
    {
        return this._isRunning;
    }

    public createHandler(handler: (task: Task, ...args: any[]) => void): Task
    {
        this._handler = handler;
        return this;
    }

    public start(): Task
    {
        if (!this._ticker)
        {
            this._ticker = new Ticker();
            this._ticker.add(() => this.update());
        }

        this._isRunning = true;
        this._ticker.start();

        return this;
    }

    public complete(): Task
    {
        this.destroy();
        this.reset();
        return this;
    }

    public destroy()
    {
        this._ticker.destroy();
        this._ticker = null;
    }

    public reset()
    {
        this._state = 0;
        this._elapsedTime = 0;
        this._delay = 0;
        this._isRunning = false;
    }

    public delayMs(ms: number)
    {
        this._elapsedTime = 0;
        this._delay = ms;
        this._state++;
    }

    private update()
    {
        this._elapsedTime += this._ticker.elapsedMS * this._ticker.speed;
        if (this._elapsedTime >= this._delay)
        {
            this._handler(this);
        }
    }
}