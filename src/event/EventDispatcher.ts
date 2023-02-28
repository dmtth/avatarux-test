import * as EventEmitter from "eventemitter3";
import { Event } from "./Event";

export class EventDispatcher
{
    private static _instance: EventDispatcher;
    private _emitter: EventEmitter

    private constructor()
    {
        this._emitter = new EventEmitter();
    }

    public static getInstance(): EventDispatcher
    {
        if (!EventDispatcher._instance)
        {
            EventDispatcher._instance = new EventDispatcher();
        }

        return EventDispatcher._instance;
    }

    public dispatch(event: Event)
    {
        this._emitter.emit(event.type, event.data);
    }

    public addEventListener(event: string, fn: (...args: any[]) => void)
    {
        this._emitter.addListener(event, fn);
    }
}