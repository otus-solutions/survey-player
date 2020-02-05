(function() {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('SavePlayerStepService', Service);

  Service.$inject = [
    'otusjs.model.activity.ActivityFacadeService',
    'SurveyClientService',
    'IndexedDbStorageService',
    "SurveyApiService"
  ];

  function Service(ActivityFacadeService, SurveyClientService, IndexedDbStorageService, SurveyApiService) {
    var self = this;
    var _currentItem;

    /* Public methods */
    self.beforeEffect = beforeEffect;
    self.effect = effect;
    self.afterEffect = afterEffect;
    self.getEffectResult = getEffectResult;

    function beforeEffect(pipe, flowData) {}

    function effect(pipe, flowData) {
      SurveyClientService.saveActivity(ActivityFacadeService.surveyActivity).then(function () {
        IndexedDbStorageService.deleteDatabase();
        location.href = SurveyApiService.getCallbackAddress();
        alert('Save activity');
      }).catch(function () {
        alert('Activity not saved');
      });
    }

    function afterEffect(pipe, flowData) {}

    function getEffectResult(pipe, flowData) {
      return flowData;
    }
  }
})();
