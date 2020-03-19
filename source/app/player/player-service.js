(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('PlayerService', Service);

  Service.$inject = [
    'otusjs.player.core.player.PlayerService',
    'otusjs.player.core.player.PlayerConfigurationService',
    'ExitPlayerStepService',
    'StopPlayerStepService',
    'SavePlayerStepService',
    'PrePlayerStepService'
  ];

  function Service(PlayerService, PlayerConfigurationService, ExitPlayerStepService, StopPlayerStepService, SavePlayerStepService, PrePlayerStepService) {
    var self = this;
    var _isSetupStepsReady = false;

    /* Public methods */
    self.setup = setup;

    function setup() {
      if (!_isSetupStepsReady) {
        _setupSteps();
      }
      PlayerService.setup();
    }

    function _setupSteps() {
      // Application default steps
      PlayerConfigurationService.onPrePlayerStart(PrePlayerStepService);
      PlayerConfigurationService.onSave(SavePlayerStepService);
      PlayerConfigurationService.onStop(StopPlayerStepService);
      _isSetupStepsReady = true;
    }

  }
}());
