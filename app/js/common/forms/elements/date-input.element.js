/**
 * Created by hlogeon on 8/11/16.
 */
import moment from 'moment';

class DateInput {

    constructor ($scope) {
        this.name = 'date';
        this.templateUrl = 'templates/common/forms/elements/date.element.html';
    }

    link (scope, element, attributes) {
        let context = this;
        $(element).datetimepicker({
            theme: 'dark',
            timepicker: false,
            format: "Y.d.m",
            startDate: scope.model,
            onGenerate: () => {
                if(scope.to.fixPosition){
                    $('.xdsoft_datetimepicker').css({
                        left: scope.to.left, top: scope.to.top
                    });
                }
            },
            onSelectDate: (value) => {
                $('input', element).val(moment(value).format('YYYY.D.M'));
            }
        });
    }

}
DateInput.$inject = ['$scope'];
export default DateInput;