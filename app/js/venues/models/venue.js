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
        if(!this.cover_image) {
            return 'https://placeholdit.imgix.net/~text?txtsize=33&txt=' + this.name + '&w=350&h=150';
        }
        if(this.cover_image && this.cover_image.startsWith('http')) {
            return this.cover_image;
        } else {
            return '//venvast.com/img/cache/original/venues/' + this.cover_image;
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