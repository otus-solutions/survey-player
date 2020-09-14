(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyError', {
      controller: 'otusSurveyErrorCtrl as $ctrl',
      templateUrl: 'app/otusjs-player-component/error/error-template.html'
    }).controller('otusSurveyErrorCtrl', Controller);

  Controller.$inject = [
    '$sce',
    'otusjs.player.core.player.PlayerService'
  ];

  function Controller($sce, PlayerService) {
    const self = this;

    /* Public methods */
    self.$onInit = onInit;

    function onInit() {
      self.participantSharedURLError = !PlayerService.hasCallbackAddress();

      if(self.participantSharedURLError){
        const reasonToFinish = PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.ERROR;

        let template = `<md-icon md-font-set="material-icons" style="color: ${reasonToFinish.icon.color}">${reasonToFinish.icon.name}</md-icon>` +
          `<p class="md-display-1 shared-url-message-highlighted" style="color: ${reasonToFinish.highlightedText.color}">${reasonToFinish.highlightedText.text}</p>`;
        if(reasonToFinish.text){
          reasonToFinish.text.forEach(sentence => {
            template += `<p class="md-display-1 shared-url-message">${sentence}</p>`;
          });
        }

        self.message = $sce.trustAsHtml(template);
      }
    }

  }
}());
