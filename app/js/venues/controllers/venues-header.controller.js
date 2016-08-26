import BaseHeaderController from '../../common/controllers/header/base-header.controller.js';
import VenueHeaderFiltersForm from '../forms/venue-header-filters.form.js';

class EventsHeaderController extends BaseHeaderController {

    /**
     * @param VenueRequestService
     * @param VenuesService
     * @param PlaceFilterChangedEvent
     */
    constructor (VenueRequestService, VenuesService, PlaceFilterChangedEvent) {
        super();
        this.service = VenueRequestService;
        this.modelService = VenuesService;
        this.cityChanged = PlaceFilterChangedEvent;
        this.initFilters();
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

export default EventsHeaderController;