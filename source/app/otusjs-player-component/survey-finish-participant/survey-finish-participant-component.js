(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyFinishParticipant', {
      controller: 'otusSurveyFinishParticipantCtrl as $ctrl',
      templateUrl: 'app/otusjs-player-component/survey-finish-participant/survey-finish-participant-template.html'
    }).controller('otusSurveyFinishParticipantCtrl', Controller);

  Controller.$inject = [
    '$q',
    '$mdDialog',
    '$scope',
    '$state',
    'STATE',
    'otusjs.player.core.player.PlayerService'
  ];


  function Controller($q, $mdDialog, $scope, $state, STATE, PlayerService) {
    const self = this;

    /* Public methods */
    self.$onInit = onInit;

    function onInit() {
      self.message = PlayerService.getReasonToFinishActivity();
      if(self.message === PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.IS_NOT_ME){
        self.message = 'OBRIGADO!';
      }
    }

  }
}());
