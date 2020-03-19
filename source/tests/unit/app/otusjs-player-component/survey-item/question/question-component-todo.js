describe('otusQuestion component', function() {

    var $ctrl;
    var Mock = {};

    describe('$onInit()', function() {
        beforeEach(function() {
            mockQuestion();
            $ctrl = _getComponentController();
        });

        it('should call the method TagComponentBuilderService.createTagElement', function() {
            spyOn(Mock.TagComponentBuilderService, 'createTagElement');
            $ctrl.$onInit();
            expect(Mock.TagComponentBuilderService.createTagElement).toHaveBeenCalledWith(Mock.question.objectType);
        });

    });

    function _getComponentController() {
        var $ctrl;
        module('otusjs.player.core');
        inject(function($rootScope, $componentController, _$injector_) {
            mockotusjsTagComponentBuilderService(_$injector_);
            scope = $rootScope.$new();
            $ctrl = $componentController('otusQuestion', {
                $scope: scope
            }, {
                itemData: {
                    objectType: 'IntegerQuestion'
                }
            });
        });
        return $ctrl;
    }

    function mockotusjsTagComponentBuilderService($injector) {
        Mock.otusjs.player.core.renderer.TagComponentBuilderService = $injector.get('otusjs.player.core.renderer.TagComponentBuilderService');
    }

    function mockQuestion() {
        Mock.question = {
            objectType: 'IntegerQuestion'
        };
    }

});
