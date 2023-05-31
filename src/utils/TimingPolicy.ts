const DEFAULT_ALLOWED_DURATION = 2.0;
const DEFAULT_ALLOWED_PUTOFF_HOURS = 24.0;

class TimingPolicy {
    allowedDurationHours: number;
    allowedStartPutOffHours: number;

    constructor(duration: number = DEFAULT_ALLOWED_DURATION, putoff: number = DEFAULT_ALLOWED_PUTOFF_HOURS) {
        this.allowedStartPutOffHours = putoff;
        this.allowedDurationHours = duration;
    }

    validate(start: Date, end: Date): boolean {

        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        if (duration < 0) {
            throw new TimingPolicyException('Start date must be earlier than end date!')
        }
        if (duration > this.allowedDurationHours) {
            throw new TimingPolicyException('Booking duration cannot exceed ' + this.allowedDurationHours + ' hours!');
        }

        const putoff = (start.getTime() - new Date().getTime()) / (1000 * 60 * 60);
        if (putoff < 0) {
            throw new TimingPolicyException('Booking cannot start in past!');
        }
        if (putoff > this.allowedStartPutOffHours) {
            throw new TimingPolicyException('Booking cannot start later than in ' + this.allowedStartPutOffHours + ' hours!')
        }

        return true;
    }
}

export class TimingPolicyException extends Error {
    constructor(...args) {
        super(...args);
    }
}

export default new TimingPolicy();