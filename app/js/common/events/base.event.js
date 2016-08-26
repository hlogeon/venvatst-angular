
const ROOT_SCOPE = new WeakMap;

class BaseEvent {


    constructor ($rootScope) {
        ROOT_SCOPE.set(this, $rootScope);
    }


    subscribe (scope, callback) {
        let handler = ROOT_SCOPE.get(this).$on(this.getEventName(), callback);
        scope.$on('$destroy', handler);
    }

    notify (params) {
        ROOT_SCOPE.get(this).$emit(this.getEventName(), params);
    }


    getEventName () {
        throw "Event name is not specified";
    }

    static factory ($rootScope) {
        return new BaseEvent($rootScope);
    }
}

export default BaseEvent;