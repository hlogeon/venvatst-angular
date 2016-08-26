/**
 * Created by hlogeon on 8/11/16.
 *
 * Event request service is used to make requests for events
 * Define if it's request to organizer panel or not
 * Set location and the search radius
 * Handle pagination
 * Handle favorites and saved
 * Handle date and text requests
 *
 */
import BaseRequest from '../../common/services/base-request.service.js';
import moment from 'moment';

class VenueRequestService extends BaseRequest {


    constructor (params) {
        super();
        this.setDefaultRadius();
        this.setLocation(13.7395009, 100.5755878); //TODO: implement real location
    }

    setCategoryId (categoryId) {
        this.params.category = categoryId;
    }

    setCategory (category) {
        if(!category) {
            delete this.params.category;
        } else {
            this.params.category = category._id;
        }
    }

    setText (text) {
        this.params.text = text;
    }
    
    /**
     * Set location from user object
     * @param user
     */
    setUserLocation (user) {
        this.params.latitude = user.latitude;
        this.params.longitude = user.longitude;
    }

    /**
     * Set location from latitude and longitude
     *
     * @param {number} latitude
     * @param {number} longitude
     */
    setLocation (latitude, longitude) {
        this.params.latitude = latitude;
        this.params.longitude = longitude;
    }

    /**
     * Return current request latitude
     *
     * @returns {*|Number}
     */
    getLat () {
        return this.params.latitude;
    }


    /**
     * Return current request longitude
     *
     * @returns {*|Number}
     */
    getLng () {
        return this.params.longitude;
    }

    /**
     * Set request radius
     * @param {number} radius
     */
    setRadius (radius = 25.0) {
        this.params.radius = radius;
    }

    /**
     * Return current request radius
     *
     * @returns {number|*}
     */
    getRadius () {
        return this.params.radius;
    }

    /**
     * Set default radius
     */
    setDefaultRadius () {
        this.params.radius = this.defaultRadius();
    }

    /**
     * Define default radius for this type of request
     *
     * @returns {number}
     */
    defaultRadius() {
        return 25.0;
    }

    /**
     * Return the number of results we expect for each page
     * @returns {number}
     */
    getExpectedResultsCount() {
        return 60;
    }

    static factory() {
        return new VenueRequestService({});
    }
    
}

export default VenueRequestService;