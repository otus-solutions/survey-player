(function() {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('StopPlayerStepService', Service);

  Service.$inject = [
    'otusjs.player.data.activity.ActivityFacadeService',
    'SurveyApiService'
  ];

  function Service(ActivityFacadeService, SurveyApiService) {
    var self = this;
    var _currentItem;

    /* Public methods */
    self.beforeEffect = beforeEffect;
    self.effect = effect;
    self.afterEffect = afterEffect;
    self.getEffectResult = getEffectResult;

    function beforeEffect(pipe, flowData) { }

    function effect(pipe, flowData) {
      ActivityFacadeService.save();
      // location.href = SurveyApiService.getCallbackAddress();
    }

    function afterEffect(pipe, flowData) {
    }

    function getEffectResult(pipe, flowData) {
      return flowData;
    }
  }
})();
