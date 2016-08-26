/**
 * Venue service for getting events from the server
 *
 */
import BaseApiService from '../../common/services/base-api.service.js';
import Venue from '../models/venue.js';
import VenueRequestService from '../services/venue-request.service.js';
import angular from 'angular';

const REQUEST_SERVICE = new WeakMap();

class VenuesService extends BaseApiService {

	/**
	 * Class constructor.
	 * Set the http service and api end point
	 **/
	constructor ($http, localStorageService, VenueRequestService) {
		super($http, localStorageService, VenueRequestService);
		this.apiEndPoint = 'venue';
		this.getLocalStorage().set('allVenues', []);
	}

	/**
	 * Getting events with the event request object
	 *
	 * @returns {Promise.<TResult>}
     */
	gettingVenues () {
		var context = this;
		let http = this.getHttpObject();
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint,
			'params': context.getRequestService().getRequestData()
		}).then(function(venues) {
			var venuesObjects = [];
			let request = context.getRequestService();
			venues = venues.data;
			request.setResultCount(venues.length);
			request.setPage(request.getPage() + 1);
			context.getLocalStorage().set('allEvents', venues);
			venues.forEach(function (event) {
				venuesObjects.push(new Venue(event));
			});

			return venuesObjects;
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
			return new Venue(event.data);
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
			eventsObjects.push(new Venue(event));
		});
		return eventsObjects;
	}


	/**
	 *
	 * @param {[Venue]} venues
     */
	getMarkers (venues) {
		let markers = [];
		venues.forEach(event => markers.push(event.toMarker()));
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
	static factory ($http, localStorageService, VenueRequestService) {
		return new VenuesService($http, localStorageService, VenueRequestService);
	}

}

export default VenuesService;