(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPlayerStart', {
      templateUrl: 'app/otusjs-player-component/player-start/player-start-template.html',
      controller: Controller
    });

  Controller.$inject = [
    'otusjs.player.core.player.PlayerService',
    '$state'
  ];

  function Controller(PlayerService, $state) {
    var self = this;

    /* Public methods */
    self.$onInit = onInit;
    self.play = play;
    self.stop = stop;

    function onInit() {
      self.hardBlocker = PlayerService.getHardBlocker();
      self.softBlocker = PlayerService.getSoftBlocker();

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

    function play() {
      $state.go('/finish');//todo teste
      // PlayerService.play();
      // _loadItem();
    }

    function stop() {
      PlayerService.stop();
    }

    function _loadItem() {
      let itemData = PlayerService.getItemData();
      if (itemData) {
        self.playerDisplay.loadItem(itemData);
      }
    }

  }
}());
