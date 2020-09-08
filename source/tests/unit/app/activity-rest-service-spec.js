describe('ActivityRestService', function () {

  var Mock = {};
  var Injections = [];
  var service = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($injector) {
      Injections.$q = $injector.get('$q');
      Injections.$http = $injector.get('$http');
      Injections.SurveyApiService = $injector.get('SurveyApiService');
      Injections.$log = $injector.get('$log');
      service = $injector.get('ActivityRestService', Injections);
    });
    spyOn(Injections.SurveyApiService, 'getActivityUrl').and.returnValue('http://localhost');
    spyOn(Injections.SurveyApiService, 'getSurveyUrl').and.returnValue('http://localhost');
    Mock.test = "test";
  });

  it('service method should have a defined service', function () {
    expect(service).toBeDefined();
  });

  it('Methods should defined controller', function () {
    expect(service.getById).toBeDefined();
    expect(service.update).toBeDefined();
    expect(service.getSurveys).toBeDefined();
  });

  it('getById method should return promise', function () {
    expect(service.getById(Mock.test)).toBePromise();
    expect(Injections.SurveyApiService.getActivityUrl).toHaveBeenCalledTimes(1);
  });

  it('update method should return promise', function () {
    expect(service.update([Mock.test])).toBePromise();
    expect(Injections.SurveyApiService.getActivityUrl).toHaveBeenCalledTimes(1);
  });

  it('getSurveys method should return promise', function () {
    expect(service.getSurveys()).toBePromise();
    expect(Injections.SurveyApiService.getSurveyUrl).toHaveBeenCalledTimes(1);
  });

});
