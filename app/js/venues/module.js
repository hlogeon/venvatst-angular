import angular from 'angular';
import 'moment';

import VenuesService from './services/venues.service.js';
import VenueCategoriesService from './services/venue-categories.service.js';
import VenueRequestService from './services/venue-request.service.js';

import Venue from './models/venue.js';
import VenueCard from './directives/venue-card.js';

import VenuesListController from './controllers/venues-list.controller.js';
import VenuesStickyHeaderController from './controllers/venues-sicky-header.controller.js';
import VenuesHeaderController from './controllers/venues-header.controller.js';
import VenuesDetailsController from './controllers/venues-details.controller.js';

import PlaceFilterChangedEvent from '../common/events/place-filter-changed.event.js';

let controllerDependencies = [
    '$scope', '$q', 'VenuesService',
    'VenueCategoriesService', 'PlaceFilterChangedEvent',
    'CategoryChangedEvent', 'MarkersLoadedEvent',
    'UserService', 'GotLocationEvent'
];

VenuesListController.$inject = controllerDependencies;
VenuesStickyHeaderController.$inject = ['VenueRequestService', 'VenuesService', 'PlaceFilterChangedEvent'];
VenuesHeaderController.$inject = ['VenueRequestService', 'VenuesService', 'PlaceFilterChangedEvent'];
VenuesDetailsController.$inject = ['$stateParams', '$scope', '$q', 'VenuesService'];
Venue.$inject = ['moment'];

let dependencies = [
    'venvast.common',
    'venvast.user'
];

angular
  .module('venvast.venues', dependencies)
  .factory('VenuesService', VenuesService.factory)
  .factory('VenueCategoriesService', VenueCategoriesService.factory)
  .factory('VenueRequestService', VenueRequestService.factory)
  .service('Venue', Venue)
  .directive('venueCard', VenueCard.directiveFactory)
  .controller('VenuesListController', VenuesListController)
  .controller('VenuesDetailsController', VenuesDetailsController)
  .controller('VenuesStickyHeaderController', VenuesStickyHeaderController)
  .controller('VenuesHeaderController', VenuesHeaderController);


export default 'venvast.venues';
