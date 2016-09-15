/**
 * Event service for getting events from the server
 *
 */
import BaseApiService from '../../common/services/base-api.service.js';
import Event from '../models/event.js';
import EventRequestService from '../services/event-request.service.js';
import angular from 'angular';
import jstz from 'jstz';

const REQUEST_SERVICE = new WeakMap();
const MODE_DRAFTS = 'drafts';
const MODE_ORGANIZER = 'organizer';
const MODE_FAVORITES = 'favorites';
const MODE_GOING = 'going';

class EventsService extends BaseApiService {

	/**
	 * Class constructor.
	 * Set the http service and api end point
	 * @param {Object} $http
	 **/
	constructor ($http, $rootScope, localStorageService, EventRequestService, LoginEvent, RegisterEvent, Notification) {
		super($http, localStorageService, EventRequestService);
		this.apiEndPoint = 'event';
		this.notification = Notification;
		this.rootScope = $rootScope;
		this.subscribeUserEvents(LoginEvent);
		this.subscribeUserEvents(RegisterEvent);
		this.getLocalStorage().set('allEvents', []);

	}


	submit(event) {
		let http = this.getHttpObject();
		let context = this;
		let options = {};
		let path = context.apiPath + context.apiEndPoint;
		event.timezone = jstz.determine().name();
		if(event.draft) {
			path += '/draft';
		} else {
			path += '/create';
		}
		if (this.getLocalStorage().get('user_token')) {
			options.headers = {
				'Authorization': 'Bearer '+ this.getLocalStorage().get('user_token')
			}
		}
		return http.post(path, event, options).then(function (response) {
			return response.data;
		}, function(errorResponse) {
			return {
				success: false,
				errors: errorResponse.data
			};
		});
	}


	subscribeUserEvents (event) {
		event.subscribe(this.rootScope, () => {
			let events = this.unsentEvents();
			let fails = 0;
			let context = this;
			if(!events) {
				return null;
			}
			for (var i = 0; i < events.length; i++) {
				this.submit(events[i]).then(function (response) {
					if(response.success === true) {
						if(response.event.draft === true) {
							context.successDraftNotification(response.event);
						} else {
							context.successEventNotification(response.event);
						}
					} else {
						fails++;
					}
					if (fails > 0) {
						context.failSavingNotification(fails);
					}

				});
			}
		});
	}

	going(slug) {
		var context = this;
		let http = this.getHttpObject();
		let path = context.apiPath + context.apiEndPoint + '/going/' + slug;
		let options = {};
		if (this.getLocalStorage().get('user_token')) {
			options.headers = {
				'Authorization': 'Bearer '+ this.getLocalStorage().get('user_token')
			}
		}
		return http({
			'method': 'GET',
			'url': path,
			'headers': options.headers
		}).then(function (response) {
			if(response.data.errors === false) {
				context.notification.success({title: 'Success', message: 'You can check this event in "Events I attend section" anytime', delay: 10000});
			} else {
				context.notification.error({title: 'Whoops!', message: response.data.errors[0], delay: 10000});
			}
		});
	}

	favor(slug) {
		var context = this;
		let http = this.getHttpObject();
		let path = context.apiPath + context.apiEndPoint + '/favor/' + slug;
		let options = {};
		if (this.getLocalStorage().get('user_token')) {
			options.headers = {
				'Authorization': 'Bearer '+ this.getLocalStorage().get('user_token')
			}
		}
		return http({
			'method': 'GET',
			'url': path,
			'headers': options.headers
		}).then(function (response) {
			if(response.data.errors === false) {
				context.notification.success({title: 'Success', message: 'You can check this event in <b>Events > Favorites</b> anytime ', delay: 10000});
			} else {
				context.notification.error({title: 'Whoops!', message: response.data.errors[0], delay: 10000});
			}
		});
	}


	failSavingNotification (fails) {
		this.notification.error({title: 'Saving failure', message: 'Saving of <b>' + fails + '</b> events faild'});
	}

