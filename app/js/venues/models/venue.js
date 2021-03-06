/**
 * Created by hlogeon on 8/10/16.
 *
 * Represents single event
 * Helps to interact with event across all the views.
 *
 */

import angular from 'angular';
import moment from 'moment';

class Venue {

    /**
     * Gets JSON data
     * @param data
     */
    constructor (data) {
        if(data) {
            angular.extend(this, data);
            this.icon = this.getIcon();
            this.image = this.getImageUrl();
        }
    }

    /**
     * Get coordinates object
     * @returns {{longitude: *, latitude: *}}
     */
    getLatLng () {
        if(!this.location) {
            return null;
        }
        return {
            longitude: this.location.lng,
            latitude: this.location.lat
        }
    }

    /**
     * Get coordinates as an array of latitude and longitude
     * @returns {*[]}
     */
    getLatLngArray () {
        let latLng = this.getLatLng();
        return [latLng.latitude, latLng.longitude];
    }

    /**
     * Get full icon url 
     * @return {[type]} [description]
     */
    getIcon () {
        if(this.icon === null) {
            return '/assets/img/question.png';
        }
        return this.icon;
    }

    /**
     * Get image url. Keep as it is if
     * url is external. Set to mock if empty
     * and prefix path if self-hosted
     * @returns {*}
     */
    getImageUrl () {
        if(!this.images || this.images.length === 0) {
            return 'https://placeholdit.imgix.net/~text?txtsize=33&txt=' + this.name + '&w=350&h=150';
        }
        return this.images;
    }

    getCategoryName () {
        return this.category.name;
    }

    getDirection () {

    }

    getPosition () {

    }

    toMarker() {
        return {
            "id": this._id,
            "center": this.getLatLngArray(),
            "icon": this.getIcon(),
            "title": this.name,
            "price": this.getCategoryName(),
            "image": this.getImageUrl()
        };
    }


}

export default Venue;