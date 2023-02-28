import { Event } from "../event/Event";
import { WinWaysData } from "./WinData";

export interface WinEventData
{
    wins: WinWaysData[];
}

export class WinEvent extends Event
{
    public static readonly SHOW = "WinEvent.SHOW";
    public static readonly SHOW_ALL = "WinEvent.SHOW_ALL";
}