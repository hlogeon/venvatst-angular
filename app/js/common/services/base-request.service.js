/**
 * Created by hlogeon on 8/10/16.
 * BaseRequest is an abstraction layer for all requests to VenVast.com
 * It contains useful methods and presets to easily boilerplate any specific requests.
 * It also contains some presets such as setting web call param to true.
 *
 */
import jstz from 'jstz';

class BaseRequest {
    
    
    constructor (params) {
        this.params = params || {};
        this.setIsWeb();
        this.setDefaultTimezone();
        if(!this.params.organizer) {
            this.setOrganizer(false);
        }
        if(!this.params.page) {
            this.setPage(0);
        }
    }

    /**
     * Set if its an organizer request
     *
     * @param {boolean} organizer
     */
    setOrganizer (organizer = false) {
        this.params.organizer = organizer;
    }

    /**
     * Is this request made to organizer's part of venvast?
     *
     * @returns {boolean|*}
     */
    getOrganizer () {
        return this.params.organizer;
    }

    /**
     * Venvast requires to specify the call point (web or mobile)
     */
    setIsWeb () {
        this.params.web = true;
    }

    /**
     * Set current page
     *
     * @param {number} page
     */
    setPage (page = 0) {
        this.params.page = page;
    }

    /**
     * Get current page
     * @returns {number|*}
     */
    getPage () {
        return this.params.page;
    }

    /**
     * Set the number of results you got from the server
     *
     * @param count
     */
    setResultCount (count = 0) {
        this.resultCount = count;
    }

    /**
     * Get the number of results you got from server
     * @returns {number|*}
     */
    getResultCount () {
        return this.resultCount;
    }

    /**
     * Set the number of expected results
     *
     * @returns {number}
     */
    getExpectedResultsCount () {
        return 20;
    }


    /**
     * Does next page exists and can be requested?
     *
     * @returns {boolean}
     */
    hasNextPage () {
        return this.getExpectedResultsCount() <= this.getResultCount();
    }

    /**
     * Get the data for request
     *
     * @returns {*|{}}
     */
    getRequestData () {
       return this.params;
    }

    /**
     * Set default timezone
     */
    setDefaultTimezone () {
        this.params.timezone = jstz.determine().name();
    }

    /**
     * Set timezone param
     * @param {string} timezoneName
     */
    setTimezone (timezoneName) {
        this.params.timezone = timezoneName;
    }

    /**
     * Get the value of timezone param
     * @returns {string|*}
     */
    getTimezone () {
        return this.params.timezone;
    }


    static factory() {
        return new BaseRequest({});
    }
}

export default BaseRequest;