(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusStaticVariable', {
      template:'<div hide-xs class=fab-speed-dial><md-button id=ButtonIsLockOpenClose ng-click=$ctrl.isLockOpenClose() class="md-icon-button md-fab md-mini md-accent" aria-label="button isLockOpenClose"><md-icon md-font-set=material-icons>{{ $ctrl.iconLockOpenClose }}</md-icon><md-tooltip md-direction=bottom>{{ $ctrl.tooltipLockOpenClose }}</md-tooltip></md-button></div><div layout=row layout-align="center center"><md-button hide-gt-xs ng-click=$ctrl.isLockOpenClose() class="md-icon-button md-accent" aria-label="button isLockOpenClose" flex>Imformações Auxiliares</md-button></div><md-sidenav class=md-sidenav-left md-component-id=left><md-toolbar layout-align="center center"><span>Informações Auxiliares</span></md-toolbar><div layout=column ng-if=$ctrl.variable.length layout-padding layout-align="start none" ng-repeat="option in $ctrl.variable"><div layout=column layout-align="center start"><span class=md-caption style="color: gray;">{{ option.label }}</span> <span class=md-subhead>{{ option.translatedValue }}</span></div><md-divider></md-divider></div><div ng-if=!$ctrl.variable.length layout=row layout-align="center center"><span>Não ah variáveis disponíveis</span></div></md-sidenav>',
      controller: 'otusStaticVariableCtrl as $ctrl'
    }).controller('otusStaticVariableCtrl', Controller);

  Controller.$inject = [
    '$mdSidenav',
    'otusjs.player.data.activity.ActivityFacadeService'
  ];

  function Controller($mdSidenav, ActivityFacadeService) {
    var self = this;
    var _variable = null;

    self.shouldLockOpenClose = true;
    self.iconLockOpenClose = 'arrow_left';
    self.tooltipLockOpenClose = 'Fechar';

    self.$onInit = onInit;
    self.isLockOpenClose = isLockOpenClose;

    function onInit() {
      _getWholeStaticVariableList();
    }

    function _getWholeStaticVariableList() {
      _variable = ActivityFacadeService.getWholeTemplateStaticVariableList();

      if(_variable.length){
        _variable.forEach(function(variable){
          if(!variable.translatedValue){
            variable.translatedValue = 'Não há dados.';
          }
        });

        self.variable = _variable;
      } else {
        self.variable = [];
      }


      return self.variable;
    }

    function isLockOpenClose(){
      self.shouldLockOpenClose = !self.shouldLockOpenClose;
      self.iconLockOpenClose = self.shouldLockOpenClose ? 'arrow_left' : 'arrow_right';
      self.tooltipLockOpenClose = self.shouldLockOpenClose ? 'Fechar' : 'Abrir';
      $mdSidenav('left').toggle();
    }
  }
}());