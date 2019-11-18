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

    const CURRENT_ACTIVITY = 'Current_Activity';
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
      return sessionStorage.getItem('Auth_Token');
    }

    function setAuthToken(token) {
      return sessionStorage.setItem('Auth_Token', token);
    }

    function setCallbackAddress(url) {
      sessionStorage.setItem('Callback-Address', angular.copy(url));
    }

    function getCallbackAddress() {
      return sessionStorage.getItem('Callback-Address') ? sessionStorage.getItem('Callback-Address') : location.href;
    }

    function setCurrentActivity(id) {
      sessionStorage.setItem(CURRENT_ACTIVITY, id);
    }

    function getCurrentActivity() {
      return sessionStorage.getItem(CURRENT_ACTIVITY);
    }
  }
})();