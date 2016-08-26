/**
 * Input for DateFrom. Depends on DateTo and changes min/max dates
 *
 */
import DateInput from './date-input.element.js';
import moment from 'moment';

class DateFromInput extends DateInput {

    constructor ($scope) {
        super($scope);
        this.name = 'date-from';
        console.log("Model: ", this);
    }
    
    link (scope, element, attributes) {
        let context = this;
        let event = scope.to.event;
        $('input', element).val(scope.model.format('YYYY.D.M'));
        $(element).datetimepicker({
            theme: 'dark',
            timepicker: false,
            format: "Y.d.m",
            startDate: scope.model.toDate(),
            minDate: moment().toDate(),
            maxDate: false,
            onGenerate: function () {
                if (scope.to.fixPosition) {
                    $('.xdsoft_datetimepicker').css({
                        left: scope.to.left, top: scope.to.top
                    });
                }
                if(event) {
                    event.subscribe(scope, (evt, params) => {
                        $('input', element).val(moment(params).format('YYYY.D.M'));
                        this.setOptions({
                            value: params
                        });
                    });
                }
            },
            onSelectDate: function (value) {
                $('input', element).val(moment(value).format('YYYY.D.M'));
                this.setOptions({
                    value: value,
                    startDate: value
                });
                event.notify(value);
            },
            onShow: function () {
                if(scope.to.dateTo) {
                    let dateTo = $(scope.to.dateTo).first();
                    let maxDate = dateTo.val() ? moment(dateTo.val(), "YYYY.D.M").toDate() : false;
                    console.log(maxDate);
                    this.setOptions({
                        maxDate: maxDate
                    });
                }
            }
        });
    }

}
export default DateFromInput;