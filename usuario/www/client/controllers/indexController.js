angular.module('app.controllers')

.controller('indexCtroller',['$scope','$state','perfilService',function($scope,$state,perfilService){

	$scope.loggeado = localStorage.getItem('usuario') != null;

	$scope.cerrarSesion = function(){
		localStorage.removeItem('usuario');
		$state.go('login');
		$scope.loggeado = false;	
	}

}]);