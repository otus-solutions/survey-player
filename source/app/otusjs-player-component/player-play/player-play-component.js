(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPlayerPlay', {
      templateUrl: 'app/otusjs-player-component/player-play/player-play-template.html',
      controller: Controller
    });

  Controller.$inject = [
    'otusjs.player.core.player.PlayerService',
    '$state'
  ];

  function Controller(PlayerService, $state) {
    let self = this;
  }
}());
