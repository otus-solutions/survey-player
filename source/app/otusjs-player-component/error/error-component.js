(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusError', {
      controller: 'otusErrorCtrl as $ctrl',
      templateUrl: 'app/otusjs-player-component/error/error-template.html'
    }).controller('otusErrorCtrl', Controller);

  Controller.$inject = [
    'otusjs.player.core.player.PlayerService'
  ];

  function Controller(PlayerService) {
    const self = this;

    /* Public methods */
    self.$onInit = onInit;

    function onInit() {
      self.participantSharedURLError = PlayerService.hasCallbackAddress();

      if(self.participantSharedURLError){
        if($(window).width() <= 600){
          self.class = "md-display-1 shared-url-final-message-xs";
          self.imageWidth = "80%";
        }
        else{
          self.class = "md-display-1 shared-url-final-message";
          self.imageWidth = "";
        }
      }
    }

  }
}());
