(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('ExitPlayerStepService', Service);

  Service.$inject = [
    'otusjs.model.activity.ActivityFacadeService',
    'SurveyApiService',
    '$state'
  ];

  function Service(ActivityFacadeService, SurveyApiService, $state) {
    var self = this;
    var _currentItem;

    /* Public methods */
    self.beforeEffect = beforeEffect;
    self.effect = effect;
    self.afterEffect = afterEffect;
    self.getEffectResult = getEffectResult;

    function beforeEffect(pipe, flowData) {
    }

    function effect(pipe, flowData) {
      if (location.origin == SurveyApiService.getCallbackAddress()) $state.go('/home')
      else location.href = SurveyApiService.getCallbackAddress();
    }

    function afterEffect(pipe, flowData) {
    }

    function getEffectResult(pipe, flowData) {
      return flowData;
    }
  }
})();
