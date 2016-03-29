class CountStore {
  constructor () {
    this.init();
  }

  init () {
    this.count = 0;
  }

  increment () {
    this.count++;
  }
}
CountStore.$inject = [];

angular.module('myApp.view-one')
  .service('CountStore', CountStore);
