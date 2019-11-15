(function() {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('SavePlayerStepService', Service);

  Service.$inject = [
    'otusjs.model.activity.ActivityFacadeService',
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

    function beforeEffect(pipe, flowData) {}

    function effect(pipe, flowData) {
      SurveyApiService.saveActivity(ActivityFacadeService.surveyActivity.toJSON()).then(function () {
        console.log('Save activity');
      }).catch(function () {
        console.error('Activity not saved');
      });
    }

    function afterEffect(pipe, flowData) {}

    function getEffectResult(pipe, flowData) {
      return flowData;
    }
  }
})();
