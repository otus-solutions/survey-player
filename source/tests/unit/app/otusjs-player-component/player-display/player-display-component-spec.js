describe('otusPlayerDisplay Component Test unit', function () {
  let Mock = {};
  let Injections = [];
  let controller;

  const SURVEY_TEMPLATE_ID = 'ABC';
  const ELEMENT_TEMPLATE = '<div id="pagePlayer"></div>';

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function (_$controller_, _$injector_, $rootScope, $compile) {
      _mockInitialize($rootScope);
      Injections.$scope = Mock.$scope;
      Injections.$document = _$injector_.get('$document');
      Injections.$element = Mock.$element;
      Injections.$compile = $compile;
      Injections.$location = _$injector_.get('$location');
      Injections.$anchorScroll = _$injector_.get('$anchorScroll');
      Injections.ActivityFacadeService = _$injector_.get('otusjs.player.data.activity.ActivityFacadeService');
      Injections.PlayerService = _$injector_.get('otusjs.player.core.player.PlayerService');
      Injections.OnProcessingService = _$injector_.get('otusjs.player.core.player.OnProcessingService');

      controller = _$controller_('otusPlayerDisplayCtrl', Injections);
    });
  });

  it('check controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods should defined', function () {
    expect(controller.$onInit).toBeDefined();
    expect(controller.loadItem).toBeDefined();
    expect(controller.remove).toBeDefined();
    expect(controller.onProcessingPlayer).toBeDefined();
  });

  describe('Methods Suite Test', function () {

    beforeEach(function(){
      spyOn(Injections.PlayerService, 'getItemData').and.returnValue(Mock.itemsData);
      controller.$onInit();
    });

    it('methods should $onInit execute', function () {
      expect(Injections.$scope.$parent.$ctrl.playerDisplay).toEqual(controller);
      expect(Injections.$scope.itemData.templateID).toEqual('');
      expect(Injections.$scope.questions).toEqual([]);
      expect(controller.ids).toEqual([SURVEY_TEMPLATE_ID]);
    });

    it('loadItem method should call $element find', function () {
      spyOn(Injections.$element, 'find').and.returnValue(Mock.$element);
      controller.loadItem(Mock.itemsData);
      expect(Injections.$element.find).toHaveBeenCalledTimes(1 + Mock.itemsData.length);
    });

    it('remove method should call $element find', function () {
      spyOn(Injections.$element, 'find').and.returnValue(Mock.$element);
      controller.remove(Mock.itemsData);
      expect(Injections.$element.find).toHaveBeenCalledTimes(1);
    });

    it('onProcessingPlayer method should call OnProcessingService method', function () {
      spyOn(Injections.OnProcessingService, 'onProcessing');
      controller.onProcessingPlayer();
      expect(Injections.OnProcessingService.onProcessing).toHaveBeenCalledTimes(1);
    });
  });


  function _mockInitialize($rootScope) {
    Mock.$scope = $rootScope.$new();
    Mock.$scope.$parent.$ctrl = {};
    Mock.itemsData = [ {templateID: SURVEY_TEMPLATE_ID} ];
    Mock.$element = angular.element(ELEMENT_TEMPLATE);
  }
});
