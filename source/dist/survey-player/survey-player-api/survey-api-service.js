(function() {
  'use strict';

  angular.module('survey.player.api')
    .service('SurveyApiService', Service);

  Service.$inject = [
    '$cookies'
  ];

  function Service($cookies) {
    var self = this;

    self.getFileUploadUrl = getFileUploadUrl;
    self.getActivityUrl = getActivityUrl;
    self.getDatasourceUrl = getDatasourceUrl;
    self.getStatiVariableUrl = getStatiVariableUrl;
    self.getAuthToken = getAuthToken;
    self.setAuthToken = setAuthToken;
    self.setCallbackAddress = setCallbackAddress;
    self.getCallbackAddress = getCallbackAddress;
    self.setCurrentActivity = setCurrentActivity;
    self.getCurrentActivity = getCurrentActivity;
    self.clearSession = clearSession;

    var CURRENT_ACTIVITY = 'Current_Activity';
    var AUTH_TOKEN = 'Auth_Token';
    var CALLBACK_ADDRESS = 'Callback-Address';
    const HASHTAH = "HASHTAG";
    init();

    var _datasourceUrl;
    var _activityUrl;
    var _staticVariableUrl;
    var _fileUploadUrl;

    function init(){
      _datasourceUrl = $cookies.get('Datasource-Address');
      _activityUrl = $cookies.get('Activity-Address');
      _staticVariableUrl = $cookies.get('StaticVariable-Address');
      _fileUploadUrl = $cookies.get('FileUpload-Address');
    }

    function getDatasourceUrl() {
      return _datasourceUrl;
    }

    function getStatiVariableUrl() {
      return _staticVariableUrl;
    }

    function getActivityUrl() {
      return _activityUrl;
    }

    function getFileUploadUrl() {
      return _fileUploadUrl;
    }

    function getAuthToken() {
      return sessionStorage.getItem(AUTH_TOKEN);
    }

    function setAuthToken(token) {
      return sessionStorage.setItem(AUTH_TOKEN, angular.copy(token));
    }

    function setCallbackAddress(url) {
      sessionStorage.setItem(CALLBACK_ADDRESS, angular.copy(url.replace(HASHTAH, "#")));
    }

    function getCallbackAddress() {
      return sessionStorage.getItem(CALLBACK_ADDRESS) ? sessionStorage.getItem(CALLBACK_ADDRESS) : location.href;
    }

    function setCurrentActivity(id) {
      sessionStorage.setItem(CURRENT_ACTIVITY, angular.copy(id));
    }

    function getCurrentActivity() {
      return sessionStorage.getItem(CURRENT_ACTIVITY);
    }

    function clearSession() {
      sessionStorage.removeItem(CURRENT_ACTIVITY);
      sessionStorage.removeItem(AUTH_TOKEN);
      sessionStorage.removeItem(CALLBACK_ADDRESS);
    }
  }
})();