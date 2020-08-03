(function () {
  'use strict';

  angular
    .module('otusjs.player.core.player')
    .service('otusjs.player.core.player.OnProcessingService', OnProcessingService);

  OnProcessingService.$inject = [
    '$timeout'
  ];

  function OnProcessingService($timeout) {
    var self = this;

    self.loadingAhead = false;
    self.loadingBack = false;
    self.isGoAheadDisabled = false;
    self.isGoBackDisabled = false;

    self.onProcessing = onProcessing;

    function onProcessing() {
      $timeout(function () {
        self.loadingAhead = false;
        self.loadingBack = false;
        self.isGoAheadDisabled = false;
        self.isGoBackDisabled = false;
      }, 300);
    }

  }
})();
