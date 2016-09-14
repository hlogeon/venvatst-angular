/**
 * Created by hlogeon on 8/10/16.
 */
import Event from '../models/event.js';
import EventsService from '../services/events.service.js';

class EventOrganizerCard {
    constructor (EventsService, $q) {
        this.restrict = 'EA';
        this.templateUrl = 'templates/events/directives/organizer-card.html';
        this.scope = {
            event: '='
        };
        this.service = EventsService;
        this.q = $q;
    }

    link (scope, element) {
        let context = this;
        scope.delete = (event) => {
            context.q.when(context.service.deleting(event)).then(function (response) {
                if (response === true) {
                    element[0].remove();
                }
            });
        }
    }

    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory (EventsService, $q) {
        EventOrganizerCard.instance = new EventOrganizerCard(EventsService, $q);
        return EventOrganizerCard.instance;
    }
}

EventOrganizerCard.directiveFactory.$inject = ['EventsService', '$q'];

export default EventOrganizerCard;