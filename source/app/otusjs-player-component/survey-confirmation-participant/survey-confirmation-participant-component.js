(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyConfirmationParticipant', {
      controller: 'otusSurveyConfirmationParticipantCtrl as $ctrl',
      templateUrl: 'app/otusjs-player-component/survey-confirmation-participant/survey-confirmation-participant-template.html'
    }).controller('otusSurveyConfirmationParticipantCtrl', Controller);

  Controller.$inject = [
    '$state',
    'STATE',
    'otusjs.player.core.player.PlayerService'
  ];

  function Controller($state, STATE, PlayerService) {
    let self = this;

    /* Public methods */
    self.$onInit = onInit;
    self.play = play;
    self.stop = stop;

    function onInit() {
      const activity = PlayerService.getCurrentSurvey();
      if(activity.statusHistory.getFinalizedRegistries().length > 0){
        _stop(PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.ALREADY_FINALIZED);
        return;
      }

      PlayerService.setHasCallbackAddress(false);
      self.participantName = PlayerService.getCurrentSurvey().participantData.name;

      _unblock();
    }

    function _unblock() {
      self.hardError = false;
      self.softError = false;
      self.softProgress = false;
      self.hardProgress = false;

      if (self.hardBlocker) {
        self.hardProgress = true;
        self.hardBlocker
          .then(function () {
            self.hardProgress = false;
          })
          .catch(function () {
            self.hardProgress = false;
            self.hardError = true;
            self.message = 'Ocorreu um erro ao baixar informações necessárias ao preenchimento da atividade. Clique para sair.';
          });
      }

      if (self.softBlocker) {
        self.softProgress = true;
        self.softBlocker
          .then(function () {
            self.softProgress = false;
          })
          .catch(function () {
            self.softProgress = false;
            self.softError = true;
          });
      }
    }

    function play() {
      $state.go(STATE.BEGIN);
    }

    function stop(){
      _stop(PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.IS_NOT_ME);
    }

    function _stop(reason){
      PlayerService.stop();
      PlayerService.setReasonToFinishActivity(reason);
      $state.go(STATE.PARTICIPANT_FINISH);
    }

  }
}());
