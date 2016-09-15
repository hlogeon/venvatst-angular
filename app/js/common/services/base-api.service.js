
/**
 * @type {WeakMap} contains angular $http service
 **/
const HTTP = new WeakMap();
/**
 * 
 * @type {WeakMap} contains angular-local-storage service
 */
const LocalStorage = new WeakMap();
const REQUEST_SERVICE = new WeakMap();

/**
* Class for interacting with API
**/
class BaseApiService {

	/**
	* Class constructor.
	* Set the http service and api end point
	 * @param {Object} $http
	 * @param {Object} localStorageService
	 * @param {BaseRequest} requestService
	**/
	constructor ($http, localStorageService, requestService) {
		HTTP.set(this, $http);
		LocalStorage.set(this, localStorageService);
		REQUEST_SERVICE.set(this, requestService);
		this.apiPath = 'https://api.venvast.com/';
		this.apiEndPoint = '';
	}

	/**
	 * Returns EventRequestService instance
	 *
	 * @return {VenueRequestService}
	 */
	getRequestService() {
		return REQUEST_SERVICE.get(this);
	}

	/**
	 * Perform get request based on path
	 *
	 * @param path
	 * @returns {Promise.<CanvasPixelArray>}
     */
	get (path) {
		return HTTP.get(this).get(this.apiPath + path).then(response => response.data);
	}

	getHttpObject () {
		return HTTP.get(this);
	}

	/**
	 * Create service
	 *
	 * @param $http
	 * @param localStorageService
	 *
	 * @returns {BaseApiService}
     */
	static factory ($http, localStorageService) {
		return new BaseApiService($http, localStorageService);
	}

	/**
	 *
	 * @returns {Object} localStorageService instance
     */
	getLocalStorage () {
		return LocalStorage.get(this);
	}

}

export default BaseApiService;