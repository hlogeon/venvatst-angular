import BaseEvent from './base.event.js'
/**
 * 
 * Event for handling place changes in filters
 * 
 */
class PlaceFilterChangedEvent extends BaseEvent {

    getEventName () {
        return 'place-filter-changed';
    }

    static factory ($rootScope) {
        return new PlaceFilterChangedEvent($rootScope);
    }

}

export default PlaceFilterChangedEvent;