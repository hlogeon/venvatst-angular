/**
 * Created by hlogeon on 8/9/16.
 *
 * EventsListController takes control over displaying
 * list of events and all events map
 */

import ListController from '../../common/controllers/list.controller.js';
import EventsService from '../services/events.service.js';

class OrganizerListController extends ListController {


    constructor ($scope, $state, $stateParams, $q, $timeout, service, CategoriesService, DateFromChangedEvent, DateToChangedEvent, PlaceFilterChangedEvent, CategoryChangedEvent, MarkersLoadedEvent, UserService, GotLocationEvent) {
        super($scope, $q, service);
        this.state = $state;
        this.timeout = $timeout;
        this.stateParams = $stateParams;
        this.isDraft = $state.current.data.drafts;
        UserService.gettingLocation();
        this.categoriesService = CategoriesService;
        this.categoryChanged = CategoryChangedEvent;
        this.categories = [];
        this.init();
        this.loadCategories();
        this.listenDateTo(DateToChangedEvent);
        this.listenDateFrom(DateFromChangedEvent);
        this.listenCity(PlaceFilterChangedEvent);
        this.listenLocation(GotLocationEvent);
        this.listenCategories(CategoryChangedEvent);
        this.init();
    }

    
    
    init() {
        this.events = [];
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
        let endPoint = 'organizer';
        if (this.isDraft) {
            endPoint = 'drafts';
        }
        this.getQ().when(this.getService().gettingEvents(endPoint)).then(function (events) {
            context.loading = false;
            context.hasMorePages = context.getService().getRequestService().hasNextPage();
            if(pushNew) {
                events.forEach((event) => {context.events.push(event)});
            } else {
                context.events = events;
            }
        });
    }
    
    listenDateFrom (dateFrom) {
        dateFrom.subscribe(this.scope, (evt, params) => {
            this.getService().getRequestService().setPage(0);
            this.getService().getRequestService().setDateFrom(params);
            this.loadObjects(false);
        })
    }

    listenDateTo (dateTo) {
        dateTo.subscribe(this.scope, (evt, params) => {
            this.getService().getRequestService().setPage(0);
            this.getService().getRequestService().setDateTo(params);
            this.loadObjects(false);
        });
    }

    listenCity (city) {
        city.subscribe(this.scope, (evt, params) => {
            this.getService().getRequestService().setPage(0);
            this.getService().getRequestService().setLocation(params.place.geometry.location.lat(), params.place.geometry.location.lng());
            this.lat = params.place.geometry.location.lat();
            this.lng = params.place.geometry.location.lng();
            this.loadObjects(false);
        });
    }
    
    listenCategories (categoriesEvent) {
        let context = this;
        categoriesEvent.subscribe(this.scope, (evt, params) => {
            this.getService().getRequestService().setPage(0);
            if (!params) {
                this.state.params.slug = null;
                this.loadObjects(false);
                context.state.transitionTo('venvast.events');
            } else {
                this.state.params.slug = params.slug;
                this.loadObjects(false);
                context.state.transitionTo('venvast.events.category', {slug: params.slug});
            }
        });
    }

    listenLocation (gotLocationEvent) {
        gotLocationEvent.subscribe(this.scope, (evt, params) => {
            this.user.lat = params.lat;
            this.user.lng = params.lng;
            this.lat = params.lat;
            this.lng = params.lng;
            this.loadObjects(false);
        });
    }

    loadCategories () {
        let context = this;
        this.getQ().when(this.categoriesService.gettingCategories()).then(function (categories) {
            context.categories = categories;
        });
    }
    
}
export default OrganizerListController;