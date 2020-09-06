(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyBackCover', {
      templateUrl: 'app/otusjs-player-component/survey-back-cover/survey-back-cover-template.html',
      bindings: {
        onFinalize: '&',
        onStop: '&'
      }
    }).controller('otusSurveyBackCoverCtrl', Controller);

  Controller.$inject = [
    '$q',
    '$mdDialog',
    '$state',
    'STATE',
    'otusjs.player.core.player.PlayerService'
  ];


  function Controller($q, $mdDialog, $state, STATE, PlayerService) {
    const self = this;
    const CANCEL_TITLE = 'Sair da Atividade';
    const CANCEL_CONTENT = 'Todos os dados, não salvos, serão perdidos. Você tem certeza que deseja sair?';

    /* Public methods */
    self.$onInit = onInit;
    self.finalize = finalize;
    self.stop = stop;


    function onInit() {
      if (PlayerService.getCurrentSurvey()) {
        self.title = PlayerService.getCurrentSurvey().getName();
      } else {
        $state.go(STATE.PLAY);
      }
    }

    function finalize() {
      PlayerService.eject();
      _goToParticipantFinishIfHasNoCallbackAddress(PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.FINALIZE);
    }

    function stop() {
      _confirmDialog(CANCEL_TITLE, CANCEL_CONTENT).then(
        function () {
          PlayerService.stop();
          _goToParticipantFinishIfHasNoCallbackAddress(PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.GET_OUT_WITHOUT_SAVE);
        });
    }

    function _confirmDialog(title, content) {
      var deferred = $q.defer();
      $mdDialog.show($mdDialog.confirm()
        .title(title)
        .textContent(content)
        .ariaLabel('Confirmar ação de atalho:' + title)
        .ok('Ok')
        .cancel('Cancelar')
      ).then(function () {
        deferred.resolve();
      }, function () {
        deferred.reject();
      });
      return deferred.promise;
    }

    function _goToParticipantFinishIfHasNoCallbackAddress(reason){
      if(!PlayerService.hasCallbackAddress()){
        PlayerService.setReasonToFinishActivity(reason);
        $state.go(STATE.PARTICIPANT_FINISH);
      }
    }
  }
}());
