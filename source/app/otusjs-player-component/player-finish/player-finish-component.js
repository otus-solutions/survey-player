(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPlayerFinish', {
      templateUrl: 'app/otusjs-player-component/player-finish/player-finish-template.html',
      controller: Controller
    });

  Controller.$inject = [
    'otusjs.player.core.player.PlayerService'
  ];

  function Controller(PlayerService) {
    var self = this;

    /* Public methods */
    self.$onInit = onInit;
    self.eject = eject;
    self.stop = stop;


    function onInit() {
      /*
       * These objects are initialized by child components of Player
       * See player-commander-component.js (onInit method)
       * See player-display-component.js (onInit method)
       */
      self.playerCommander = {};
      self.playerDisplay = {};
      self.playerCover = {};
      self.playerBackCover = {};
      PlayerService.bindComponent(self);
    }

    function eject() {
      PlayerService.eject();
    }

    function stop() {
      PlayerService.stop();
    }
  }
}());
