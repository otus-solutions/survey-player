(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('SavePlayerStepService', Service);

  Service.$inject = [
    'otusjs.model.activity.ActivityFacadeService',
    'SurveyClientService',
    'IndexedDbStorageService',
    'SurveyApiService',
    '$mdToast',
    '$state',
    'STATE',
    'otusjs.player.core.player.PlayerService'
  ];

  function Service(ActivityFacadeService, SurveyClientService, IndexedDbStorageService, SurveyApiService,
    $mdToast, $state, STATE, PlayerService) {
    const self = this;

    /* Public methods */
    self.beforeEffect = beforeEffect;
    self.effect = effect;
    self.afterEffect = afterEffect;
    self.getEffectResult = getEffectResult;

    function beforeEffect(pipe, flowData) {
    }

    function effect(pipe, flowData) {
      SurveyClientService.saveActivity(ActivityFacadeService.surveyActivity)
        .then(function () {
          if (location.origin == SurveyApiService.getCallbackAddress()) {
            $state.go(STATE.HOME);
          }
          else if (SurveyApiService.hasCallbackAddress()) {
            location.href = SurveyApiService.getCallbackAddress();
          }
        })
        .catch(function (error) {
          PlayerService.setReasonToFinishActivityFromErrorStatus(error.STATUS);
          $state.go(STATE.ERROR);

          $mdToast.show($mdToast.simple()
            .textContent('Erro ao salvar a atividade, atividade salva em atividades pendentes!')
            .hideDelay(3000));
        });
    }

    function afterEffect(pipe, flowData) {
    }

    function getEffectResult(pipe, flowData) {
      return flowData;
    }
  }
})();
