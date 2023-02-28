import { Event } from "./Event";

export class SpinEvent extends Event
{
    public static readonly SPIN = "SpinEvent.SPIN";

    constructor()
    {
        super(SpinEvent.SPIN);
    }

}