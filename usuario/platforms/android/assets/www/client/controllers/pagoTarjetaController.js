angular.module('app')

.controller('pagoTarjetaCtroller',['$scope','$ionicModal',function($scope,$ionicModal){

	$scope.loggear = function(e){
		$ionicModal.close();
		console.log(e);
	}

}]);