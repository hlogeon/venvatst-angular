import BaseHeaderController from '../../common/controllers/header/base-header.controller.js';

class EventsHeaderController extends BaseHeaderController {

    /**
     * @param EventRequestService
     * @param EventsService
     * @param DateFromChangedEvent
     * @param DateToChangedEvent
     * @param PlaceFilterChangedEvent
     */
    constructor (EventRequestService, EventsService, DateFromChangedEvent, DateToChangedEvent, PlaceFilterChangedEvent) {
        super();
        this.service = EventRequestService;
        this.modelService = EventsService;
        this.dateFromChanged = DateFromChangedEvent;
        this.dateToChanged = DateToChangedEvent;
        this.cityChanged = PlaceFilterChangedEvent;
        this.initFilters();
    }


    getFilterModel () {
        let model = {};
        model.from = this.service.getDateFrom();
        model.to = this.service.getDateTo();
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

export default EventsHeaderController;