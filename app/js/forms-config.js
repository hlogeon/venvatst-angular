/**
 * Created by hlogeon on 8/11/16.
 *
 *
 * Register forms, elements and wrapper in application
 *
 */
import DateInput from './common/forms/elements/date-input.element.js';
import DateFromInput from './common/forms/elements/date-from-input.element.js';
import DateToInput from './common/forms/elements/date-to-input.element.js';
import HeaderFilterWrapper from './common/forms/wrappers/header-filter.wrapper.js';
import CityAutocomplete from './common/forms/elements/city-autocomplete.element.js';
import TextSearchTypehead from './common/forms/elements/text-search-typehead.element.js';


/**
 * Load elements and wrappers
 * Just calls the functions where elements and wrappers registering
 * @param formlyConfigProvider
 */
let formsConfig = function (formlyConfigProvider) {
    "use strict";

    elements(formlyConfigProvider);
    wrappers(formlyConfigProvider);
};

/**
 * Register form elements(AKA types)
 *
 * @param formlyConfigProvider
 */
let elements = function (formlyConfigProvider) {
    "use strict";

    formlyConfigProvider.setType(new DateInput());
    formlyConfigProvider.setType(new DateFromInput());
    formlyConfigProvider.setType(new DateToInput());
    formlyConfigProvider.setType(new CityAutocomplete());
    formlyConfigProvider.setType(new TextSearchTypehead());

};

/**
 * Register element wrappers
 *
 * @param formlyConfigProvider
 */
let wrappers = function (formlyConfigProvider) {
    "use strict";

    formlyConfigProvider.setWrapper(new HeaderFilterWrapper());
};



formsConfig.$inject = ['formlyConfigProvider'];

export default formsConfig;