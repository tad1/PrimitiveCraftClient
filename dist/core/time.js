var Time_ = /** @class */ (function () {
    function Time_() {
        this.cycleTime = 0; //* int
        this.time = 0.0;
        this.fixed_time = 0.0;
        this.fixed_delta_time = 0.1;
        this.delta_time = 0.0;
        this.time = 0.0;
        this.fixed_time = 0.0;
        this.fixed_delta_time = 0.01; //default: 100 physics update per second
        this.maximum_delta_time = 0.1; //default
        this.lastTick = window.performance.now();
    }
    Time_.prototype.calculateDelta = function () {
        var currentTick = window.performance.now();
        this.cycleTime = currentTick - this.lastTick;
        this.lastTick = currentTick;
        this.delta_time = this.cycleTime / 1000; //convert to seconds
        if (this.delta_time > this.maximum_delta_time)
            this.delta_time = this.maximum_delta_time;
        this.time += this.delta_time;
    };
    Time_.prototype.calculateFixedTime = function () {
        this.fixed_time += this.fixed_delta_time;
    };
    return Time_;
}());
export var Time = new Time_();
//# sourceMappingURL=time.js.map