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
          if (error.STATUS != "UNAUTHORIZED") {
            PlayerService.setReasonToFinishActivity(PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.ERROR_OFFLINE);
          }

          $state.go(STATE.ERROR);

          $mdToast.show($mdToast.simple()
            .textContent('Erro ao salvar a atividade!')
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
