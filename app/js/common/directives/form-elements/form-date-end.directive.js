/**
 * Created by hlogeon on 8/11/16.
 */
import FormDate from './form-date.directive.js';

class FormDateEnd extends FormDate {

    getRelatedDateFromService () {
        return this.getObjectService().getRequestService().getDateTo();
    }

    setRelatedDateToService (date) {
        this.getObjectService().getRequestService().setDateTo(date);
    }

    static directiveFactory ($q, objectRequestService) {
        FormDateEnd.instance = new FormDateEnd($q, objectRequestService);
        return FormDateEnd.instance;
    }
}

export default FormDateEnd;