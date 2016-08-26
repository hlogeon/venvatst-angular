/**
 * Created by hlogeon on 8/10/16.
 */
import Venue from '../models/venue.js';

class VenueCard {
    
    constructor () {
        this.restrict = 'EA';
        // this.replace = true;
        this.templateUrl = 'templates/venues/directives/venue-card.html';
        this.scope = {
            venue: '='
        };
    }

    link (scope, element) {

    }

    // Based on: http://www.sitepoint.com/writing-angularjs-apps-using-es6/
    static directiveFactory () {
        VenueCard.instance = new VenueCard();
        return VenueCard.instance;
    }
}

VenueCard.directiveFactory.$inject = [];

export default VenueCard;