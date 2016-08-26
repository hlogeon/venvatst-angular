import BaseEvent from '../../common/events/base.event.js';


class DateFromChangedEvent extends BaseEvent {

    getEventName () {
        return 'events-date-from-changed';
    }


    static factory ($rootScope) {
        return new DateFromChangedEvent($rootScope);
    }
}

export default DateFromChangedEvent;