(ng => {
  'use strict';

  class EventStore {
    constructor () {
      this.init();
    }
    init () {
      this.resetStore();
    }
    resetStore () {
      this.event = {};
      this.states = {
        start: false,
        location: false,
        time: false
      };
    }
    setState (state) {
      this.states[state] = true;
    }

  }
  EventStore.$inject = [];

  ng.module('myApp.view-one')
    .service('EventStore', EventStore);
})(angular);
