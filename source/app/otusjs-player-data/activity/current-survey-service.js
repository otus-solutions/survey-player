(function () {
  'use strict';

  angular
    .module('otusjs.player.data.activity')
    .service('otusjs.player.data.activity.CurrentSurveyService', Service);

  Service.$inject = [
    'otusjs.model.activity.ActivityFacadeService'
  ];

  function Service(ModelActivityFacadeService) {
    var self = this;

    /* Public Interface */
    self.getSurvey = getSurvey;
    self.getAnswerByItemID = getAnswerByItemID;
    self.getItems = getItems;
    self.getNavigations = getNavigations;
    self.getNavigationByOrigin = getNavigationByOrigin;
    self.getItemByCustomID = getItemByCustomID;
    self.getItemByTemplateID = getItemByTemplateID;
    self.getGroupItemsByMemberID = getGroupItemsByMemberID;
    self.getSurveyDatasources = getSurveyDatasources;
    self.getStaticVariableList = getStaticVariableList;
    self.initialize = initialize;
    self.finalize = finalize;
    self.save = save;
    self.clearSkippedAnswers = clearSkippedAnswers;
    self.getNavigationTracker = getNavigationTracker;
    self.getWholeTemplateStaticVariableList = getWholeTemplateStaticVariableList;

    function getSurvey() {
      return ModelActivityFacadeService.surveyActivity;
    }

    function getSurveyDatasources() { //question datasources
      return getSurvey().getDataSources();
    }

    function getStaticVariableList() {
      return getSurvey().getStaticVariableList();
    }

    function getAnswerByItemID(id) {
      return ModelActivityFacadeService.getFillingByQuestionID(id);
    }

    function getItems() {
      return ModelActivityFacadeService.surveyActivity.getItems();
    }

    function getItemByCustomID(customID) {
      var fetchedItem = null;

      getItems().some(function (item) {
        if (item.customID === customID) {
          fetchedItem = item;
          return true;
        }
      });

      return fetchedItem;
    }

    function getItemByTemplateID(templateID) {
      return getItems().find(function (item) {
        return item.templateID === templateID;
      });
    }

    function getGroupItemsByMemberID(id) {
      return getSurvey().getGroupItemsByItemID(id);
    }

    function getNavigations() {
      return ModelActivityFacadeService.surveyActivity.getNavigations();
    }

    function getNavigationByOrigin(origin) {
      var fetchedNavigation = null;

      getNavigations().some(function (navigation) {
        if (navigation.origin === origin) {
          fetchedNavigation = navigation;
          return true;
        }
      });

      return fetchedNavigation;
    }

    function initialize() {
      ModelActivityFacadeService.initializeActivitySurvey();
    }

    function finalize() {
      ModelActivityFacadeService.finalizeActivitySurvey();
    }

    function save() {
      ModelActivityFacadeService.saveActivitySurvey();
    }

    function clearSkippedAnswers() {
      ModelActivityFacadeService.clearSkippedAnswers();
    }

    function getNavigationTracker() {
      return ModelActivityFacadeService.getNavigationTracker();
    }

    function getWholeTemplateStaticVariableList() {
      return ModelActivityFacadeService.getWholeTemplateVariableList();
    }

  }
}());
