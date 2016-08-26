const PLACEHOLDER_DATE_FROM = 'From';
const PLACEHOLDER_DATE_TO = 'To';
const PLACEHOLDER_TEXT_SEARCH = 'Search by title';

const REQUEST_SERVICE = new WeakMap(); //We use this to update search params on the fly
const MODEL_SERVICE = new WeakMap(); //We use this to request models (for typeahead)

/**
 * Configurable form for creating header filters
 * 
 */
class HeaderFiltersForm {

    /**
     *
     * @param {{
     * model: {},
     * cityPlaceholder: string,
     * textPlaceholder: string,
     * dateFromPlaceholder: string
     * dateToPlaceholder: string,
     * dateFrom: {
     *          left: string,
     *          top: string
     *      },
     * dateTo: {
     *          left: string,
     *          top: string
     *      }
     *
     * }} options
     * @param {BaseApiService} requestService
     */
    constructor (options, requestService, modelService) {
        this.validateOptions(options);
        this.options = options;
        this.form = {};
        this.form.formData = {};
        REQUEST_SERVICE.set(this, requestService);
        MODEL_SERVICE.set(this, modelService);
        this.form.formFields = this.getFormFields();
    }

    getRequestService () {
        return REQUEST_SERVICE.get(this);
    }

    getModelService () {
        return MODEL_SERVICE.get(this);
    }


    /**
     * Get an array of fields for this form
     * You have to override this method in order ot add or remove
     * fields to this form to use it in different contexts
     *
     * @returns {*[]}
     */
    getFormFields () {
        return [
            this.getCityAutocomplete(),
            this.getTextTypehead(),
            this.getDateFrom(),
            this.getDateTo()
        ];
    }
    
    
    /**
     * Get field with google autocomplete for cities
     *
     * @returns {{
     * key: string,
     * type: string,
     * wrapper: string,
     * noFormControl: boolean,
     * model: (*|Date|{}),
     * templateOptions: {
     *      placeholder: (*|string)
     *      }
     * }}
     */
    getCityAutocomplete () {
        let context = this;
        return {
            key: 'city',
            type: 'city-autocomplete',
            wrapper: 'headerFilter',
            noFormControl: true,
            model: context.getModel(),
            templateOptions: {
                placeholder: context.getCityPlaceholder(),
                changed: this.options.city.changed,
                requestService: context.getRequestService()
            }
        };
    }

    /**
     * Get text search field
     *
     * @returns {{
     * key: string,
     * type: string,
     * noFormControl: boolean,
     * wrapper: string,
     * model: (*|Date|{}),
     * templateOptions: {
     *      placeholder: (*|string)
     *      }
     * }}
     */
    getTextTypehead () {
        let context = this;
        return {
            key: 'text',
            type: 'text-search-typehead',
            noFormControl: true,
            wrapper: 'headerFilter',
            model: context.getModel(),
            templateOptions: {
                placeholder: context.getTextPlaceholder(),
                service: context.getRequestService(),
                modelService: context.getModelService()
            }
        };
    }

    /**
     * Get dateFrom field
     * @returns {{
     * key: string,
     * type: string,
     * noFormControl: boolean,
     * wrapper: string,
     * model: (*|Date),
     * templateOptions: {
     *      class: string,
     *      placeholder: (*|string),
     *      left: string,
     *      top: string
     *      }
     * }}
     */
    getDateFrom () {
        let context = this;
        return {
            key: 'from',
            type: 'date-from',
            noFormControl: true,
            wrapper: 'headerFilter',
            model: context.getModel().from,
            templateOptions: context.dateFromTo()
        }
    }

    /**
     * Get dateTo field
     * @returns {{
     * key: string,
     * type: string,
     * noFormControl: boolean,
     * wrapper: string,
     * model: (*|Date),
     * templateOptions: {
     *      class: string,
     *      placeholder: (*|string),
     *      left: string,
     *      top: string
     *      }
     * }}
     */
    getDateTo () {
        let context = this;
        return {
            key: 'to',
            type: 'date-to',
            noFormControl: true,
            wrapper: 'headerFilter',
            model: context.getModel().to,
            templateOptions: context.dateToTo()
        }
    }
    

