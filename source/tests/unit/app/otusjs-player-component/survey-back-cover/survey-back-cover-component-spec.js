describe('otusSurveyBackCover component', function () {
  let Mock = {};
  let Injections = [];
  let controller = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($controller, $injector, $rootScope) {
      Injections.$q = $injector.get('$q');
      Injections.$mdDialog = $injector.get('$mdDialog');
      Injections.$state = $injector.get('$state');
      Injections.STATE = $injector.get('STATE');
      Injections.PlayerService = $injector.get('otusjs.player.core.player.PlayerService');

      controller = $controller('otusSurveyBackCoverCtrl', Injections);

      _mockInitialize($rootScope, Injections.$q, Injections.STATE);
    });

  });

  it('check controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods should defined', function () {
    expect(controller.$onInit).toBeDefined();
    expect(controller.finalize).toBeDefined();
    expect(controller.stop).toBeDefined();
  });

  describe('$onInit method Suite Test', function () {

    it('$onInit method should call PlayerService.getCurrentSurvey method', function () {
      spyOn(Injections.PlayerService, 'getCurrentSurvey').and.returnValue(Mock.getCurrentSurvey);
      controller.$onInit();
      expect(Injections.PlayerService.getCurrentSurvey).toHaveBeenCalledTimes(2);
      expect(controller.title).toBeDefined();
    });

    it('$onInit method should call $state go method', function () {
      spyOn(Injections.PlayerService, 'getCurrentSurvey').and.returnValue(null);
      spyOn(Injections.$state, 'go');
      controller.$onInit();
      expect(Injections.PlayerService.getCurrentSurvey).toHaveBeenCalledTimes(1);
      expect(controller.title).not.toBeDefined();
      expect(Injections.$state.go).toHaveBeenCalledWith(Mock.STATE.PLAY);
    });

  });

  describe('finalize method Suite Test', function () {

    function _callFinalize(hasCallbackAddress){
      spyOn(Injections.PlayerService, 'eject');
      spyOn(Injections.PlayerService, 'getConstants').and.returnValue(Mock.PLAYER_SERVICE_CONSTANTS);
      spyOn(Injections.PlayerService, 'hasCallbackAddress').and.returnValue(hasCallbackAddress);
      spyOn(Injections.PlayerService, 'setReasonToFinishActivity').and.callThrough();
      controller.finalize();
      expect(Injections.PlayerService.eject).toHaveBeenCalledTimes(1);
    }

    it('finalize method should call only PlayerService eject method in case has callback address', function () {
      _callFinalize(true);
      expect(Injections.PlayerService.setReasonToFinishActivity).not.toHaveBeenCalled();
    });

    it('finalize method should call PlayerService eject and setReasonToFinishActivity method in case has no callback address', function () {
      _callFinalize(false);
      expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledTimes(1);
    });

  });

  describe('stop method Suite Test', function () {

    function _callStop(hasCallbackAddress){
      spyOn(Injections.$mdDialog, 'show').and.returnValue(Mock.resolve);
      spyOn(Injections.PlayerService, 'stop');
      spyOn(Injections.PlayerService, 'getConstants').and.returnValue(Mock.PLAYER_SERVICE_CONSTANTS);
      spyOn(Injections.PlayerService, 'hasCallbackAddress').and.returnValue(hasCallbackAddress);
      spyOn(Injections.PlayerService, 'setReasonToFinishActivity').and.callThrough();

      controller.stop();
      Mock.$scope.$digest();

      expect(Injections.PlayerService.stop).toHaveBeenCalledTimes(1);
    }

    it('stop method should call only PlayerService stop method in case has callback address', function () {
      _callStop(true);
      expect(Injections.PlayerService.setReasonToFinishActivity).not.toHaveBeenCalled();
    });

    it('stop method should call PlayerService stop and setReasonToFinishActivity methods in case has no callback address', function () {
      _callStop(false);
      expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledTimes(1);
    });

    it('stop method should not call PlayerService stop in case cancel dialog', function () {
      spyOn(Injections.$mdDialog, 'show').and.returnValue(Mock.reject);
      spyOn(Injections.PlayerService, 'stop');
      controller.stop();
      Mock.$scope.$digest();
      expect(Injections.PlayerService.stop).not.toHaveBeenCalled();
    });

  });


  function _mockInitialize($rootScope, $q, STATE) {
    Mock.$scope = $rootScope.$new();

    const deferredResolve = $q.defer();
    deferredResolve.resolve();
    Mock.resolve = deferredResolve.promise;

    const deferredReject = $q.defer();
    deferredReject.reject();
    Mock.reject = deferredReject.promise;

    Mock.STATE = STATE;
    Mock.PLAYER_SERVICE_CONSTANTS = Test.utils.data.PLAYER_SERVICE_CONSTANTS;
    Mock.getCurrentSurvey = Test.utils.data.getCurrentSurvey;
  }
});
