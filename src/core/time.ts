
class Time_{

    cycleTime : number = 0 //* int
    lastTick : number

    delta_time : number;
    time : number = 0.0;

    fixed_time : number = 0.0;
    fixed_delta_time : number = 0.1;
    maximum_delta_time : number;

    constructor(){
        this.delta_time = 0.0;
        this.time = 0.0;
        this.fixed_time = 0.0;

        this.fixed_delta_time = 0.01 //default: 100 physics update per second
        this.maximum_delta_time = 0.1 //default
        this.lastTick = window.performance.now()
    }

    calculateDelta() : void {
        let currentTick = window.performance.now();
        this.cycleTime = currentTick - this.lastTick;
        this.lastTick = currentTick;

        this.delta_time = this.cycleTime / 1000; //convert to seconds
        if(this.delta_time > this.maximum_delta_time)
            this.delta_time = this.maximum_delta_time;
        
        this.time += this.delta_time;
    }

    calculateFixedTime(){
        this.fixed_time += this.fixed_delta_time;
    }    
}

export const Time : Time_ = new Time_();