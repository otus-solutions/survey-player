(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyCover', {
      controller: 'otusSurveyCoverCtrl as $ctrl',
      templateUrl: 'app/otusjs-player-component/survey-cover/survey-cover-template.html'
    }).controller('otusSurveyCoverCtrl', Controller);

  Controller.$inject = [
    '$scope',
    '$element',
    '$state',
    'otusjs.player.core.player.PlayerService'
  ];

  function Controller($scope, $element, $state, PlayerService) {
    let self = this;

    /* Public methods */
    self.$onInit = onInit;
    self.play = play;
    self.stop = stop;

    function onInit() {
      self.hardBlocker = PlayerService.getHardBlocker();
      self.softBlocker = PlayerService.getSoftBlocker();

      self.title = PlayerService.getCurrentSurvey().getName();

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
      $state.go('/play');
    }

    function stop(){
      PlayerService.stop();
    }

  }
}());
