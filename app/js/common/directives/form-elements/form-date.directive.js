/**
 * Created by hlogeon on 8/11/16.
 *
 * Base directive for date inputs!
 * Adds jquery.datetimepicker to element
 *
 * Define basic services we need for this input
 *
 */
const OBJECT_SERVICE = new WeakMap();
import moment from 'moment';
import BaseApiService from '../../services/base-api.service.js';

class FormDate {

    /**
     * @param {BaseApiService} objectService
     */
    constructor (objectService) {
        this.restrict = 'EA';
        this.replace = true;
        this.transclude = false;
        this.scope = {
            updateFunction: "&updateFunction"
        };
        this.initDate();
        OBJECT_SERVICE.set(this, objectService);
    }

    link (scope, element) {
        scope.$watch('date', () => {
            if(typeof this.scope.updateFunction === 'function') {
                this.scope.updateFunction(this.scope.date);
            }
        });
    }

    /**
     * Returns request service
     * @returns {BaseApiService}
     */
    getObjectService () {
        return OBJECT_SERVICE.get(this);
    }

    /**
     * Set the minimal available date to input
     * @param date
     */
    setStartDate (date) {
        this.scope.startDate = date;
    }

    /**
     * Set the date to form input
     *
     * @param date
     */
    setDate (date) {
        this.scope.date = date;
    }
    
    getRelatedDateFromService () {
        throw "getRelatedDateFromService method is undefined";
    }
    
    setRelatedDateToService (date) {
        throw "setRelatedDateToService method is undefined";
    }

    /**
     * Initialize the date
     * Set default from the service if exists there
     */
    initDate () {
        let relatedDate = this.getRelatedDateFromService();
        if(relatedDate) {
            this.scope.date = this.getRelatedDateFromService();
        } else {
            relatedDate = moment();
            this.setRelatedDateToService(relatedDate);
            this.scope.date = relatedDate;
        }
    }

    /**
     * @param {BaseApiService} objectService
     * @returns {FormDate}
     */
    static directiveFactory (objectService) {
        FormDate.instance = new FormDate(objectService);
        return FormDate.instance;
    }
}

export default FormDate;