(function() {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('ExitPlayerStepService', Service);

  Service.$inject = [
    'otusjs.model.activity.ActivityFacadeService',
    'SurveyApiService',
    'IndexedDbStorageService'
  ];

  function Service(ActivityFacadeService, SurveyApiService, IndexedDbStorageService) {
    var self = this;
    var _currentItem;

    /* Public methods */
    self.beforeEffect = beforeEffect;
    self.effect = effect;
    self.afterEffect = afterEffect;
    self.getEffectResult = getEffectResult;

    function beforeEffect(pipe, flowData) { }

    function effect(pipe, flowData) {
      location.href = SurveyApiService.getCallbackAddress();
    }

    function afterEffect(pipe, flowData) {
    }

    function getEffectResult(pipe, flowData) {
      return flowData;
    }
  }
})();
