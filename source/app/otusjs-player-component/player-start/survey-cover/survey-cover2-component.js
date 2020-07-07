(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyCover2', {
      templateUrl: 'app/otusjs-player-component/player-start/survey-cover/survey-cover2-template.html',
      controller: Controller,
      // bindings: {
      //   onPlay: '&',
      //   hardBlocker: '&',
      //   softBlocker: '&',
      //   onStop: '&'
      // }
    });

  Controller.$inject = [
    '$scope',
    '$element',
    'otusjs.player.data.activity.ActivityFacadeService',
    'otusjs.player.core.player.PlayerService',
    '$state'
  ];

  function Controller($scope,  $element, ActivityFacadeService, PlayerService, $state) {
    let self = this;

    /* Public methods */
    self.$onInit = onInit;
    self.play = play;
    self.show = show;
    self.remove = remove;
    self.stop = stop;

    function onInit() {
      self.hardBlocker = PlayerService.getHardBlocker();
      self.softBlocker = PlayerService.getSoftBlocker();

      // $scope.$parent.$ctrl.playerCover = self;
      const activity = ActivityFacadeService.getCurrentSurvey().getSurvey();
      self.title = activity.getName();

      console.log(activity)
      _unblock();
    }

    function _unblock() {
      self.hardError = false;
      self.softError = false;
      self.softProgress = false;
      self.hardProgress = false;

      if (self.hardBlocker) {
        self.hardProgress = true;
        self.hardBlocker
          .then(function () {
            self.hardProgress = false;
          })
          .catch(function () {
            self.hardProgress = false;
            self.hardError = true;
            self.message = 'Ocorreu um erro ao baixar informações necessárias ao preenchimento da atividade. Clique para sair.';
          });
      }

      if (self.softBlocker) {
        self.softProgress = true;
        self.softBlocker
          .then(function () {
            self.softProgress = false;
          })
          .catch(function () {
            self.softProgress = false;
            self.softError = true;
          });
      }
    }

    function play() {
      // self.onPlay();
      $state.go('/play');//todo correct is play
    }

    function stop(){
      // self.onStop();
      PlayerService.stop();
    }

    function show() {
      const activity = ActivityFacadeService.getCurrentSurvey().getSurvey();
      self.title = activity.getName();
    }

    function remove() {
      $element.remove();
    }

  }
}());
