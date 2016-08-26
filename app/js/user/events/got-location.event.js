import BaseEvent from '../../common/events/base.event.js';


class GotLocationEvent extends BaseEvent {

    getEventName () {
        return 'got-user-location-event';
    }


    static factory ($rootScope) {
        return new GotLocationEvent($rootScope);
    }
    
}

export default GotLocationEvent;