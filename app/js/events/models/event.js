/**
 * Created by hlogeon on 8/10/16.
 *
 * Represents single event
 * Helps to interact with event across all the views.
 *
 */

import angular from 'angular';
import moment from 'moment';
class Event {

    /**
     * Gets JSON data
     * @param data
     */
    constructor (data) {
        if(data) {
            angular.extend(this, data);
            this.icon = this.getIcon();
        }
    }

    /**
     * Get coordinates object
     * @returns {{longitude: *, latitude: *}}
     */
    getLatLng () {
        if(typeof this.location === "undefined" || this.location === null) {
            this.location = this.venue.location;
        }
        return {
            longitude: this.location.coordinates[0],
            latitude: this.location.coordinates[1]
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

    getIcon () {
        if(!this.categories || !this.categories[0]) {
            return '/assets/img/question.png';
        } else {
            return 'http://venvast.com/img/cache/original/categories/' + this.categories[0].image;
        }
    }

    /**
     * Get image url. Keep as it is if
     * url is external. Set to mock if empty
     * and prefix path if self-hosted
     * @returns {*}
     */
    getImageUrl () {
        if(!this.picture) {
            return 'https://placeholdit.imgix.net/~text?txtsize=33&txt=' + this.title + '&w=350&h=150';
        }
        if(this.picture && this.picture.startsWith('http')) {
            return this.picture;
        } else {
            return '/img/cache/original/events/' + this.picture;
        }
    }

    getCategoryName () {
        if(!this.categories || !this.categories[0]) {
            return 'Undefined';
        }
        return this.categories[0].name;
    }

    getDirection () {

    }

    getPosition () {

    }
    
    getStartAt () {
        return moment(this.start_at);
    }

    getEndAt () {
        if(this.end_at){
            return moment(this.end_at);
        }
        return null;
    }
    
    getStartsForHumans () {
        return moment().to(this.getStartAt());
    }

    toMarker() {
        return {
            "id": this._id,
            "center": this.getLatLngArray(),
            "icon": this.getIcon(),
            "title": this.title,
            "price": this.getCategoryName(),
            "image": this.getImageUrl()
        };
    }


}

export default Event;