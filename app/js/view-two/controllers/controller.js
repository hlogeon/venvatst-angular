class ViewTwoController {
  constructor (CountStore) {
    this.CountStore = CountStore;
    this.init();
  }

  init () {
    this.name = 'TWO';
    this.CountStore.increment();
  }
}

ViewTwoController.$inject = ['CountStore'];

angular
  .module('myApp.view-one')
  .controller('ViewTwoController', ViewTwoController);
