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
      PlayerService.setHasExternalCallback(false);

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
      PlayerService.stop();
      $state.go(STATE.PARTICIPANT_FINISH);
    }

  }
}());
