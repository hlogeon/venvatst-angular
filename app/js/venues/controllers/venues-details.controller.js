import DetailsController from '../../common/controllers/details.controller.js';

const Q = new WeakMap();


class VenuesDetailsController extends DetailsController {

	favor(venue) {
		this.service.favor(venue.slug);
	}

	postInit () {
		this.dayIndex = new Date().getDay();
	}
    
}

export default VenuesDetailsController;