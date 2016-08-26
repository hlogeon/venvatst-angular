import BaseEvent from './base.event.js';

class CategoryChangedEvent extends BaseEvent {


    /**
     * Specify event name
     * 
     * @returns {string}
     */
    getEventName() {
        return 'category-changed-event';
    }
    
    static factory ($rootScope) {
        return new CategoryChangedEvent($rootScope);
    }
    
}

export default CategoryChangedEvent;