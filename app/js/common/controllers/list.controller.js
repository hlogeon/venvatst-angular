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


}

export default ListController;