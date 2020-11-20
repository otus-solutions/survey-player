(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyPlaying', {
      controller: 'otusSurveyPlayingCtrl as $ctrl',
      templateUrl: 'app/otusjs-player-component/survey-playing/survey-playing-template.html'
    })
    .controller('otusSurveyPlayingCtrl', Controller);

  Controller.$inject = [
    '$state',
    'STATE',
    'otusjs.player.core.player.PlayerService'
  ];

  function Controller($state, STATE, PlayerService) {
    let self = this;

    /* Public methods */
    self.catchMouseWheel = catchMouseWheel;
    self.$onInit = onInit;
    self.eject = eject;
    self.finalize = finalize;
    self.pause = pause;
    self.stop = stop;
    self.goToFinish = goToFinish;
    self.goAhead = goAhead;
    self.goBack = goBack;
    self.onProcessingPlayer = onProcessingPlayer;
    self.goIsLockOpenClose = goIsLockOpenClose;

    let didScroll;
    let lastScrollTop = 0;
    const SCROLL_DELTA = 5;

    angular.element(document).ready(function () {
      angular.element(document.querySelector('.otus-player-display-container')).bind('wheel', function () {
        didScroll = true;
      });

      angular.element(document.querySelector('.otus-player-display-container')).bind('touchmove', function () {
        didScroll = true;
      });
    });

    setInterval(function () {
      if (didScroll) {
        _hasScrolled();
        didScroll = false;
      }
    }, 250);

    function _hasScrolled() {
      let st = angular.element(document.querySelector('.otus-player-display-container')).scrollTop();

      if (Math.abs(lastScrollTop - st) <= SCROLL_DELTA)
        return;

      if (st > lastScrollTop) {
        $('otus-survey-header').removeClass('nav-down').addClass('nav-up');
      } else {
        $('otus-survey-header').removeClass('nav-up').addClass('nav-down');
      }

      lastScrollTop = st;
    }

    function catchMouseWheel($event) {
      if ($event.deltaY > 0) {
        goAhead();
      } else {
        goBack();
      }
    }

    function onInit() {
      PlayerService.play();
      PlayerService.bindComponent(self);

      self.hardBlocker = PlayerService.getHardBlocker();
      self.softBlocker = PlayerService.getSoftBlocker();
    }

    function eject() {
      PlayerService.eject();
    }

    function finalize() {
      PlayerService.save();
      PlayerService.eject();
      _goToParticipantFinishIfHasNoCallbackAddress(PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.FINALIZE);
    }

    function pause() {
      PlayerService.save();
      _goToParticipantFinishIfHasNoCallbackAddress(PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.SAVE);
    }

    function stop() {
      PlayerService.stop();
      _goToParticipantFinishIfHasNoCallbackAddress(PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.GET_OUT_WITHOUT_SAVE);
    }

    function goToFinish() {
      $state.go(STATE.FINISH);
    }

    function goAhead() {
      PlayerService.goAhead();
      _loadItem();
    }

    function goBack() {
      PlayerService.goBack();
      _loadItem();
    }

    function _loadItem() {
      let itemData = PlayerService.getItemData();
      if (itemData) {
        self.playerDisplay.loadItem(itemData);
      }
    }

    function _goToParticipantFinishIfHasNoCallbackAddress(reason) {
      if (!PlayerService.hasCallbackAddress()) {
        PlayerService.setReasonToFinishActivity(reason);
        $state.go(STATE.PARTICIPANT_FINISH);
      }
    }

    function onProcessingPlayer() {
      self.onProcessing();
    }

    function goIsLockOpenClose() {
      self.isButtonOpenClose();
    }
  }

}());
