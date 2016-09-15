import angular from 'angular';
import 'angular-ui-router';
import 'angular-ui-bootstrap';
import 'angular-material';
import 'angular-local-storage';
import 'angular-formly';
import 'angular-formly-templates-bootstrap';
import 'angular-jquery-timepicker';
import 'angular-file-upload';
import 'angular-ui-notification';
import 'ui-select';
import 'meanie-angular-duplicate-requests-filter';
import 'moment';
import ListController from './controllers/list.controller.js';
import DetailsController from './controllers/details.controller.js';
import BaseApiService from './services/base-api.service.js';

import VenvastCard from './directives/venvast-card.js';
import Loader from './directives/ui/loader.directive.js';
import LoadingButton from './directives/utils/loading-button.js';
import MarkerMap from './directives/marker-map.directive.js';
import StickyHeaderController from './controllers/header/sticky-header.controller.js';
import BaseHeaderController from './controllers/header/base-header.controller.js';
import BaseRequest from './services/base-request.service.js';
import BaseEvent from './events/base.event.js';
import PlaceFilterChangedEvent from './events/place-filter-changed.event.js';
import CategoryChangedEvent from './events/category-changed.event.js';
import MarkersLoadedEvent from './events/markers-loaded.event.js';

String.prototype.startsWith = function (prefix) {
    return this.indexOf(prefix) === 0;
};

BaseApiService.factory.$inject = ['$http', 'localStorageService'];
BaseEvent.factory.$inject = ['$rootScope'];
PlaceFilterChangedEvent.factory.$inject = ['$rootScope'];
MarkersLoadedEvent.factory.$inject = ['$rootScope'];

let dependencies = [
    'ui.router',
    'ui.bootstrap',
    'ui.select',
    'ngMaterial',
    'LocalStorageModule',
    'formly',
    'formlyBootstrap',
    'ui-notification',
    'DuplicateRequestsFilter.Decorator'
];

angular
  .module('venvast.common', dependencies)
  .factory('BaseApiService', BaseApiService.factory)
  .factory('BaseRequest', BaseRequest.factory)
  .factory('BaseEvent', BaseEvent.factory)
  .factory('CategoryChangedEvent', CategoryChangedEvent.factory)
  .factory('MarkersLoadedEvent', MarkersLoadedEvent.factory)
  .factory('PlaceFilterChangedEvent', PlaceFilterChangedEvent.factory)
  .directive('venvastCard', VenvastCard.directiveFactory)
  .directive('loadingButton', LoadingButton.directiveFactory)
  .directive('markerMap', MarkerMap.directiveFactory)
  .directive('loader', Loader.directiveFactory)
  .controller('ListController', ListController)
  // .controller('DetailsController', DetailsController)
  .controller('BaseHeaderController', BaseHeaderController)
  .controller('StickyHeaderController', StickyHeaderController);

export default 'venvast.common';