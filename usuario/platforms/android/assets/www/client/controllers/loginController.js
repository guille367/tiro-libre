angular.module('app.controllers')

.controller('loginCtroller',['$scope','$state','$rootScope','perfilService',function($scope,$state,$rootScope,perfilService){
	
	var user = {};

	$scope.loggearse = function(){

		user.usuario = $scope.usuario;
		user.pw = $scope.pw;
		perfilService.loggearUsuario(user);
		$rootScope.loggeado = true;
		$state.go('canchas');
	}


}]);