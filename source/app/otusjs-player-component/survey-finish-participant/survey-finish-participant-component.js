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
    self.showFillAgainButton = false;

    /* Public methods */
    self.$onInit = onInit;
    self.reloadSharedUrl = reloadSharedUrl;

    function onInit() {
      const reasonToFinish = PlayerService.getReasonToFinishActivityAndClear();

      self.showFillAgainButton = !_isFinalReason(reasonToFinish);

      let template = `<md-icon md-font-set="material-icons" style="color: ${reasonToFinish.icon.color}">${reasonToFinish.icon.name}</md-icon>` +
        `<p class="md-display-1 shared-url-message-highlighted" style="color: ${reasonToFinish.highlightedText.color}">${reasonToFinish.highlightedText.text}</p>`;

      if(reasonToFinish.text){
        reasonToFinish.text.forEach(sentence => {
          template += `<p class="md-display-1 shared-url-message">${sentence}</p>`;
        });
      }

      self.message = $sce.trustAsHtml(template);
    }

    function reloadSharedUrl(){
      PlayerService.reloadSharedUrl();
    }

    function _isFinalReason(reason){
      const REASONS_TO_LIVE_PLAYER = PlayerService.getConstants().REASONS_TO_LIVE_PLAYER;
      const finalReasons = [
        REASONS_TO_LIVE_PLAYER.IS_NOT_ME.id,
        REASONS_TO_LIVE_PLAYER.FINALIZE.id
      ];
      return finalReasons.includes(reason.id);
    }

  }
}());
