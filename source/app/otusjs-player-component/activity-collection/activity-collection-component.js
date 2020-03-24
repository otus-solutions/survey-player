(function () {

  'use strict';

  angular.module('otusjs.player.component')
    .component('activityCollection', {
      templateUrl: 'app/otusjs-player-component/activity-collection/activity-collection-template.html',
      controller: Controller,
      bindings: {
        user: '<',
        activities: '=',
        commands: '='
      }
    });

  Controller.$inject = [
    'otusjs.model.activity.OfflineActivityCollection',
    '$scope',
    '$mdDialog'
  ];

  function Controller(OfflineActivityCollection, $scope, $mdDialog) {
    var self = this;

    self.collections = [];


    self.$onInit = function () {
      self.allActivities = self.activities.map(function (activity) {
        return activity.toJSON();
      });
      self.collections.push(OfflineActivityCollection.fromJson({observation: 'ULTRASSONOGRAFIA DAS ARTÉRIAS CARÓTIDAS E FEMORAIS'}));
      self.collections.push(OfflineActivityCollection.fromJson({observation: 'Teste2'}));
      self.collections.push(OfflineActivityCollection.fromJson({observation: 'Teste3'}));
      self.collections.push(OfflineActivityCollection.fromJson({observation: 'Teste1'}));
      self.collections.push(OfflineActivityCollection.fromJson({observation: 'Teste2'}));
      self.collections.push(OfflineActivityCollection.fromJson({observation: 'Teste3'}));

      // self.test = OfflineActivityCollection.create();
      // self.test.addActivities(self.activities.map(function (activity) {
      //   return activity.toJSON();
      // }));
      // console.log(self.test)  statusHistory.getLastStatus().name != CREATED
    };

    function newCollect() {

    }

    self.selectCollection = (collect) => {
      self.selectedCollection = collect
    };

    self.newCollection = (observation) => {
      self.selectedCollection = OfflineActivityCollection.fromJson({userId: self.user.email, observation: observation});
      self.commands.push({icon: 'close', theme: 'md-icon-button', action: _cancel});
      self.commands.push({icon: 'save', theme: 'md-accent md-raised md-icon-button', action: _save});
    };

    function _cancel() {
      _clear();
    }

    function _clear() {
      $scope.selected.splice(0, self.allActivities.length);
      delete self.selectedCollection;
      self.commands.splice(0 , self.commands.length)
    }

    function _save(){
      self.selectedCollection.addActivities($scope.selected);
      self.collections.push(self.selectedCollection);
      _clear();
    }



    $scope.showPrompt = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
        .title('Nova Coleta')
        .textContent('Informe uma observação sobre a coleta:')
        .placeholder('Observação')
        .ariaLabel('Observation')
        .targetEvent(ev)
        .ok('Criar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function(result) {
        self.newCollection(result)
      }, function() {
        $scope.status = 'You didn\'t name your dog.';
      });
    };


    //SELEÇÃO DE ATIVIDADES PARA A COLETA--------------------------------------------------------
    $scope.selected = [];
    $scope.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    $scope.isIndeterminate = function() {
      return ($scope.selected.length !== 0 &&
        $scope.selected.length !== self.allActivities.length);
    };

    $scope.isChecked = function() {
      return $scope.selected.length === self.allActivities.length;
    };

    $scope.toggleAll = function() {
      if ($scope.selected.length === self.allActivities.length) {
        $scope.selected = [];
      } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        $scope.selected = self.allActivities.slice(0);
        console.log($scope.selected)
      }
    };
    //-------------------------------------------------------------------------------

  }
})();