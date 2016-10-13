angular.module('myApp').controller('canchaController',
  ['$scope', '$uibModal', '$log', 'canchaService',
   function ($scope, $uibModal, $log, canchaService) {

    $scope.canchas = {};

    $scope.newCancha = {};
    $scope.Tcanchas = {};

    var getCanchas = function () {
      canchaService.getAll()
        .then(function(res){
          $scope.canchas = res;
          console.log($scope.Tcanchas);
        });
    }

    getCanchas();

    $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'canchaNuevo.html',
      controller: 'modalCanchaController',
      backdrop  : 'static',
   	  keyboard  : false,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };



  
}]);




angular.module('myApp').controller('modalCanchaController', function($scope, $uibModalInstance, $timeout, canchaService){

	$scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

    $scope.guardar = function (newCancha) {
    	console.log(newCancha);
      canchaService.create(newCancha);
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

});