    /**
     * Get placeholder for city search field
     * @returns {*|string}
     */
    getCityPlaceholder () {
        return this.options.cityPlaceholder || "Bangkok"; //get real city name
    }

    /**
     * Get placeholder for text search field
     *
     * @returns {*|string}
     */
    getTextPlaceholder () {
        return this.options.textPlaceholder || PLACEHOLDER_TEXT_SEARCH;
    }

    /**
     * Get placeholder for date field FROM
     * @returns {*|string}
     */
    getDateFromPlaceholder () {
        return this.options.dateFromPlaceholder || PLACEHOLDER_DATE_FROM;
    }

    /**
     * Get placeholder for date field TO
     *
     * @returns {*|string}
     */
    getDateToPlaceholder () {
        return this.options.dateToPlaceholder || PLACEHOLDER_DATE_TO;
    }


    dateFromFixPos () {
        if(!this.options.dateFrom) {
            return false;
        }
        return this.options.dateFrom.left || this.option.dateFrom.top;
    }

    dateToFixPos () {
        if(!this.options.dateTo) {
            return false;
        }
        return this.options.dateTo.left || this.option.dateTo.top;
    }

    /**
     * Make dateFrom Template Options (TO)
     * @returns {{class: string, placeholder: (*|string)}}
     */
    dateFromTo () {
        let context = this;
        let to = {
            class: 'date_timepicker_start form-control',
            placeholder: context.getDateFromPlaceholder(),
            fixPosition: context.dateFromFixPos()
        };
        if(context.dateFromFixPos() && this.options.dateFrom && this.options.dateFrom.left) {
            to.left = this.options.dateFrom.left;
        }
        if(context.dateFromFixPos() && this.options.dateFrom && this.options.dateFrom.top) {
            to.top = this.options.dateFrom.top;
        }
        if(this.options.dateFrom && this.options.dateFrom.dateTo) {
            to.dateTo = this.options.dateFrom.dateTo;
        }
        if(this.options.dateFrom.changeEvent && typeof this.options.dateFrom.changeEvent !== 'undefined') {
            to.event = this.options.dateFrom.changeEvent;
        }
        return to;
    }

    /**
     * Make dateTo Template Options (TO)
     * @returns {{class: string, placeholder: (*|string)}}
     */
    dateToTo () {
        let context = this;
        let to = {
            class: 'date_timepicker_end form-control',
            placeholder: context.getDateToPlaceholder(),
            fixPosition: context.dateToFixPos()
        };
        if(context.dateToFixPos() && this.options.dateTo && this.options.dateTo.left) {
            to.left = this.options.dateTo.left;
        }
        if(context.dateToFixPos() && this.options.dateTo && this.options.dateTo.top) {
            to.top = this.options.dateTo.top;
        }
        if(this.options.dateTo && this.options.dateTo.dateFrom) {
            to.dateFrom = this.options.dateTo.dateFrom;
        }
        if(this.options.dateTo.changeEvent && typeof this.options.dateTo.changeEvent !== 'undefined') {
            to.event = this.options.dateTo.changeEvent;
        }
        return to;
    }

    /**
     * Validate form options
     *
     * @param options
     * @returns {boolean}
     */
    validateOptions (options) {
        if(typeof options !== 'object') {
            throw "Options required for this form!";
        }
        if(!options.model || typeof options.model === 'undefined') {
            throw "You should specify model in order to create this form";
        }
        return true;
    }

    /**
     * Returns form object to use in
     * controller
     * @returns {{}|*}
     */
    getForm () {
        return this.form;
    }

    /**
     * Get model
     *
     * @returns {*|Date|{}}
     */
    getModel () {
        return this.options.model; //init new model???
    }

    /**
     * Set model for the form
     *
     * @param model
     */
    setModel (model) {
        this.options.model = model;
    }
}

export default HeaderFiltersForm;