	failDelete (event, error) {
		this.notification.error({title: 'Delete failure', message: 'Deleting of <b>' + event.name + '</b> events faild.<br/>' + error});
	}

	successDelete (event) {
		this.notification.warning({title: 'Successfull delete', message:  event.name + '</b> were successfuly deleted'});
	}

	successDraftNotification (draft) {
		this.notification.success({title: 'Draft saved', message: 'Draft of event <b>' + draft.name + '</b> saved. You can now check it at <b>organizer panel<b> <br/>Menu -> Venues -> Organize and select Drafts there', delay: 10000});
	}

	successEventNotification (event) {
		this.notification.success({title: "Venue saved", message: "Venue " + event.name + " saved. You can now check it at <b>organizer panel<b> <br/>Menu -> Venues -> Organize", delay: 10000});
	}

	unauthorizedNotification() {
		this.notification.error({title: 'Not allowed', message: 'You are not allowed to perform this action'});
	}


	/**
	 * Getting events with the event request object
	 *
	 * @returns {Promise.<TResult>}
     */
	gettingEvents (mode) {
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
				case MODE_GOING:
					path += '/list_going';
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
	
	
	gettingOne (slug) {
		var context = this;
		let http = this.getHttpObject();
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint + '/view/' + slug,
			'params': {timezone: context.getRequestService().getTimezone()}
		}).then(function(event) {
			return new Event(event.data.event);
		});
	}

	gettingEditable (slug) {
		var context = this;
		let http = this.getHttpObject();
		let options = {};
		if (this.getLocalStorage().get('user_token')) {
			options.headers = {
				'Authorization': 'Bearer '+ this.getLocalStorage().get('user_token')
			}
		}
		return http({
			'method': 'GET',
			'url': context.apiPath + context.apiEndPoint + '/editable/' + slug,
			'params': {timezone: context.getRequestService().getTimezone()},
			'headers': options.headers
		}).then(function(event) {
			return new Event(event.data.event);
		});
	}

	gettingMarkers (mode) {
		var context = this;
		let http = this.getHttpObject();
		let path = context.apiPath + context.apiEndPoint + '/markers';
		let headers = {}
		switch (mode) {
			case MODE_FAVORITES:
				path += '/favorites';
				headers.Authorization = 'Bearer '+ this.getLocalStorage().get('user_token');
				break;
			case MODE_GOING:
				path += '/going';
				headers.Authorization = 'Bearer '+ this.getLocalStorage().get('user_token');
				break;
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


	unsentEvents() {
		return this.getLocalStorage().get('unsentEvents');
	}

	setUnsentEvents(unsentEvents) {
		this.getLocalStorage().set('unsentEvents', unsentEvents);
	}

	addUnsentEvent(formData) {
		let events = this.getLocalStorage().get('unsentEvents');
		if(!events) {
			events = [formData];
		} else {
			events.push(formData);
		}
		this.getLocalStorage().set('unsentEvents', events);
	}


	/**
	 * Perform delete action
	 * 
	 * @param  {[type]} venue [description]
	 * @return {[type]}       [description]
	 */
	deleting (event) {
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
			'url': context.apiPath + context.apiEndPoint +'/delete/' + event.slug,
			'headers': options.headers
		}).then(function (response) {
			context.successDelete(event);
			return true;
		}, function (errorResponse) {
			if(errorResponse.data.errors && errorResponse.data.errors.length > 0) {
				let errors = errorResponse.data.errors;
				let error = errors[Object.keys(errors)[0]];
				context.failDelete(event, error);
			}
			return false;
		});

	}



	/**
	 * Create service
	 * @param $http
	 * @returns {BaseApiService}
	 */
	static factory ($http, $rootScope, localStorageService, EventRequestService, LoginEvent, RegisterEvent, Notification) {
		return new EventsService($http, $rootScope, localStorageService, EventRequestService, LoginEvent, RegisterEvent, Notification);
	}

}

export default EventsService;