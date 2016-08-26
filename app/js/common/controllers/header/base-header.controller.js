/**
 * @class BaseHeaderController
 *
 * Class adds basic features for taking control over header
 * of application which contains all the filters and
 * main menu.
 */
import HeaderFiltersForm from '../../forms/header-filters.form.js';
import moment from 'moment';

class BaseHeaderController {

    constructor () {
        this.authorized = true;
    }

    getFilterModel () {
        let model = {};
        model.from = moment();
        model.to = moment();
        model.city = 'Bangkok'; //TODO: get real user city
        model.text = '';
        return model;
    }

    /**
     * Initialize filters
     */
    initFilters () {
        let form = new HeaderFiltersForm({
            model: this.getFilterModel(),
            dateFrom: this.dateFromConfig(),
            dateTo: this.dateToConfig(),
            city: {
                changed: this.getCityChangedEvent()
            }
        }, this.getRequestService(), this.getModelService());
        this.form = form.getForm();
    }

    dateFromConfig () {
        return {
            left: '41%',
            top: '55px',
            dateTo: '.header .date_timepicker_end'
        };
    }

    dateToConfig () {
        return {
            left: '52%',
            top: '55px',
            dateFrom: '.header .date_timepicker_start'
        };
    }
    
    getCityChangedEvent () {
        return null;
    }

    getRequestService () {
        return null;
    }

    getModelService () {
        return null;
    }

    toggleMobileNav () {
        $('.header .nav-primary').toggleClass('in');
    }
    
    getClass (item) {
        console.log("Got item: ", window.location.href);
    }
}


export default BaseHeaderController;