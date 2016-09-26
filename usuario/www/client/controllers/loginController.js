angular.module('app.controllers')

.controller('loginCtroller',['$scope','$state','perfilService',function($scope,$state,perfilService){
	
	var user = {};

	$scope.loggearse = function(){

		user.usuario = $scope.usuario;
		user.pw = $scope.pw;
		perfilService.loggearUsuario(user);
		$state.go('canchas');
	}


}]);