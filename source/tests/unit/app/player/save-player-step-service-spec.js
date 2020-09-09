describe('SavePlayerStepService Suite Test', function () {
  let Mock = {};
  let Injections = [];
  let service = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($injector, $rootScope, $q) {
      Injections.ActivityFacadeService = $injector.get('otusjs.model.activity.ActivityFacadeService');
      Injections.SurveyClientService = $injector.get('SurveyClientService');
      Injections.IndexedDbStorageService = $injector.get('IndexedDbStorageService');
      Injections.SurveyApiService = $injector.get('SurveyApiService');
      Injections.$mdToast = $injector.get('$mdToast');
      Injections.$state = $injector.get('$state');
      Injections.STATE = $injector.get('STATE');

      service = $injector.get('SavePlayerStepService', Injections);

      _mockInitialize($rootScope, $q);
    });

    window.onbeforeunload = jasmine.createSpy();
  });

  it('check service', function () {
    expect(service).toBeDefined();
  });

  it('methods should defined', function () {
    expect(service.beforeEffect).toBeDefined();
    expect(service.effect).toBeDefined();
    expect(service.afterEffect).toBeDefined();
    expect(service.getEffectResult).toBeDefined();
  });

  it('beforeEffect method should return flowData', function () {
    spyOn(service, 'beforeEffect').and.callThrough();
    service.beforeEffect({}, {});
    expect(service.beforeEffect).toHaveBeenCalledTimes(1);
  });

  describe('effect method Suite Test', function () {

    function _spyOnSurveyClientService(mockPromise){
      Injections.ActivityFacadeService.surveyActivity = Mock.surveyActivity;
      spyOn(Injections.SurveyClientService, 'saveActivity').and.returnValue(mockPromise);
    }

    it('effect method should call $state go method', function () {
      _spyOnSurveyClientService(Mock.resolve);
      spyOn(Injections.SurveyApiService, 'getCallbackAddress').and.returnValue(location.origin);
      spyOn(Injections.$state, 'go');
      service.effect();
      Mock.$scope.$digest();
      expect(Injections.$state.go).toHaveBeenCalledWith(Injections.STATE.HOME);
    });

    it('effect method should set location.href in case callback address exists', function () {
      _spyOnSurveyClientService(Mock.resolve);
      spyOn(Injections.SurveyApiService, 'hasCallbackAddress').and.returnValue(true);
      spyOn(Injections.SurveyApiService, 'getCallbackAddress').and.returnValue(Mock.callbackAddress);
      service.effect();
      Mock.$scope.$digest();
      expect(Injections.SurveyApiService.getCallbackAddress).toHaveBeenCalledTimes(2);
    });

    it('effect method should not set location.href in case callback address does not exists', function () {
      _spyOnSurveyClientService(Mock.resolve);
      spyOn(Injections.SurveyApiService, 'hasCallbackAddress').and.returnValue(false);
      spyOn(Injections.SurveyApiService, 'getCallbackAddress').and.returnValue(Mock.callbackAddress);
      service.effect();
      Mock.$scope.$digest();
      expect(Injections.SurveyApiService.getCallbackAddress).toHaveBeenCalledTimes(1);
    });

    it('effect method should call $mdToast show method', function () {
      _spyOnSurveyClientService(Mock.reject);
      spyOn(Injections.$mdToast, 'show');
      service.effect();
      Mock.$scope.$digest();
      expect(Injections.$mdToast.show).toHaveBeenCalledTimes(1);
    });

  });

  it('afterEffect method should return flowData', function () {
    spyOn(service, 'afterEffect').and.callThrough();
    service.afterEffect({}, {});
    expect(service.afterEffect).toHaveBeenCalledTimes(1);
  });

  it('getEffectResult method should return flowData', function () {
    const flowData = {};
    const result = service.getEffectResult({}, flowData);
    expect(result).toBe(flowData);
  });


  function _mockInitialize($rootScope, $q) {
    Mock.$scope = $rootScope.$new();

    const deferredResolve = $q.defer();
    deferredResolve.resolve();
    Mock.resolve = deferredResolve.promise;

    const deferredReject = $q.defer();
    deferredReject.reject();
    Mock.reject = deferredReject.promise;

    Mock.surveyActivity = {};
    Mock.callbackAddress = 'http';
  }

});
