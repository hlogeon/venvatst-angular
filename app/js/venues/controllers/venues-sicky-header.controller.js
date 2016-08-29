
import StickyHeaderController from '../../common/controllers/header/sticky-header.controller.js';
import VenueHeaderFiltersForm from '../forms/venue-header-filters.form.js';

class VenuesStickyHeaderController extends StickyHeaderController {

    /**
     * 
     * @param {VenueRequestService} EventRequestService
     * @param {VenuesService} EventsService
     * @param PlaceFilterChangedEvent
     */
    constructor (EventRequestService, EventsService, PlaceFilterChangedEvent) {
        super();
        this.service = EventRequestService;
        this.modelService = EventsService;
        this.cityChanged = PlaceFilterChangedEvent;
        this.initFilters();
        this.venuesState = true;
    }


    /**
     * Initialize filters
     */
    initFilters () {
        let form = new VenueHeaderFiltersForm({
            model: this.getFilterModel(),
            city: {
                changed: this.getCityChangedEvent()
            }
        }, this.getRequestService(), this.getModelService());
        this.form = form.getForm();
    }

    getFilterModel () {
        let model = {};
        model.city = 'Bangkok'; //TODO: get real user city
        model.text = '';
        return model;
    }

    dateToConfig () {
        let config = super.dateToConfig();
        config.changeEvent = this.dateToChanged;
        return config;
    }

    dateFromConfig() {
        let config = super.dateFromConfig();
        config.changeEvent = this.dateFromChanged;
        return config;
    }

    getCityChangedEvent () {
        return this.cityChanged;
    }

    getRequestService () {
        return this.service;
    }

    getModelService () {
        return this.modelService;
    }
}

export default VenuesStickyHeaderController;