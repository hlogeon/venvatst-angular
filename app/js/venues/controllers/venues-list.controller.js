/**
 * Created by hlogeon on 8/9/16.
 *
 * EventsListController takes control over displaying
 * list of events and all events map
 */

import ListController from '../../common/controllers/list.controller.js';
import VenuesService from '../services/venues.service.js';

class VenuesListController extends ListController {

    
    constructor ($stateParams, $state, $timeout, $scope, $q, service, VenuesCategoriesService, PlaceFilterChangedEvent, CategoryChangedEvent, MarkersLoadedEvent, UserService, GotLocationEvent) {
        super($scope, $q, service);
        this.stateParams = $stateParams;
        if($state.current.data && $state.current.data.favorites === true) {
            this.showDistance = false;
        }
        this.timeoutService = $timeout;
        this.loadingTimeout = null;
        this.state = $state;
        UserService.gettingLocation();
        this.categoriesService = VenuesCategoriesService;
        this.categoryChanged = CategoryChangedEvent;
        this.markersLoaded = MarkersLoadedEvent;
        this.categories = [];
        this.loadCategories();
        this.listenCity(PlaceFilterChangedEvent);
        this.listenLocation(GotLocationEvent);
        this.listenCategories(CategoryChangedEvent);
        this.mapOptions = this.getMapOptions();
        this.init();
    }

    
    
    init() {
        this.venues = [];
        this.getService().getRequestService().setPage(0);
        this.hasMorePages = true;
        this.pages = 0;
        this.user = {};
        this.user.lat = null;
        this.user.lng = null;
    }

    /**
     * Load view objects
     */
    loadObjects (pushNew = true) {
        let context = this;
        this.loading = true;
        if(this.state.params.slug) {
            this.getService().getRequestService().setCategory(this.state.params.slug);
        } else {
            this.getService().getRequestService().setCategory(null);
        }
        let mode = false;
        
        if (this.state.current.data && this.state.current.data.favorites === true) {
            mode = 'favorites';
        }
        this.getQ().when(this.getService().gettingVenues(mode)).then(function (venues) {
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

    loadMarkers () {
        let context = this;
        let mode = false;
        if (this.state.current.data && this.state.current.data.favorites === true) {
            mode = 'favorites';
        }
        this.getService().gettingMarkers(mode).then(function (markers) {
            let markerItems = context.makeMarkerContent(markers);
            let overlay = context.makeMarkerOverlay(markers);
            if(context.user.lat && context.user.lng) {
                overlay.push(context.getUserMarker({lat: context.user.lat, lng: context.user.lng}));
            }
            context.markers = markerItems;
            context.markersLoaded.notify({
                items: markerItems,
                overlay: overlay,
                clickHandler: context.markerClickHandler
            });
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
        let context = this;
        categoriesEvent.subscribe(this.scope, (evt, params) => {
            this.getService().getRequestService().setPage(0);
            if (!params) {
                this.state.params.slug = null;
                this.loadObjects(false);
                this.loadMarkers();
                context.state.transitionTo('venvast.venues');
            } else {
                this.state.params.slug = params.slug;
                this.loadObjects(false);
                this.loadMarkers();
                context.state.transitionTo('venvast.venues.category', {slug: params.slug});
            }
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
            if(this.loadingTimeout) {
                this.timeoutService.cancel(this.loadingTimeout);
                this.loadingTimeout = null;
            }
            this.loadingTimeout = this.timeoutService(() => {
                this.loadMarkers();
                this.loadObjects();
            }, 1500);
        });
    }

    loadCategories () {
        let context = this;
        this.getQ().when(this.categoriesService.gettingCategories()).then(function (categories) {
            context.categories = categories;
        });
    }

    getObjectUrlByMarker (marker) {
        return '/venues/view/'+ marker.slug;
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