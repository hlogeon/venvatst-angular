import moment from 'moment';

class EventsCreateController {


    constructor() {
        this.initModel();
        this.initDateFrom();
        this.initDateTo();
    }



    initModel(model) {
        this.model = {

            title: null,
            category: null,
            starts_at: moment().add(6, 'h').format('YYYY.DD.MM H:mm'),
            ends_at: moment().add(9, 'h').format('YYYY.DD.MM H:mm'),
            description: null,

            venue: null,
            phone: null,
            email: null,
            website: null,
            free_entry: true,
            entry_options: [],
            agree_conditions: true,
            images: []
        }
    }



    initDateFrom () {
        let model = this.model.starts_at;
        let end = this.model.ends_at;
        $('.date_timepicker_start').datetimepicker({
            timepicker: true,
            format: "Y.d.m H:i",
            value: model,
            minDate: moment().toDate(),
            startDate: model,
            maxDate: false,
            defaultSelect: false,
            onShow: function (ct) {
                console.log("");
                this.setOptions({
                    maxDate: end ? end : false
                });
            },
            onSelectDate: function(ct) {
                model = moment(ct).format('YYYY.DD.MM H:mm');
            }
        });
    }

    initDateTo () {
        let model = this.model.ends_at;
        let start = this.model.starts_at;
        $('.date_timepicker_end').datetimepicker({
            timepicker: true,
            format: "Y.d.m H:i",
            value: model,
            minDate: moment().toDate(),
            startDate: model,
            maxDate: false,
            defaultSelect: false,
            onShow: function (ct) {
                this.setOptions({
                    minDate: start ? start : false
                });
            },
            onSelectDate: function(ct) {
                model = moment(ct).format('YYYY.DD.MM H:mm');
            }
        });
    }

}


export default EventsCreateController;