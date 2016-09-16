
import Event from '../models/event.js';
import moment from 'moment';

const Q = new WeakMap();
const SERVICE = new WeakMap();


class EventForm {

	constructor(EventCategoriesService, EventsService, UserService, Notification, VenuesService, $stateParams, $rootScope, $state, $q) {
		Q.set(this, $q);
		SERVICE.set(this, EventsService);

		this.service = EventsService;
		this.vneuesService = VenuesService;
		this.categoriesService = EventCategoriesService;
		this.UserService = UserService;
		this.notificationService = Notification;
		this.params = $stateParams;
		this.rootScope = $rootScope;
		this.state = $state;

		this.restrict = 'EA';
        this.replace = true;
        this.templateUrl = 'templates/events/directives/form.html';
        this.scope = {
        };
	}

	submit(draft) {
		let event = this.model;
        event.submitting = true;
		let context = this;
		event.starts_at = moment(event.starts_at, "YYYY.DD.MM H:mm").format("DD.MM.YYYY H:mm");
		event.ends_at = moment(event.ends_at, "YYYY.DD.MM H:mm").format("DD.MM.YYYY H:mm");

		for (var i = 0; i < event.images.length; i++) {
            if (typeof event.images[i] === 'string') {
                continue;
            } else {
                let img = $('#'+event.images[i].id).cropit('export');
                if(!img) {
                    event.images.splice(i, 1);
                    continue;
                }
                event.images[i] = img;
            }
        }
        if(draft === true) {
            event.draft = draft;
        }


		if(!this.UserService.authenticated) {
    
            this.service.addUnsentEvent(event);
            this.notifyNeedsLogin();
            this.UserService.goLogin();
            return;
        }

        this.service.submit(event).then(function (response) {
            event.submitting = false;
            if(response.success === false) {
                context.errors = response.errors;
                window.scrollTo(0, 0);
            } else {
                if(draft === true) {
                    context.notifySuccessDraft(response.event.name);
                    context.state.go('venvast.events.drafts');
                } else {
                    context.notifySuccessCreate(response.event.name);
                    context.state.go('venvast.events.organize');
                }
            }
        });
		console.log(event);
	}







	link(scope, element) {
		let context = this;
		scope.createVenue = false;
		this.scope = scope;
		scope.submit = this.submit;

		scope.event = this.initModel();
		scope.addEntryOption = this.addEntryOption;
		scope.addEntryDesc = this.addEntryDesc;
		scope.deleteExistingImage = this.deleteExistingImage;
        scope.selectImage = this.selectImage;
        scope.deleteImage = this.deleteImage;
        scope.addImage = this.addImage;
        scope.getZoom = this.getZoom;
        scope.notificationService = this.notificationService;
        scope.notifyNeedsLogin = this.notifyNeedsLogin;
        scope.notifySuccessDraft = this.notifySuccessDraft;
        scope.notifySuccessCreate = this.notifySuccessCreate;
        scope.state = this.state;
        scope.UserService = this.UserService;
        scope.service = SERVICE.get(this);
	}


	addEntryOption () {
		this.model.entry_options.push({
			title: null,
			fee: 0,
			description: false
		});
	}

	addEntryDesc($index) {
		this.model.entry_options[$index].description = '';
	}


	initModel() {
        let context = this;
        if (this.params.slug) {
            this.initExistingModel();
        } else {
            this.initEmptyModel();
        }
        context.scope.dayAliases = [
            'Sun', 'Mon', 'Tue',
            'Wed', 'Thu', 'Fri',
            'Sat'
        ];
    }

	initExistingModel() {
        let context = this;
        SERVICE.get(this).gettingEditable(this.params.slug).then(function (response) {
            context.scope.model = response;
            let model = context.scope.model;
            model.submitting = false;
            if (response.venue) {
                $('#venue-search').val(response.venue.name);
                model.venue = model.venue.id;
            }
            context.categoriesService.gettingCategories().then((categories) => {
                context.initImageCropper(context.scope.model);
                context.addExistingImages(context.scope.model);
                context.initDateFrom();
                context.initDateTo();
                context.scope.categories = categories;
                context.initTypeAhed()
            });
        });
	}

	initEmptyModel () {
        let context = this;
        this.scope.model = {
            name: null,
            categories: [],
            starts_at: moment().add(6, 'h').format('YYYY.DD.MM H:mm'),
            ends_at: moment().add(9, 'h').format('YYYY.DD.MM H:mm'),
            description: null,
            venue: true,
            phone: null,
            email: null,
            submitting: false,
            website: null,
            free_entry: true,
            entry_options: [],
            locale: 'en',
            agree_conditions: false,
            images: []
        }
        context.categoriesService.gettingCategories().then((categories) => {
                context.initImageCropper(context.scope.model);
                context.addExistingImages(context.scope.model);
                context.initDateFrom();
                context.initDateTo();
                context.scope.categories = categories;
                context.initTypeAhed();
        });
    }


