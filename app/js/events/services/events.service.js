/**
 * Event service for getting events from the server
 *
 */
import BaseApiService from '../../common/services/base-api.service.js';
import Event from '../models/event.js';
import EventRequestService from '../services/event-request.service.js';
import angular from 'angular';

const REQUEST_SERVICE = new WeakMap();

class EventsService extends BaseApiService {

	/**
	 * Class constructor.
	 * Set the http service and api end point
	 * @param {Object} $http
	 **/
	constructor ($http, localStorageService, EventRequestService) {
		super($http, localStorageService, EventRequestService);
		this.apiEndPoint = 'event';
		this.getLocalStorage().set('allEvents', []);
	}

	/**
	 * Getting events with the event request object
	 *
	 * @returns {Promise.<TResult>}
     */
	gettingEvents () {
		var context = this;
		let http = this.getHttpObject();
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint,
			'params': context.getRequestService().getRequestData()
		}).then(function(events) {
			var eventsObjects = [];
			let request = context.getRequestService();
			events = events.data;
			request.setResultCount(events.length);
			request.setPage(request.getPage() + 1);
			context.getLocalStorage().set('allEvents', events);
			events.forEach(function (event) {
				eventsObjects.push(new Event(event));
			});

			return eventsObjects;
		});
	}
	
	
	gettingOne (id) {
		var context = this;
		let http = this.getHttpObject();
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint + '/' + id,
			'params': {timezone: context.getRequestService().getTimezone()}
		}).then(function(event) {
			return new Event(event.data);
		});
	}

	gettingMarkers () {
		var context = this;
		let http = this.getHttpObject();
		let params = {};
		$.extend(params, context.getRequestService().getRequestData());
		params.page = 0;
		params.markers = true;
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint,
			'params': params
		}).then(function(markers) {
			return markers.data;
		});
	}
	
	

	typeAheadRequest () {
		var context = this;
		let http = this.getHttpObject();
		let params = {};
		$.extend(params, context.getRequestService().getRequestData());
		let page = context.getRequestService().getPage();
		params.page = 0;
		params.type_ahead = true;
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint,
			'params': params
		}).then(function(events) {
			return events.data;
		});
	}

	getAllFromStorage () {
		let events = this.getLocalStorage().get('allEvents');
		let eventsObjects = [];
		events.forEach(function(event) {
			eventsObjects.push(new Event(event));
		});
		return eventsObjects;
	}


	/**
	 *
	 * @param {[Event]} events
     */
	getMarkers (events) {
		let markers = [];
		events.forEach(event => markers.push(event.toMarker()));
		return markers;
	}

	/**
	* Get one event by ID
	**/
	one () {

	}

	/**
	* Get user favorites
	**/
	favorites () {

	}

	/**
	* Get user subscriptions
	**/
	subscriptions () {

	}


	canOrganize () {

	}

	/**
	 * Create service
	 * @param $http
	 * @returns {BaseApiService}
	 */
	static factory ($http, localStorageService, EventRequestService) {
		return new EventsService($http, localStorageService, EventRequestService);
	}

}

export default EventsService;