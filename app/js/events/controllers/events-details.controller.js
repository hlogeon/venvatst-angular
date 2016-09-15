import DetailsController from '../../common/controllers/details.controller.js';

const Q = new WeakMap();


class EventsDetailsController extends DetailsController {
	
	favor(event) {
		this.service.favor(event.slug);
	}

	going(event) {
		this.service.going(event.slug);
	}

}

export default EventsDetailsController;