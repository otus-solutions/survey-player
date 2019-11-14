(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusFileUploadQuestionView', {
      template:'<md-content layout-padding><div layout=row><md-button class="md-primary md-raised" upload-tool=$ctrl.uploadConfig ng-disabled=$ctrl.view><md-icon md-font-set=material-icons>attach_file</md-icon>Adicionar Arquivos</md-button><md-button class="md-primary md-raised" ng-show="$ctrl.pendingList.length != 0" ng-click=$ctrl.uploadMultiple() ng-disabled="$ctrl.pendingCounter > 0"><md-icon md-font-set=material-icons>attach_file</md-icon>Enviar Todos</md-button></div><div md-whiteframe=3 layout=column md-padding><md-list layout=column class=md-dense flex><md-subheader class=md-no-sticky>Arquivos a Enviar</md-subheader><md-list-item ng-hide="$ctrl.pendingList.length != 0"><p>Nenhum arquivo selecionado</p><md-divider></md-divider></md-list-item><md-content ng-show="$ctrl.pendingList.length != 0" style="max-height: 300px;"><md-list-item ng-repeat="file in $ctrl.pendingList track by $index"><span class="md-subhead md-truncate">{{ file.name }}</span><div class=uploading-panel ng-if="file.status == \'uploading\'"><md-progress-circular class=md-secondary md-mode=indeterminate md-diameter=20px ng-if="file.status == \'uploading\'"></md-progress-circular></div><div class=action-panel flex=20 ng-if=!$ctrl.view><md-button class="md-icon-button md-secondary" aria-label="Enviar Arquivo" ng-click=$ctrl.uploadFile($index) ng-hide="file.status == \'uploading\'" ng-disabled="$ctrl.pendingCounter >= 5"><md-icon md-font-set=material-icons>file_upload</md-icon><md-tooltip md-direction=bottom>Enviar Arquivo</md-tooltip></md-button><md-button class="md-icon-button md-secondary" aria-label=Excluir ng-click=$ctrl.popFromPending($index) ng-hide="file.status == \'uploading\'"><md-icon md-font-set=material-icons>delete</md-icon><md-tooltip md-direction=bottom>Excluir</md-tooltip></md-button></div></md-list-item></md-content><md-divider></md-divider><md-divider></md-divider><md-content ng-show="$ctrl.sentFiles.length != 0" style="background-color:#ebebeb; margin-top: 25px;"><md-subheader class=md-no-sticky>Arquivos Enviados</md-subheader><md-list-item class=md-2-line ng-repeat="file in $ctrl.sentFiles track by $index"><div class=md-list-item-text layout=column><span class="md-subhead md-truncate">{{ file.name }}</span><p>Tamanho: {{ file.printableSize }}</p></div><div class=action-panel flex=20><md-button class="md-icon-button md-secondary" aria-label=Download ng-click=$ctrl.downloadFile($index)><md-icon md-font-set=material-icons>file_download</md-icon><md-tooltip md-direction=bottom>Download</md-tooltip></md-button><md-button class="md-icon-button md-secondary" aria-label=Delete ng-if=!$ctrl.view ng-click="$ctrl.deleteFile($index, $event)"><md-icon md-font-set=material-icons>delete_forever</md-icon><md-tooltip md-direction=bottom>Apagar Arquivo</md-tooltip></md-button></div></md-list-item><md-divider></md-divider></md-content></md-list></div></md-content>',
      controller: "otusFileUploadQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusFileUploadQuestionViewCtrl", Controller);

  Controller.$inject = [
    'otusjs.player.data.activity.CurrentItemService',
    'otusjs.utils.FileUploadFactory',
    '$scope',
    'otusjs.surveyItem.customAnswer.FileUploadAnswerFactory',
  ];

  function Controller(CurrentItemService, FileUploadService, $scope, FileUploadAnswerFactory) {
    var self = this;

    var _uploadInterface;
    var _pendingArrayControl;


    /* Public Interface */
    self.$onInit = onInit;
    self.downloadFile = downloadFile;
    self.view = true;

    function onInit() {

      var answerFiles = self.itemData.data.answer.value || [];
      self.sentFiles = FileUploadAnswerFactory.buildFromJson(answerFiles);
      self.pendingList = [];
      self.promise = 0;

      self.uploadConfig = {
        callback: _populatePendingList,
        type: 'any',
        multiple: true
      };
      _uploadInterface = FileUploadService.getUploadInterface();
      _pendingArrayControl = 0;
      self.pendingCounter = 0;
    }

    function downloadFile(idx) {
      var fileInfo = self.sentFiles[idx];
      _uploadInterface.getFile(fileInfo)
        .then(function(responseBlob) {
          var link = document.createElement('a');
          var downloadUrl = URL.createObjectURL(responseBlob);
          link.setAttribute('href', downloadUrl);
          link.download = responseBlob.name;
          document.body.appendChild(link);
          link.click();
        });
    }

    function _populatePendingList(filesArray) {
      self.pendingList = self.pendingList.concat(filesArray.map(function(file) {
        file.status = 'pending';
        file.control = _pendingArrayControl++;
        return file;
      }));
      _updateView();
    }

    function _updateView() {
      var phase = $scope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        return;
      } else {
        $scope.$apply();
      }
    }

  }
}());
