/**
 * Venue service for getting events from the server
 *
 */
import BaseApiService from '../../common/services/base-api.service.js';
import Venue from '../models/venue.js';
import VenueRequestService from '../services/venue-request.service.js';
import angular from 'angular';

const REQUEST_SERVICE = new WeakMap();

const MODE_DRAFTS = 'drafts';
const MODE_ORGANIZER = 'organizer';
const MODE_FAVORITES = 'favorites';

class VenuesService extends BaseApiService {

	/**
	 * Class constructor.
	 * Set the http service and api end point
	 **/
	constructor ($http, $rootScope, localStorageService, VenueRequestService, LoginEvent, RegisterEvent, Notification) {
		super($http, localStorageService, VenueRequestService);
		this.apiEndPoint = 'venue';
		this.notification = Notification;
		this.rootScope = $rootScope;
		this.getLocalStorage().set('allVenues', []);
		this.getLocalStorage().set('unsentVenues', []); //store data from unsent create forms
		this.subscribeUserEvents(LoginEvent);
		this.subscribeUserEvents(RegisterEvent);
	}


	subscribeUserEvents (event) {
		let context = this;
		event.subscribe(this.rootScope, () => {
			let venues = this.unsentVenues().slice();
			let fails = 0;
			let context = this;
			for (var i = 0; i < venues.length; i++) {
				this.submit(venues[i]).then(function (response) {
					if(response.success === true) {
						if(response.venue.draft === true) {
							context.successDraftNotification(response.venue);
						} else {
							context.successVenueNotification(response.venue);
						}
					} else {
						fails++;
					}
					if (fails > 0) {
						context.failSavingNotification(fails);
					}
					venues.splice(i, 1);
				});
			}
		});
		context.getLocalStorage().set('unsentVenues', []);
	}

	failSavingNotification (fails) {
		this.notification.error({title: 'Saving failure', message: 'Saving of <b>' + fails + '</b> venues faild'});
	}

	failDelete (venue, error) {
		this.notification.error({title: 'Delete failure', message: 'Deleting of <b>' + venue.name + '</b> venues faild.<br/>' + error});
	}

	successDelete (venue) {
		this.notification.warning({title: 'Successfull delete', message:  venue.name + '</b> were successfuly deleted'});
	}

	successDraftNotification (draft) {
		this.notification.success({title: 'Draft saved', message: 'Draft of venue <b>' + draft.name + '</b> saved. You can now check it at <b>organizer panel<b> <br/>Menu -> Venues -> Organize and select Drafts there', delay: 10000});
	}

	successVenueNotification (venue) {
		this.notification.success({title: "Venue saved", message: "Venue " + venue.name + " saved. You can now check it at <b>organizer panel<b> <br/>Menu -> Venues -> Organize", delay: 10000});
	}

	unauthorizedNotification() {
		this.notification.error({title: 'Not allowed', message: 'You are not allowed to perform this action'});
	}

