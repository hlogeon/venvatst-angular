/**
 * Created by hlogeon on 8/10/16.
 */
import Venue from '../models/venue.js';
import VenuesService from '../services/venues.service.js';

class OrganizerVenueCard {
    
    constructor (VenuesService, $q) {
        this.restrict = 'EA';
        this.templateUrl = 'templates/venues/directives/organizer-venue-card.html';
        this.scope = {
            venue: '='
        };
        this.service = VenuesService;
        this.q = $q;
    }

    link (scope, element) {
        let context = this;
        scope.delete  = function (venue) {
            context.q.when(context.service.deleting(venue)).then(function (response) {
                if (response === true) {
                    element[0].remove();
                }
            });
        }
    }

    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory (VenuesService, $q) {
        OrganizerVenueCard.instance = new OrganizerVenueCard(VenuesService, $q);
        return OrganizerVenueCard.instance;
    }
}

export default OrganizerVenueCard;