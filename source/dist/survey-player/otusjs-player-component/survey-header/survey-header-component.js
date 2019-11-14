(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusSurveyHeader', {
      template:'<md-toolbar layout=row class=md-whiteframe-5dp layout-align="center center"><div layout=row layout-align="start center" flex><span hide-xs flex-gt-xs=10 flex-gt-sm=5></span><div class=md-padding><img src=http://nexus.inf.otus-solutions.com.br/repository/otus-solutions-assets/images/coruja_pesquisadora.png height=50px class=toolbar-icon></div><md-chips><md-chip>{{ $ctrl.surveyIdentity.acronym }}</md-chip></md-chips><div class=md-body-2><span>{{ $ctrl.surveyIdentity.name }}</span></div></div><div hide-xs layout=row layout-margin layout-align="center center"><md-icon md-svg-icon=file-document-box></md-icon><div><span>{{ $ctrl.participantData.name }}</span> <span>|</span> <span>{{ $ctrl.participantData.recruitmentNumber }}</span></div></div></md-toolbar><md-toolbar hide-gt-xs layout=row layout-align="center center" class=md-whiteframe-5dp flex><div layout=row layout-margin layout-align="center center"><md-icon md-svg-icon=file-document-box></md-icon><div><span class=md-caption>{{ $ctrl.participantData.name }}</span> <span>|</span> <span class=md-caption>{{ $ctrl.participantData.recruitmentNumber }}</span></div></div></md-toolbar>',
      controller: Controller,
      bindings: {
        surveyIdentity: '<'
      }
    });

  Controller.$inject = [
    'otusjs.player.data.activity.ActivityFacadeService'
  ];

  function Controller(ActivityFacadeService) {
    var self = this;

    /* Public methods */
    self.$onInit = onInit;

    function onInit() {
      self.activity = ActivityFacadeService.getCurrentSurvey().getSurvey();
      self.surveyIdentity = self.activity.getIdentity();
      self.participantData = self.activity.participantData;

      if (self.activity.interviews.length) {
        self.interviewer = self.activity.interviews[self.activity.interviews.length - 1].interviewer;
        self.interviewer.fullname = self.interviewer.getFullname();
      }
    }
  }
}());
