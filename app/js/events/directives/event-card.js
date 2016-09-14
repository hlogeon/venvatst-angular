/**
 * Created by hlogeon on 8/10/16.
 */
import Event from '../models/event.js';
import EventsService from '../services/events.service.js';

class EventCard {
    constructor (EventsService) {
        this.restrict = 'EA';
        this.templateUrl = 'templates/events/directives/event-card.html';
        this.scope = {
            event: '='
        };
        this.service = EventsService;

    }

    link (scope, element) {
        let context = this;
        scope.going = (event) => {
            context.service.going(event.slug);
        }

        scope.favor = (event) => {
            context.service.favor(event.slug);
        }
    }

    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory (EventsService) {
        EventCard.instance = new EventCard(EventsService);
        return EventCard.instance;
    }
}

EventCard.directiveFactory.$inject = ['EventsService'];

export default EventCard;