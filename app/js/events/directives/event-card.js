/**
 * Created by hlogeon on 8/10/16.
 */
import Event from '../models/event.js';

class EventCard {
    constructor () {
        this.restrict = 'EA';
        // this.replace = true;
        this.templateUrl = 'templates/events/directives/event-card.html';
        this.scope = {
            event: '='
        };
    }

    link (scope, element) {

    }

    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory () {
        EventCard.instance = new EventCard();
        return EventCard.instance;
    }
}

EventCard.directiveFactory.$inject = [];

export default EventCard;