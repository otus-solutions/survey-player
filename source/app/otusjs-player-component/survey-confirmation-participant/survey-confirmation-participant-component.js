(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyConfirmationParticipant', {
      controller: 'otusSurveyConfirmationParticipantCtrl as $ctrl',
      templateUrl: 'app/otusjs-player-component/survey-confirmation-participant/survey-confirmation-participant-template.html'
    }).controller('otusSurveyConfirmationParticipantCtrl', Controller);

  Controller.$inject = [
    '$sce',
    '$state',
    'STATE',
    'otusjs.player.core.player.PlayerService'
  ];

  function Controller($sce, $state, STATE, PlayerService) {
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

      self.acronym = activity.surveyForm.acronym;
      self.title = activity.getName();

      const participantName = _capitalizeName(activity.participantData.name);
      self.participantName = $sce.trustAsHtml(`<p>${participantName}</p>`);
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

    function _capitalizeName(name) {
      return name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

  }
}());
