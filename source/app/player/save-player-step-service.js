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
        location.href = SurveyApiService.getCallbackAddress();
      }).catch(function () {
        $mdToast.show($mdToast.simple()
          .textContent('Erro ao salvar a atividade!')
          .hideDelay(3000));
      });
    }

    function afterEffect(pipe, flowData) {}

    function getEffectResult(pipe, flowData) {
      return flowData;
    }
  }
})();
