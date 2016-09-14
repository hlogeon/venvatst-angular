import BaseEvent from '../../common/events/base.event.js';


class RegisterEvent extends BaseEvent {

    getEventName () {
        return 'user-register-event';
    }


    static factory ($rootScope) {
        return new RegisterEvent($rootScope);
    }
    
}

export default RegisterEvent;