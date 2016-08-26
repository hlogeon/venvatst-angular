/**
* Base class for displaying lists of main
* apps objects: events, venues, deals.
* Should take control over loading objects from server,
* converting them JS ojects.
**/

const Q = new WeakMap();
class ListController {
	

	constructor ($scope, $q, service) {
		this.setService(service);
        this.setQ($q);
		this.scope = $scope;
        this.init();
        this.loadObjects();
	}

    /**
     * Initialize all variables here in order to
     * make code more reusefull and control the execution flow
     * better
     */
    init() {

    }

	/**
	* Load all objects and convert it to JS
	**/
	loadObjects () {
		throw new Exception("ListController@loadObjects should be overwritten!");
	}

	/**
	* Change state to object
	**/
	openObject () {
		throw new Exception("ListController@openObject should be overwritten!");
	}


	/**
	* Scroll view to object
	**/
	scrollToObject () {
		//TODO: implement method
	}

	/**
	 * Set an API service instance
	 * @param {Object} service
	 */
	setService (service) {
		this.service = service;
	}

	getService () {
		return this.service;
	}

    /**
     * Set promise helper service
     * 
     * @param $q
     */
    setQ ($q) {
        Q.set(this, $q);
    }

    /**
     * Get promise helper service
     * @returns {V}
     */
    getQ () {
        return Q.get(this);
    }



	loadMarkers () {
		let context = this;
		this.getService().gettingMarkers().then(function (markers) {
			let markerItems = context.makeMarkerContent(markers);
			let overlay = context.makeMarkerOverlay(markers);
			if(context.user.lat && context.user.lng) {
				overlay.push(context.getUserMarker({lat: context.user.lat, lng: context.user.lng}));
			}
			context.markers = markerItems;
			context.markersLoaded.notify({
				items: markerItems,
				overlay: overlay,
				clickHandler: context.markerClickHandler
			});
		});
	}



	getUserMarker (position) {
		let content = "<img src='//i.stack.imgur.com/orZ4x.png' style='margin-left: -2px; margin-top: -3px;' width='22' height='22'>";
		return {
			latLng: new google.maps.LatLng(position.lat, position.lng),
			data: 'user',
			options: {
				content: content
			}
		}
	}


	makeMarkerOverlay (markersArray) {
		let markers = [];
		let context = this;
		$.each(markersArray, function(index, value) {
			let content = '<div id="' + value.id + '" class="map-popup-content-wrapper"><div class="map-popup-content"><div class="listing-window-image-wrapper">' +
				'<a href="'+ context.getObjectUrlByMarker(value) +'">' +
				'<div class="listing-window-image" style="background-image: url(' + value.image + ');"></div>' +
				'<div class="listing-window-content">' +
				'<div class="info">' +
				'<h2>' + value.title + '</h2>' +
				'<h3>' + value.category + '</h3>' +
				'</div>' +
				'</div>' +
				'</a>' +
				'</div></div><i class="fa fa-close close"></i></div>';

			markers.push({
				latLng: new google.maps.LatLng(value.center[0], value.center[1]),
				data: value.id,
				options: {
					content: content
				}
			});

		});
		return markers;
	}


	makeMarkerContent (markersArray) {
		let markers = [];
		$.each(markersArray, function(index, value) {
			markers.push({
				latLng: new google.maps.LatLng(value.center[0], value.center[1]),
				options: {
					content: {
						id: value.id
					},
					icon: {
						url: value.icon,
						scaledSize: new google.maps.Size(32, 32),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(0, 0)
					}
				}
			});

		});
		return markers;
	}


	markerClickHandler (marker, event, context) {
		$('.map-popup-content-wrapper').css('display', 'none');
		let elementID = marker.content.id;
		let element = $('#' + elementID);
		$('.close', '#'+elementID).click(function() {
			element.css('display', 'none');
		});

		if (!element.is(':hidden')) {
			element.css('display', 'none');
		} else {
			element.css('display', 'block');
		}
	}


}

export default ListController;