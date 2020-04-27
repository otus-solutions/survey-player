(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusStaticVariable', {
      templateUrl: 'app/otusjs-player-component/static-variable/static-variable-template.html',
      controller: 'otusStaticVariableCtrl as $ctrl',
      bindings: {
        isLockOpenClose: '=?'
      }
    }).controller('otusStaticVariableCtrl', Controller);

  Controller.$inject = [
    '$mdSidenav',
    'otusjs.player.data.activity.ActivityFacadeService'
  ];

  function Controller($mdSidenav, ActivityFacadeService) {
    var self = this;
    var _variable = null;

    self.shouldLockOpenClose = true;
    self.iconLockOpenClose = 'arrow_right';
    self.tooltipLockOpenClose = 'Abrir';

    self.$onInit = onInit;

    function onInit() {
      _getWholeStaticVariableList();
      self.isLockOpenClose = _isLockOpenClose;
    }

    function _getWholeStaticVariableList() {
      _variable = ActivityFacadeService.getWholeTemplateStaticVariableList();

      if (_variable.length) {
        _variable.forEach(function (variable) {
          if (!variable.translatedValue) {
            variable.translatedValue = 'Não há dados.';
          }
        });

        self.variable = _variable;
      } else {
        self.variable = [];
      }

      return self.variable;
    }

    function _isLockOpenClose() {
      self.shouldLockOpenClose = !self.shouldLockOpenClose;
      self.iconLockOpenClose = self.shouldLockOpenClose ? 'arrow_right' : 'arrow_left';
      self.tooltipLockOpenClose = self.shouldLockOpenClose ? 'Abrir' : 'Fechar';
      $mdSidenav('left').toggle();
    }
  }
}());