(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPlayerPlay', {
      templateUrl: 'app/otusjs-player-component/player-play/player-play-template.html',
      controller: Controller
    });

  Controller.$inject = [
    'otusjs.player.core.player.PlayerService',
    '$state'
  ];

  function Controller(PlayerService, $state) {
    var self = this;

    /* Public methods */
    self.catchMouseWheel = catchMouseWheel;
    self.eject = eject;
    self.finalize = finalize;
    self.goAhead = goAhead;
    self.goBack = goBack;
    self.pause = pause;
    self.stop = stop;
    self.showBack = showBack;
    self.showCover = showCover;
    self.$onInit = onInit;
    self.onProcessingPlayer = onProcessingPlayer;
    self.goIsLockOpenClose = goIsLockOpenClose;

    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;

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

      if (Math.abs(lastScrollTop - st) <= delta)
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

    function showCover() {
      self.playerCover.show();
    }

    function showBack() {
      self.playerCover.remove();
      self.playerDisplay.remove();
      self.showBackCover = true;
      self.showActivity = false;
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
