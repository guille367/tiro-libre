angular.module('myApp').controller("configuracionController", function($scope, configuracionService, $rootScope){

	$scope.configuracion = {};
	$scope.configOriginal = {};
	$scope.read = true;

	var getConfig = function () {
      configuracionService.getAll()
        .then(function(res){
          $scope.configuracion = res[0];
          console.log($scope.configuracion);
        });
    }

    getConfig();
    
	$scope.guardar = function(configuracion, form){
		if (form.$valid){
			configuracionService.save(configuracion).then(function(res){
				$rootScope.config = configuracion;
        	});
			$scope.read = true;
      }else{
        return;
      };

	};

	$scope.cancelar = function(){
		$scope.read = true;	
		getConfig();

	};

	$scope.modificar = function(configuracion){
		$scope.read = false;

	};

});