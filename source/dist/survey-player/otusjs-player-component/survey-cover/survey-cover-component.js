(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyCover', {
      template:'<md-content class="cover-content" layout-align="center center" layout="row" flex><div layout-align="center center" layout="column" flex layout-padding><section><h2 class="md-display-1">{{ $ctrl.title }}</h2></section><div ng-if="$ctrl.hardError" layout="row"><md-icon md-font-set="material-icons">warning</md-icon><span class="md-body-2" layout-padding>{{ $ctrl.message }}</span></div><div layout="row"><md-button class="md-raised md-primary" aria-label="Iniciar" ng-click="$ctrl.play()" ng-disabled="$ctrl.hardError"><md-icon md-font-set="material-icons">assignment</md-icon>Iniciar</md-button><md-button class="md-raised md-no-focus" aria-label="Sair" ng-click="$ctrl.stop()"><md-icon md-font-set="material-icons">exit_to_app</md-icon>Sair</md-button></div><md-progress-circular md-primary md-mode="indeterminate" ng-show="$ctrl.softProgress || $ctrl.hardProgress"></md-progress-circular></div></md-content>',
      controller: Controller,
      bindings: {
        onPlay: '&',
        hardBlocker: '&',
        softBlocker: '&',
        onStop: '&'
      }
    });

  Controller.$inject = [
    '$scope',
    '$element',
    'otusjs.player.data.activity.ActivityFacadeService'
  ];

  function Controller($scope, $element, ActivityFacadeService) {
    var self = this;

    /* Public methods */
    self.$onInit = onInit;
    self.play = play;
    self.show = show;
    self.remove = remove;
    self.stop = stop;

    function onInit() {
      $scope.$parent.$ctrl.playerCover = self;
      var activity = ActivityFacadeService.getCurrentSurvey().getSurvey();
      self.title = activity.getName();
      _unblock();
    }

    function _unblock() {
      self.hardError = false;
      self.softError = false;
      self.softProgress = false;
      self.hardProgress = false;

      if (self.hardBlocker()) {
        self.hardProgress = true;
        self.hardBlocker()
          .then(function () {
            self.hardProgress = false;
          })
          .catch(function () {
            self.hardProgress = false;
            self.hardError = true;
            self.message = 'Ocorreu um erro ao baixar informações necessárias ao preenchimento da atividade. Clique para sair.';
          });
      }

      if(self.softBlocker()){
        self.softProgress = true;
        self.softBlocker()
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
      self.onPlay();
    }

    function stop() {
      self.onStop();
    }

    function show() {
      var activity = ActivityFacadeService.getCurrentSurvey().getSurvey();
      self.title = activity.getName();
    }

    function remove() {
      $element.remove();
    }
  }
}());
