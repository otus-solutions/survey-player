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
    self.showTryAgainButton = false;

    /* Public methods */
    self.$onInit = onInit;
    self.goToCallback = goToCallback;
    self.reloadSharedUrl = reloadSharedUrl;


    function onInit() {
      self.participantSharedURLError = !PlayerService.hasCallbackAddress();

      const OFF_LINE_ERROR = PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.OFFLINE_ERROR;

      const reasonToFinish = PlayerService.getReasonToFinishActivity() || OFF_LINE_ERROR;
      PlayerService.clearReasonToFinishActivity();

      self.showTryAgainButton = (self.participantSharedURLError && reasonToFinish.id === OFF_LINE_ERROR.id);

      let template = `<md-icon md-font-set="material-icons" style="color: ${reasonToFinish.icon.color}">${reasonToFinish.icon.name}</md-icon>` +
        `<p class="md-display-1 shared-url-message-highlighted" style="color: ${reasonToFinish.highlightedText.color}">${reasonToFinish.highlightedText.text}</p>`;

      if(reasonToFinish.text){
        reasonToFinish.text.forEach(sentence => {
          template += `<p class="md-display-1 shared-url-message">${sentence}</p>`;
        });
      }

      self.message = $sce.trustAsHtml(template);
    }

    function goToCallback(){
      PlayerService.goToCallback();
    }

    function reloadSharedUrl(){
      PlayerService.reloadSharedUrl();
    }

  }
}());
