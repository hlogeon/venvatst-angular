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

class EventRequestService extends BaseRequest {


    constructor (params) {
        super();
        this.setDefaultRadius();
        this.setLocation(13.7395009, 100.5755878); //TODO: implement real location
        this.initDefaultDates();
    }

    /**
     * Set dates to default values if not yet set
     */
    initDefaultDates () {
        if(typeof this.params.date_from === 'undefined' || ! this.params.date_from) {
            this.params.date_from = moment().format('DD.MM.YYYY');
        }
        if(typeof this.params.date_to === 'undefined' || ! this.params.date_to) {
            this.params.date_to = moment().add(7, 'days').format('DD.MM.YYYY');
        }
    }

    setCategoryId (categoryId) {
        this.params.category = categoryId;
    }

    setCategory (category) {
        if(!category) {
            delete this.params.category;
        } else {
            this.params.category = category;
        }
    }

    /**
     * Set the date from for events request
     * @param date
     */
    setDateFrom (date) {
        this.params.date_from = moment(date).format('DD.MM.YYYY');
    }

    setText (text) {
        this.params.text = text;
    }

    /**
     * Set the date to for events request
     * @param date
     */
    setDateTo (date) {
        this.params.date_to = moment(date).format('DD.MM.YYYY');
    }

    /**
     * 
     * @returns {*}
     */
    getDateFrom () {
        return moment(this.params.date_from, 'DD.MM.YYYY');
    }

    /**
     * 
     * @returns {*}
     */
    getDateTo() {
        return moment(this.params.date_to, 'DD.MM.YYYY');
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
        return new EventRequestService({});
    }
    
}

export default EventRequestService;