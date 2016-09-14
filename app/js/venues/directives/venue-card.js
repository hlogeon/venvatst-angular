/**
 * Created by hlogeon on 8/10/16.
 */
import Venue from '../models/venue.js';

class VenueCard {
    
    constructor (VenuesService) {
        this.restrict = 'EA';
        // this.replace = true;
        this.templateUrl = 'templates/venues/directives/venue-card.html';
        this.scope = {
            venue: '=',
            distance: '='
        };
        this.service = VenuesService;
    }

    link (scope, element) {
        let context = this;
        scope.favor = function (venue) {
            context.service.favor(venue.slug);
        }
    }

    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory (VenuesService) {
        VenueCard.instance = new VenueCard(VenuesService);
        return VenueCard.instance;
    }
}

export default VenueCard;