
import ListController from '../../common/controllers/list.controller.js';
import VenuesService from '../services/venues.service.js';

class DraftsListController extends ListController {

	constructor ($stateParams, $state, $timeout, $scope, $q, service, VenuesCategoriesService, PlaceFilterChangedEvent, CategoryChangedEvent, UserService) {
        super($scope, $q, service);
        this.stateParams = $stateParams;
        this.timeoutService = $timeout;
        this.isDraft = $state.current.data.drafts;
        if(this.isDraft) {
            this.subtitle = 'Manage drafts of venues';
        } else {
            this.subtitle = 'Manage venues';
        }
        this.loadingTimeout = null;
        this.state = $state;
        this.categoriesService = VenuesCategoriesService;
        this.categoryChanged = CategoryChangedEvent;
        this.categories = [];
        this.loadCategories();
        this.listenCity(PlaceFilterChangedEvent);
        this.listenCategories(CategoryChangedEvent);
        this.init();
        this.loadObjects();
    }

    
    
    init() {
        this.venues = [];
        this.getService().getRequestService().setPage(0);
        this.hasMorePages = true;
        this.pages = 0;
        this.user = {};
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
        this.getQ().when(this.getService().gettingVenues(endPoint)).then(function (venues) {
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
                context.state.transitionTo('venvast.venues');
            } else {
                this.state.params.slug = params.slug;
                this.loadObjects(false);
                context.state.transitionTo('venvast.venues.category', {slug: params.slug});
            }
        });
    }

    loadCategories () {
        let context = this;
        this.getQ().when(this.categoriesService.gettingCategories()).then(function (categories) {
            context.categories = categories;
        });
    }

}

export default DraftsListController;