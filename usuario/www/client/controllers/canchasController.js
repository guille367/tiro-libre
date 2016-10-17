angular.module('app.controllers')

.controller('canchasCtroller',['$scope','$state','canchaService',function($scope,$state,canchaService){

	$scope.canchas = {};

	canchaService.getCanchas()
		.then(function(d){
			$scope.canchas = d.data;
			console.log($scope.canchas);
		})	
		.catch(function(e){
			console.log(e);
			console.log('error');
		});

	$scope.verDisponibilidad = function(c){
		canchaService.setCancha(c);
		$state.go('calendario');
	}

}]);