(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyFinishParticipant', {
      controller: 'otusSurveyFinishParticipantCtrl as $ctrl',
      templateUrl: 'app/otusjs-player-component/survey-finish-participant/survey-finish-participant-template.html'
    }).controller('otusSurveyFinishParticipantCtrl', Controller);

  Controller.$inject = [
    '$sce',
    'otusjs.player.core.player.PlayerService'
  ];


  function Controller($sce, PlayerService) {
    const self = this;

    /* Public methods */
    self.$onInit = onInit;

    function onInit() {
      self.message = $sce.trustAsHtml(PlayerService.getReasonToFinishActivity());
      if(self.message === PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.IS_NOT_ME){
        self.message = 'Obrigado!';
      }
    }

  }
}());
