/**
 * Created by hlogeon on 8/11/16.
 * 
 * Form element for dates which is interacting with controller
 * on changing date
 */
import FormDate from './form-date.directive.js';

class FormDateStart extends FormDate {

    getRelatedDateFromService () {
        return this.getObjectService().getRequestService().getDateFrom();
    }

    setRelatedDateToService (date) {
        this.getObjectService().getRequestService().setDateFrom(date);
    }

    static directiveFactory ($q, objectRequestService) {
        FormDateStart.instance = new FormDateStart($q, objectRequestService);
        return FormDateStart.instance;
    }

}

export default FormDateStart;