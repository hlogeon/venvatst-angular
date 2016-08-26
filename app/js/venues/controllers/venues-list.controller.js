/**
 * Created by hlogeon on 8/9/16.
 *
 * EventsListController takes control over displaying
 * list of events and all events map
 */

import ListController from '../../common/controllers/list.controller.js';
import VenuesService from '../services/venues.service.js';

class VenuesListController extends ListController {

    
    constructor ($scope, $q, service, VenuesCategoriesService, PlaceFilterChangedEvent, CategoryChangedEvent, MarkersLoadedEvent, UserService, GotLocationEvent) {
        super($scope, $q, service);
        UserService.gettingLocation();
        this.categoriesService = VenuesCategoriesService;
        this.categoryChanged = CategoryChangedEvent;
        this.markersLoaded = MarkersLoadedEvent;
        this.categories = [];
        this.loadCategories();
        this.listenCity(PlaceFilterChangedEvent);
        this.listenLocation(GotLocationEvent);
        this.listenCategories(CategoryChangedEvent);
        this.loadMarkers();
        this.mapOptions = this.getMapOptions();
    }

    
    
    init() {
        this.venues = [];
        this.getService().getRequestService().setPage(0);
        this.hasMorePages = true;
        this.pages = 0;
        this.user = {};
        this.user.lat = 13.7395009;
        this.user.lng = 100.5755878;
        this.lat = 13.7395009;
        this.lng = 100.5755878;
    }

    /**
     * Load view objects
     */
    loadObjects (pushNew = true) {
        let context = this;
        this.loading = true;
        this.getQ().when(this.getService().gettingVenues()).then(function (venues) {
            context.loading = false;
            if(context.getService().getRequestService().hasNextPage() === false) {
                context.hasMorePages = false;
            }
            if(pushNew || context.venues.length === 0) {
                venues.forEach((event) => {context.venues.push(event)});
            } else {
                context.venues = venues;
            }
        });
    }

    listenCity (city) {
        city.subscribe(this.scope, (evt, params) => {
            this.getService().getRequestService().setPage(0);
            this.getService().getRequestService().setLocation(params.place.geometry.location.lat(), params.place.geometry.location.lng());
            this.lat = params.place.geometry.location.lat();
            this.lng = params.place.geometry.location.lng();
            this.mapOptions = this.getMapOptions();
            this.loadObjects(false);
            this.loadMarkers();
        });
    }
    
    listenCategories (categoriesEvent) {
        categoriesEvent.subscribe(this.scope, (evt, params) => {
            this.getService().getRequestService().setPage(0);
            this.getService().getRequestService().setCategory(params);
            this.loadObjects(false);
            if(typeof this.getService().getRequestService().params.category !== 'undefined') {
                this.mapOptions.zoom = 12;
            }
            this.loadMarkers();
        });
    }

    listenLocation (gotLocationEvent) {
        gotLocationEvent.subscribe(this.scope, (evt, params) => {
            this.user.lat = params.lat;
            this.user.lng = params.lng;
            this.lat = params.lat;
            this.lng = params.lng;
            this.mapOptions = this.getMapOptions();
            this.service.getRequestService().setLocation(this.lat, this.lng);
            this.loadMarkers();
        });
    }

    loadCategories () {
        let context = this;
        this.getQ().when(this.categoriesService.gettingCategories()).then(function (categories) {
            context.categories = categories;
        });
    }


    loadMarkers () {
        let context = this;
        this.getService().gettingMarkers().then(function (markers) {
            let markerItems = context.makeMarkerContent(markers);
            if(context.user.lat && context.user.lng) {
                markerItems.push(context.getUserMarker({lat: context.user.lat, lng: context.user.lng}));
            }
            context.markers = markerItems;
            context.markersLoaded.notify({
                items: markerItems,
                overlay: context.makeMarkerOverlay(markers),
                clickHandler: context.markerClickHandler
            });
        });
    }


    getObjectUrlByMarker (marker) {
        return '/#/venues/'+ marker.id;
    }
    
    getMapOptions () {
        return {
            styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
            center: new google.maps.LatLng(this.lat, this.lng),
            scrollwheel: false,
            zoom: 16
        }
    }
    
}
export default VenuesListController;