	/**
	 * Getting events with the event request object
	 *
	 * @returns {Promise.<TResult>}
     */
	gettingVenues (mode) {
		var context = this;
		let http = this.getHttpObject();
		let path = context.apiPath + context.apiEndPoint;
		let options = {};
		if(typeof mode !== 'undefined') {
			switch(mode) {
				case MODE_DRAFTS:
					path += '/drafts';
					break;
				case MODE_ORGANIZER:
					path += '/organize';
					break;
				case MODE_FAVORITES:
					path += '/favorites';
					break;
			}
		}
		if (this.getLocalStorage().get('user_token')) {
			options.headers = {
				'Authorization': 'Bearer '+ this.getLocalStorage().get('user_token')
			}
		}
		return http({
			'method': 'GET',
			'url': path,
			'params': context.getRequestService().getRequestData(),
			'headers': options.headers
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

	
	gettingOne (slug) {
		var context = this;
		let http = this.getHttpObject();
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint + '/view/' + slug,
			'params': {timezone: context.getRequestService().getTimezone()}
		}).then(function(venue) {
			return new Venue(venue.data.venue);
		});
	}

	favor (slug) {
		let context = this;
		let http = this.getHttpObject();
		let headers = {
			'Authorization': 'Bearer '+ this.getLocalStorage().get('user_token')
		}
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint + '/favor/' + slug,
			'params': {timezone: context.getRequestService().getTimezone()},
			'headers': headers
		}).then(function(response) {
			context.notification.success({title: "Success", message: "Venue were added to your favorites"});
			return response.data;
		}, function (errorResponse) {
			context.unauthorizedNotification();
		});
	}

	gettingEditable (slug) {
		var context = this;
		let http = this.getHttpObject();
		let headers = {
			'Authorization': 'Bearer '+ this.getLocalStorage().get('user_token')
		}
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint + '/editable/' + slug,
			'params': {timezone: context.getRequestService().getTimezone()},
			'headers': headers
		}).then(function(response) {
			return response.data;
		}, function (errorResponse) {
			context.unauthorizedNotification();
		});	
	}

	gettingMarkers (mode) {
		var context = this;
		let http = this.getHttpObject();
		let path = context.apiPath + context.apiEndPoint + '/markers';
		let headers = {}
		if (mode === MODE_FAVORITES) {
			path += '/favorites';
			headers.Authorization = 'Bearer '+ this.getLocalStorage().get('user_token');
		}
		return http({
			'method': 'GET',
			'url': path,
			'params': context.getRequestService().getRequestData(),
			'headers': headers
		}).then(function(markers) {
			return markers.data;
		});
	}
	

	typeAheadRequest (mode, text) {
		var context = this;
		let http = this.getHttpObject();
		if (mode) {
			switch (mode) {
				case MODE_DRAFTS:
					break;
				case MODE_ORGANIZER:
					break;
			}
		}
		let params = context.getRequestService().getRequestData();
		if (text) {
			params = {
				text: text
			}
		}
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint + '/type_ahead',
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


	submit (venue) {
		let http = this.getHttpObject();
		let context = this;
		let options = {};
		let path = context.apiPath + context.apiEndPoint;
		if(venue.draft) {
			path += '/draft';
		} else {
			path += '/create';
		}
		if (this.getLocalStorage().get('user_token')) {
			options.headers = {
				'Authorization': 'Bearer '+ this.getLocalStorage().get('user_token')
			}
		}
		return http.post(path, venue, options).then(function (response) {
			return response.data;
		}, function(errorResponse) {
			return {
				success: false,
				errors: errorResponse.data
			};
		});
	}

	/**
	 * Perform delete action
	 * 
	 * @param  {[type]} venue [description]
	 * @return {[type]}       [description]
	 */
	deleting (venue) {
		let http = this.getHttpObject();
		let context = this;
		let options = {};
		if (this.getLocalStorage().get('user_token')) {
			options.headers = {
				'Authorization': 'Bearer '+ this.getLocalStorage().get('user_token')
			}
		}
		return http({
			'method': 'DELETE',
			'url': context.apiPath + context.apiEndPoint +'/delete/' + venue.id,
			'headers': options.headers
		}).then(function (response) {
			context.successDelete(venue);
			return true;
		}, function (errorResponse) {
			if(errorResponse.data.errors && errorResponse.data.errors.length > 0) {
				let errors = errorResponse.data.errors;
				let error = errors[Object.keys(errors)[0]];
				context.failDelete(venue, error);
			}
			return false;
		});

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

	unsentVenues() {
		return this.getLocalStorage().get('unsentVenues');
	}

	setUnsentVenues(unsentVenues) {
		this.getLocalStorage().set('unsentVenues', unsentVenues);
	}

	addUnsentVenue(formData) {
		let venues = this.getLocalStorage().get('unsentVenues');
		if(!venues) {
			venues = [formData];
		} else {
			venues.push(formData);
		}
		this.getLocalStorage().set('unsentVenues', venues);
	}

	/**
	 * Create service
	 * @param $http
	 * @returns {BaseApiService}
	 */
	static factory ($http, $rootScope, localStorageService, VenueRequestService, LoginEvent, RegisterEvent, Notification) {
		return new VenuesService($http, $rootScope, localStorageService, VenueRequestService, LoginEvent, RegisterEvent, Notification);
	}

}

export default VenuesService;