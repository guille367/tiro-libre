angular.module('app.controllers')

.controller('contactoCtroller',['$scope','generalServices',function($scope,generalServices){

	$scope.datos = {}

	generalServices.getDatosClub()
		.then(function(d){
			$scope.datos = d.data[0];
		});

}]);