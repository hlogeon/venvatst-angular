import BaseEvent from '../../common/events/base.event.js';


class LoginEvent extends BaseEvent {

    getEventName () {
        return 'user-login-event';
    }


    static factory ($rootScope) {
        return new LoginEvent($rootScope);
    }
    
}

export default LoginEvent;