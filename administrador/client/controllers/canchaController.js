angular.module('myApp').controller('canchaController',
  ['$scope', '$uibModal', '$log', 'canchaService',
   function ($scope, $uibModal, $log, canchaService) {

    $scope.canchas = [
    	{'nombre':'Libertadores', 'cantJug': '14', 'piso': 'Pista', 'techo':'si', 'imagen': 'imagen', 'pdiurno': '280', 'pnocturno': '350',
    	 'estado': 'Activo',},
        {'nombre':'Monumental', 'cantJug': '16', 'piso': 'Sintetico', 'techo':'no', 'imagen': 'imagen', 'pdiurno': '380', 'pnocturno': '550',
    	 'estado': 'Activo',}
    ];

    $scope.newCancha = {};
    $scope.Tcanchas = {};

    var getCanchas = function () {
      canchaService.getAll()
        .then(function(res){
          $scope.Tcanchas = res;
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




angular.module('myApp').controller('modalCanchaController', function($scope, $uibModalInstance, $timeout){

	$scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

    $scope.guardar = function (cancha) {
    	console.log(cancha);
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

});