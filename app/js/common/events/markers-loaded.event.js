import BaseEvent from './base.event.js';

class MarkersLoadedEvent extends BaseEvent {

    /**
     * Specify event name
     *
     * @returns {string}
     */
    getEventName() {
        return 'markers-loaded-event';
    }

    static factory ($rootScope) {
        return new MarkersLoadedEvent($rootScope);
    }
    
}

export default MarkersLoadedEvent;