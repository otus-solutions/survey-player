(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPlayerFinish', {
      templateUrl: 'app/otusjs-player-component/player-finish/player-finish-template.html',
      controller: Controller
    });

  Controller.$inject = [];

  function Controller() {
    let self = this;
  }
}());
