(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPlayer', {
      template:'<otus-survey-cover on-play="$ctrl.play()" on-stop="$ctrl.stop()" soft-blocker="$ctrl.softBlocker" hard-blocker="$ctrl.hardBlocker" ng-show="$ctrl.showCover" layout-align="center center" layout="column" flex class="player-cover"></otus-survey-cover><div layout="column" flex ng-show="$ctrl.showActivity"><otus-survey-header class="nav-down" layout="row" layout-xs="column"></otus-survey-header><div layout="row" layout-xs="column" flex><md-content layout="row" layout-xs="column" flex><otus-static-variable layout="column"></otus-static-variable><md-content class="otus-player-display-container" layout="row" flex><otus-player-display go-back="$ctrl.goBack()" on-processing-player="$ctrl.onProcessingPlayer()" layout="column" flex style="position: relative !important"></otus-player-display><otus-player-commander hide-xs class="md-fab-bottom-right md-fling" layout="column" flex="10" layout-align="center center" style="max-height:none!important;" on-go-back="$ctrl.goBack()" on-pause="$ctrl.pause()" on-stop="$ctrl.stop()" on-go-ahead="$ctrl.goAhead()" on-processing="$ctrl.onProcessing" on-eject="$ctrl.eject()"></otus-player-commander></md-content></md-content><div layout="row" hide-gt-xs><otus-player-commander class="md-fab-bottom-right md-fling" layout="column" flex layout-align="center center" on-go-back="$ctrl.goBack()" on-pause="$ctrl.pause()" on-stop="$ctrl.stop()" on-go-ahead="$ctrl.goAhead()" on-processing="$ctrl.onProcessing" on-eject="$ctrl.eject()"></otus-player-commander></div></div></div><otus-survey-back-cover on-finalize="$ctrl.eject()" on-stop="$ctrl.stop()" ng-show="$ctrl.showBackCover" layout-align="center center" layout="column" flex class="player-back-cover"></otus-survey-back-cover>',
      controller: Controller
    });

  Controller.$inject = [
    'otusjs.player.core.player.PlayerService'
  ];

  function Controller(PlayerService) {
    var self = this;

    /* Public methods */
    self.catchMouseWheel = catchMouseWheel;
    self.eject = eject;
    self.finalize = finalize;
    self.goAhead = goAhead;
    self.goBack = goBack;
    self.pause = pause;
    self.play = play;
    self.stop = stop;
    self.showBack = showBack;
    self.showCover = showCover;
    self.$onInit = onInit;
    self.onProcessingPlayer = onProcessingPlayer;

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
      var st = angular.element(document.querySelector('.otus-player-display-container')).scrollTop();

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
      if (event.deltaY > 0) {
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

    function play() {
      self.showBackCover = false;
      self.showCover = false;
      self.showActivity = true;
      PlayerService.play();
      _loadItem();
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

    function onInit() {
      self.showBackCover = false;
      self.showCover = true;
      self.showActivity = false;

      _setupHardBlocker();
      _setupSoftBlocker();

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

    function _setupHardBlocker() {
      self.hardBlocker = PlayerService.getHardBlocker();
    }

    function _setupSoftBlocker() {
      self.softBlocker = PlayerService.getSoftBlocker();
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
  }
}());
