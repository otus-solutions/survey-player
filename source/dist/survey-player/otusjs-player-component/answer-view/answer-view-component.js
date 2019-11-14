(function () {
  angular.module('otusjs.player.component')
    .component('answerView', {
      template:'<md-card flex layout=column><md-toolbar layout=row layout-align="start center" ng-class=$ctrl.hueClass><md-button class="md-icon-button md-whiteframe-3dp" ng-click=$ctrl.goingBack() ng-if="!$ctrl.isItem() && $ctrl.view"><md-icon md-font-set=material-icons class="material-icons ng-binding md-layoutTheme-theme">edit</md-icon><md-tooltip md-direction=down>Editar questão</md-tooltip></md-button><md-button class="md-icon-button md-whiteframe-3dp" ng-if="!$ctrl.isItem() && !$ctrl.view"><md-icon md-font-set=material-icons class="material-icons ng-binding md-layoutTheme-theme">question_answer</md-icon><md-tooltip md-direction=down>Questão respondida</md-tooltip></md-button><md-card-header-text ng-if=!$ctrl.view layout-align="start center" layout=column style="display: flex" layout-fill class=truncate flex=50><otus-label class="md-title truncate" item-label=$ctrl.label style="width: 95%"></otus-label><span class="md-caption truncate" ng-if=$ctrl.answer style="margin-top:-5px; width: 95%">{{$ctrl.answer}}</span> <span class="md-caption truncate" ng-if=$ctrl.comment style="margin-top:-5px; width: 95%">{{$ctrl.comment}}</span></md-card-header-text><div class=md-toolbar-tools layout=row flex layout-align="center center"><h4 flex ng-if=$ctrl.view style="margin: 0 !important;text-align: center">Modo de visualização</h4><span flex ng-if=!$ctrl.view></span><md-button class=md-icon-button ng-click=$ctrl.viewQuestion()><md-icon md-font-set=material-icons class="material-icons ng-binding md-layoutTheme-theme">{{$ctrl.iconEye}}</md-icon><md-tooltip md-direction=down>{{$ctrl.iconTooltip}}</md-tooltip></md-button></div></md-toolbar><div ng-if=$ctrl.view><md-card-header layout=row flex><md-card-header-text layout-align="center start" ng-if=$ctrl.view layout-padding layout-margin><otus-label class="md-title md-headline" layout-padding item-label=$ctrl.labelFormatted></otus-label></md-card-header-text></md-card-header><md-card-content layout=row layout-align=space-between flex><otus-misc-item ng-if="$ctrl.isItem() && ($ctrl.itemData.objectType === \'ImageItem\')" item-data=$ctrl.itemData layout=column flex></otus-misc-item><md-content ng-if=!$ctrl.isItem() layout=column layout-fill flex><div layout=row flex><md-tabs md-dynamic-height layout=column flex=95><md-tab label=Resposta><md-content class=md-padding bind-html-compile=$ctrl.template></md-content></md-tab><md-tab label=Metadado><md-content class=md-padding><md-content layout-padding style="margin-left: 10px"><md-radio-group id=metadataGroupRadioGroup ng-model=$ctrl.itemData.data.metadata.value layout-padding flex><md-content value={{option.value}} ng-repeat="option in $ctrl.itemData.metadata.options" layout=row style="margin: 10px"><md-radio-button aria-label={{option.label}} value={{option.value}} style="outline: none;border: 0;" flex ng-disabled=true><otus-label item-label=option.label.ptBR.formattedText></otus-label></md-radio-button></md-content></md-radio-group></md-content></md-content></md-tab><md-tab label=Comentário><md-content class=md-padding><md-content layout-padding><div layout=row><md-input-container md-no-float class=md-block flex><textarea ng-model=$ctrl.itemData.data.comment ng-disabled=true aria-label=Comentário></textarea></md-input-container></div></md-content></md-content></md-tab></md-tabs></div></md-content></md-card-content></div></md-card>',
      controller: "answerViewCtrl as $ctrl",
      bindings: {
        icon: '<',
        question: '@',
        itemData: '<',
        goBack: "&"
      }
    }).controller("answerViewCtrl", Controller);

  Controller.$inject = [
    'ICON',
    '$filter',
    'otusjs.player.core.player.PlayerService',
    'otusjs.player.core.renderer.TagComponentBuilderService'
  ];

  function Controller(ICON, $filter, PlayerService, TagComponentBuilderService) {
    var self = this;

    self.$onInit = onInit;
    self.goingBack = goingBack;
    self.viewQuestion = viewQuestion;
    self.isQuestion = isQuestion;
    self.isItem = isItem;


    function onInit() {
      self.hueClass='md-primary';
      self.iconEye = 'remove_red_eye';
      self.iconTooltip = 'Visualizar questão';
      self.view = false;
      self.itemData = angular.copy(self.itemData);
      _constructor();
    }

    function _constructor() {
      self.template = TagComponentBuilderService.createTagElement(self.itemData.objectType, true);
      self.itemData = angular.copy(self.itemData);
      self.icon = ICON[self.icon];
      if(self.itemData.isQuestion()){
        _metadadaBuilder();

          self.answer = _containMetadada() ? 'Metadado: '+  self.METADADA[self.itemData.data.metadata.value - 1] : 'Resposta: '+_formatAnswer();
          self.comment = self.itemData.data.comment ? 'Contém comentário(s)': '';

        self.label = self.itemData.label.ptBR.plainText;
        self.labelFormatted = self.itemData.label.ptBR.formattedText;
      } else if(self.itemData.objectType === "TextItem"){
        self.txtqst = "txtqst"
        self.label = self.itemData.value.ptBR.plainText;
        self.labelFormatted = self.itemData.value.ptBR.formattedText;
      } else if(self.itemData.objectType === "ImageItem"){
        self.label = "[IMAGEM]";
      }

    }



    function _containMetadada() {
      return self.itemData.data.metadata.value !== null ? true : false;
    }

    function _metadadaBuilder() {
      self.METADADA = [];
      self.itemData.metadata.options.forEach(function(option) {
        self.METADADA.push(option.label.ptBR.plainText);
      })
    }

    function goingBack() {
      PlayerService.setGoBackTo(self.itemData.templateID);
      self.goBack();
    }

    function viewQuestion() {
      self.view = !self.view;
      if(self.view){
        self.iconTooltip = 'Ocultar questão';
        self.hueClass = 'md-accent';
        self.iconEye = 'visibility_off';
      } else {
        self.iconTooltip = 'Visualizar questão';
        self.hueClass = 'md-primary'
        self.iconEye = 'remove_red_eye';
      }
    }

    function formatDate(value) {
      var format = 'dd/MM/yyyy'
      return value ? $filter('date')(new Date(value), format): "";
    }

    function formatTime(value) {
      var format = 'HH:mm';
      return value ? $filter('date')(new Date(value), format) : "";
    }

    function formatSingleSelection() {
      var _answer = '';
      self.itemData.options.find(function(option){
        if(option.value === parseInt(self.itemData.data.answer.value)){
          _answer =  self.itemData.options[option.value - 1].label.ptBR.plainText;
        }
      });
      return _answer;
    }

    function formatFileUpload() {
      var _answer = "";
      if(self.itemData.data.answer.value){
        self.itemData.data.answer.value.forEach(function(value){
          _answer = _answer + angular.copy(value.name) + "; ";
        });
      }
      return  _answer;
    }

    function isQuestion() {
      return (self.itemData.objectType === 'ImageItem') || (self.itemData.objectType === 'TextItem') ? false : true;
    }

    function isItem() {
      return (self.itemData.objectType === 'ImageItem') || (self.itemData.objectType === 'TextItem') ? true : false;
    }

    function _formatAnswer() {
      var answer = "";
        switch (self.icon){
          case "date_range":
            answer = formatDate(self.itemData.data.answer.value);
            break;
          case "access_time":
            answer = formatTime(self.itemData.data.answer.value);
            break;
          case "radio_button_checked":
            answer = formatSingleSelection();
            break;
          case "check_box":
            answer = "Multiplas respostas, clique em visualizar questão.";
            break;
          case "filter_none":
            answer = "Multiplas respostas, clique em visualizar questão.";
            break;
          case "filter_1":
            answer = "Multiplas respostas, clique em visualizar questão.";
            break;
          case "attach_file":
            answer = formatFileUpload();
            break;
          default:
            answer = self.itemData.data.answer.value !== null ? self.itemData.data.answer.value : '';
        }

      return answer;

    }
  }
}());
