(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyBackCover', {
      template:'<md-content class=cover-content layout-align="center center" layout=row flex><div layout-align="center center" layout=column flex><section><h2 class=md-display-1>{{ $ctrl.title }}</h2></section><div layout=row><md-button class="md-raised md-primary" aria-label=Finalizar ng-click=$ctrl.finalize()><md-icon md-font-set=material-icons>assignment_turned_in</md-icon>Finalizar</md-button><md-button class="md-raised md-no-focus" aria-label=Sair ng-click=$ctrl.stop()><md-icon md-font-set=material-icons>exit_to_app</md-icon>Sair</md-button></div></div></md-content>',
      controller: Controller,
      bindings: {
        onFinalize: '&',
        onStop: '&'
      }
    });

    Controller.$inject = [
      '$scope',
      'otusjs.player.data.activity.ActivityFacadeService'
    ];


  function Controller($scope, ActivityFacadeService) {
    var self = this;

    /* Public methods */
    self.finalize = finalize;
    self.stop = stop;

    /* Public methods */
    self.$onInit = onInit;

    function finalize() {
      self.onFinalize();
    }

    function stop() {
      self.onStop();
    }

    function onInit() {
      $scope.$parent.$ctrl.playerBackCover = self;
      var activity = ActivityFacadeService.getCurrentSurvey().getSurvey();
      self.title = activity.getName();
    }
  }
}());
