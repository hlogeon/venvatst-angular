import BaseEvent from '../../common/events/base.event.js';


class DateToChangedEvent extends BaseEvent {

    getEventName () {
        return 'events-date-to-changed';
    }


    static factory ($rootScope) {
        return new DateToChangedEvent($rootScope);
    }
}

export default DateToChangedEvent;