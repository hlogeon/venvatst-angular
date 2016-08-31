import angular from 'angular';
import 'moment';

import EventsService from './services/events.service.js';
import CategoriesService from './services/categories.service.js';
import EventRequestService from './services/event-request.service.js';

import Event from './models/event.js';

import EventCard from './directives/event-card.js';
import CategoriesList from './directives/categoties-list.directive.js';

import EventsListController from './controllers/events-list.controller.js';
import EventsStickyHeaderController from './controllers/events-sicky-header.controller.js';
import EventsHeaderController from './controllers/events-header.controller.js';
import EventsDetailsController from './controllers/events-details.controller.js';
import EventsCreateController from './controllers/events-create.controller.js';

import DateFromChangedEvent from './events/date-from-changed.event.js';
import DateToChangedEvent from './events/date-to-changed.event.js';
import PlaceFilterChangedEvent from '../common/events/place-filter-changed.event.js';

let controllerDependencies = [
    '$scope', '$q', 'EventsService', 
    'CategoriesService', 'DateFromChangedEvent', 
    'DateToChangedEvent', 'PlaceFilterChangedEvent', 
    'CategoryChangedEvent', 'MarkersLoadedEvent',
    'UserService', 'GotLocationEvent'
];

EventsListController.$inject = controllerDependencies;

EventsDetailsController.$inject = ['$stateParams', '$scope', '$q', 'EventsService'];

DateFromChangedEvent.factory.$inject = ['$rootScope'];
DateToChangedEvent.factory.$inject = ['$rootScope'];
EventsStickyHeaderController.$inject = ['EventRequestService', 'EventsService', 'DateFromChangedEvent', 'DateToChangedEvent', 'PlaceFilterChangedEvent'];
EventsHeaderController.$inject = ['EventRequestService', 'EventsService', 'DateFromChangedEvent', 'DateToChangedEvent', 'PlaceFilterChangedEvent'];
Event.$inject = ['moment'];

let dependencies = [
    'venvast.common',
    'venvast.user'
];

angular
  .module('venvast.events', dependencies)
  .factory('EventsService', EventsService.factory)
  .factory('CategoriesService', CategoriesService.factory)
  .factory('EventRequestService', EventRequestService.factory)
  .factory('DateFromChangedEvent', DateFromChangedEvent.factory)
  .factory('DateToChangedEvent', DateToChangedEvent.factory)
  .service('Event', Event)
  .directive('eventCard', EventCard.directiveFactory)
  .directive('categoriesList', CategoriesList.directiveFactory)
  .controller('EventsListController', EventsListController)
  .controller('EventsDetailsController', EventsDetailsController)
  .controller('EventsStickyHeaderController', EventsStickyHeaderController)
  .controller('EventsHeaderController', EventsHeaderController)
  .controller('EventsCreateController', EventsCreateController);

/**
 * Choose the right instance if decorator were applied based on the module name
 *
 * @param $delegate
 * @returns {*}
 */
function decorate ($delegate) {
    "use strict";
    let selectedDirective;
    $delegate.forEach(function (directive, index) {
        let module = directive.$$moduleName.split('.');
        if(module[1] === 'events') {
            selectedDirective = [directive];
        }
    });
    return selectedDirective;
}

export default 'venvast.events';
