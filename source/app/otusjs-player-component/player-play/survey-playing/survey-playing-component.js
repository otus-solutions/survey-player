(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyPlaying', {
      templateUrl: 'app/otusjs-player-component/player-play/survey-playing/survey-playing-template.html',
      controller: Controller
    });

  Controller.$inject = [
    'otusjs.player.core.player.PlayerService',
    '$state'
  ];

  function Controller(PlayerService, $state) {
    let self = this;

    /* Public methods */
    self.catchMouseWheel = catchMouseWheel;
    self.$onInit = onInit;
    self.eject = eject;
    self.finalize = finalize;
    self.goAhead = goAhead;
    self.goBack = goBack;
    self.pause = pause;
    self.stop = stop;
    self.showBack = showBack;
    // self.showCover = showCover;
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
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
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
      // self.showBackCover = false;
      // self.showCover = true;
      // self.showActivity = false;

      self.hardBlocker = PlayerService.getHardBlocker();
      self.softBlocker = PlayerService.getSoftBlocker();

      /*
       * These objects are initialized by child components of Player
       * See player-commander-component.js (onInit method)
       * See player-display-component.js (onInit method)
       */
      self.playerCommander = {};
      self.playerDisplay = {};
      self.playerCover = {};
      self.playerBackCover = {};
      PlayerService.bindComponent(self);
    }

    function eject() {
      PlayerService.eject();
    }

    function finalize() {
      PlayerService.save();
      PlayerService.eject();
    }

    function goAhead() {
      PlayerService.goAhead();
      _loadItem();
    }

    function goBack() {
      PlayerService.goBack();
      _loadItem();
    }

    function pause() {
      PlayerService.save();
    }

    function stop() {
      PlayerService.stop();
    }

    // function showCover() {
    //   self.playerCover.show();
    // }

    function showBack() {
      $state.go('/finish');
      // self.playerCover.remove();
      // self.playerDisplay.remove();
      // self.showBackCover = true;
      // self.showActivity = false;
    }

    function _loadItem() {
      let itemData = PlayerService.getItemData();
      if (itemData) {
        self.playerDisplay.loadItem(itemData);
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