    initDateFrom () {
        let model = this.scope.model.starts_at;
        let end = this.scope.model.ends_at;
        $('#date_start').datetimepicker({
            timepicker: true,
            format: "Y.d.m H:i",
            value: model,
            minDate: moment().toDate(),
            defaultSelect: false,
            onShow: function (ct) {
                // this.setOptions({
                //     maxDate: end ? end : false
                // });
            },
            onSelectDate: function(ct) {
                model = moment(ct).format('YYYY.DD.MM H:mm');
            }
        });
    }

    initDateTo () {
        let model = this.scope.model.ends_at;
        let start = this.scope.model.starts_at;
        $('#date_end').datetimepicker({
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




    initTypeAhed() {
    	let input = $('#venue-search');
    	let context = this;
    	console.log("INited typeahead for element: ", input);
    	$(input).typeahead({
            source: function(query, process) {
                context.vneuesService.typeAheadRequest('mode', query).then(function(data) {
                	console.log("Got data");
                    return process(data);
                });

            },
            select: function () {
                var val = this.$menu.find('.active').data('value');
                this.$element.data('active', val);
                if(this.autoSelect || val) {
                    var newVal = this.updater(val);

                    if (!newVal) {
                        newVal = "";
                    }

                    this.$element
                        .val(newVal.name)
                        .change();
                    this.afterSelect(newVal);
                }
                return this.hide();
            },
            afterSelect: function (element) {
                context.scope.model.venue = element.id;
            },
            displayText: function(item) {
                return '<div class="typeahead_wrapper">' +
                '<div class="typeahead_content">' + item.name + '</div> <div class="typeahead_addon"><span>' + item.category + '</span></div></div>'; //<div class="typeahead_image"><img src="' + item.image + '"></div>
            },
            highlighter: function(item) {
                return unescape(item);
            },
            minLength: 3,
            maxItem: 5,
            autoSelect: true
        });
    }



      addImage(model) {
        var finalWidth  = 900;
        var finalHeight = 300;
        let length = model.images.length;
        let image = {id: 'image-'+ length};
        let context = this;
        model.images.push(image);
        setTimeout(function(image) {
            $('#'+image.id).cropit({
                exportZoom: context.getZoom(finalHeight, finalWidth, '#'+image.id)
            });
        }, 1000, image);
    }

    initImageCropper(model) {
        if(model.images.length === 0) {
            this.addImage(model);
        }
    }

    addExistingImages (model) {
        this.scope.existingImages = model.images.slice();
    }

    deleteExistingImage (index) {
        this.$parent.existingImages.splice(index, 1);
    }

    getZoom(finalHeight, finalWidth, selectContext) {
        let sizeRatio = finalHeight / finalWidth;
        let newWidth = $('.cropit-preview').width();
        let newHeight = newWidth * sizeRatio;
        return finalWidth / newWidth;
    }


    selectImage(image) {
        $('.cropit-image-input', '#'+image.id).click();
    }

    deleteImage(image) {
        if (this.model.images.length > 1) {
            for (var i = 0; i < this.model.images.length; i++) {
                let img = this.model.images[i];
                if(img.id === image.id) {
                    this.model.images.splice(i, 1);
                }
            }
        }
        $('.cropit-preview-image', '#'+image.id).attr('src', '');
    }


    notifySuccessCreate(name) {
        this.notificationService.success({title: "Event saved", message: "New event <b>" + name + "</b> successfully created! You can now check it at <b>organizer panel<b> <br/>Menu -> Events -> Organize", delay: 10000});
    }

    notifySuccessDraft(name) {
        this.notificationService.primary({title: "Draft saved", message: "New draft of event <b>" + name + "</b> successfully saved! You can find it at <b>organizer panel<b> <br/>Menu -> Events -> Drafts", delay: 10000});
    }

    notifyNeedsLogin() {
        this.notificationService.warning({title: "Success, but you have to login first!", message: "You are almost done but to be sure that you are not a robot, login to your account please. <b>Don't worry you will not loose your data!</b> <br/>You'll be redirected to the login page in a moment.", delay: 10000});
    }




	static directiveFactory(CategoriesService, EventsService, UserService, Notification, VenuesService, $stateParams, $rootScope, $state, $q) {
        EventForm.instance = new EventForm(CategoriesService, EventsService, UserService, Notification, VenuesService,  $stateParams, $rootScope, $state, $q);
        return EventForm.instance;
    }

}

EventForm.$inject = ['CategoriesService', 'EventsService', 'UserService', 'Notification', 'VenuesService', '$stateParams', '$rootScope', '$state', '$q'];

export default EventForm;