(function () {

  'use strict';

  angular.module('otusjs.player.component')
    .component('activityGroupCollection', {
      templateUrl: 'app/otusjs-player-component/activity-collect/group/activity-group-collect-template.html',
      controller: Controller,
      bindings: {
        selectedGroup: '=',
        user: '<',
        commands: '=',
        showCommands: '='
      }
    });

  Controller.$inject = [
    'otusjs.model.activity.GroupOfflineActivityCollection',
    'otusjs.model.activity.OfflineActivityCollection',
    '$scope',
    '$mdDialog',
    'CollectIndexedDbService',
    'SurveyApiService',
    'LoadingScreenService'
  ];

  function Controller(
    GroupOfflineActivityCollection,
    OfflineActivityCollection,
    $scope,
    $mdDialog,
    CollectIndexedDbService,
    SurveyApiService,
    LoadingScreenService) {
    var self = this;

    self.$onInit = onInit;
    self.newGroup = newGroup;
    self.selectGroup = selectGroup;
    self.back = back;


    function onInit() {
      LoadingScreenService.start();
      self.ready= false;
      self.groups = [];
      _listCollections();

    }

    function _restore() {
      self.selectedCollectionId = SurveyApiService.getSelectedCollection();
      if (self.selectedCollectionId){
        self.groups.forEach(function (group) {
          group.collections.forEach(function (collection) {
            if (collection.code === self.selectedCollectionId) {
              selectGroup(group);
              LoadingScreenService.finish();
            }
          })
        })
      } else {
        LoadingScreenService.finish();
      }
    }

    function newGroup() {
      let group = GroupOfflineActivityCollection.create();
      group.observation = self.observation;
      self.groups.push(group);
      selectGroup(group)
    }

    function selectGroup(group) {
      self.selectedGroup = group;
    }

    function back() {
      _listCollections();
      delete self.selectedGroup;
      _clear();
    }

    function _clear() {
      self.observation = '';
      delete self.selectedCollection;
      self.commands.splice(0, self.commands.length);
    }

    function _listCollections() {
      CollectIndexedDbService.getAllCollections(self.user.email).then(function (response) {
        _groupFactory(response)
        self.ready = true;
        LoadingScreenService.finish();
      }).catch(function () {
        LoadingScreenService.finish();
      });
    }

    function _groupFactory(collections) {
      self.groups = [];
      var objectMap = collections.reduce((result, collection) => {
        result[collection.groupId] = [...result[collection.groupId] || [], collection];
        return result;
      }, {});

      Object.getOwnPropertyNames(objectMap).forEach(function (groupId) {
        var groupCollection = GroupOfflineActivityCollection.fromJson({'_id': groupId, 'observation': objectMap[groupId][0].groupObservation, 'collections': objectMap[groupId]});
        self.groups.push(groupCollection)
      });

      _restore();

    }

  }
})();