
/**
 * Created by hlogeon on 8/11/16.
 *
 *
 * Google autocomplete for city filter
 *
 */
class CityAutocomplete {
 
    constructor () {
        this.name = 'city-autocomplete';
        this.templateUrl = 'templates/common/forms/elements/city-autocomplete.element.html';
    }


    link (scope, element, attributes) {
        let options = {
            types: ['(cities)']
        };
        let input = $('input', element)[0];
        let autocomplete = new google.maps.places.Autocomplete(input, options);
        if(scope.to.changed) {
            let event = scope.to.changed;
            event.subscribe(scope, function (evt, params) {
                $(input).val(params.val);
            });
        }
        autocomplete.addListener('place_changed', () => {
            let place = autocomplete.getPlace();
            let inputVal = $(input).val();
            if(scope.to.changed) {
                let event = scope.to.changed;
                event.notify({
                    place: place,
                    val: inputVal
                });
            }
        });
    }

    controller ($scope) {

    }

}

CityAutocomplete.$inject = ['$scope'];
export default CityAutocomplete;