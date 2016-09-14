import angular from 'angular';
import 'moment';

import VenuesService from './services/venues.service.js';
import VenueCategoriesService from './services/venue-categories.service.js';
import VenueRequestService from './services/venue-request.service.js';
// import UserService from '../user/services/user.service.js';

import Venue from './models/venue.js';
import VenueCard from './directives/venue-card.js';
import VenueForm from './directives/form.directive.js';
import OrganizerVenueCard from './directives/organizer-venue-card.js';

import VenuesListController from './controllers/venues-list.controller.js';
import DraftsListController from './controllers/drafts-list.controller.js';
import VenuesStickyHeaderController from './controllers/venues-sicky-header.controller.js';
import VenuesHeaderController from './controllers/venues-header.controller.js';
import VenuesDetailsController from './controllers/venues-details.controller.js';
import VenuesCreateController from './controllers/venues-create.controller.js';

import PlaceFilterChangedEvent from '../common/events/place-filter-changed.event.js';

let controllerDependencies = [
    '$stateParams', '$state', '$timeout',
    '$scope', '$q', 'VenuesService',
    'VenueCategoriesService', 'PlaceFilterChangedEvent',
    'CategoryChangedEvent', 'MarkersLoadedEvent',
    'UserService', 'GotLocationEvent'
];

let draftsControllerDependencies = [
  '$stateParams', '$state', '$timeout',
  '$scope', '$q', 'VenuesService',
  'VenueCategoriesService', 'PlaceFilterChangedEvent', 
  'CategoryChangedEvent', 'UserService'
];

VenuesListController.$inject = controllerDependencies;
DraftsListController.$inject = draftsControllerDependencies;
VenuesCreateController.$inject = ['UserService', 'GotLocationEvent', 'VenuesService', 'VenueCategoriesService', 'Notification', '$q', '$scope', '$state', '$stateParams'];
VenuesStickyHeaderController.$inject = ['VenueRequestService', 'VenuesService', 'PlaceFilterChangedEvent'];
VenuesHeaderController.$inject = ['VenueRequestService', 'VenuesService', 'PlaceFilterChangedEvent'];
VenuesDetailsController.$inject = ['$stateParams', '$scope', '$q', 'VenuesService'];
Venue.$inject = ['moment'];
VenuesService.factory.$inject = ['$http', '$rootScope', 'localStorageService', 'VenueRequestService', 'LoginEvent', 'RegisterEvent', 'Notification'];
OrganizerVenueCard.directiveFactory.$inject = ['VenuesService', '$q'];
VenueCard.directiveFactory.$inject = ['VenuesService'];

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
  .directive('organizerVenueCard', OrganizerVenueCard.directiveFactory)
  .directive('venueForm', VenueForm.directiveFactory)
  .controller('VenuesListController', VenuesListController)
  .controller('DraftsListController', DraftsListController)
  .controller('VenuesDetailsController', VenuesDetailsController)
  .controller('VenuesStickyHeaderController', VenuesStickyHeaderController)
  .controller('VenuesCreateController', VenuesCreateController)
  .controller('VenuesHeaderController', VenuesHeaderController);


export default 'venvast.venues';