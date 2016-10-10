angular.module('app.controllers')

.controller('indexCtroller',['$scope','$state','$rootScope','perfilService',function($scope,$state,$rootScope,perfilService){

	$rootScope.loggeado = localStorage.getItem('usuario') != null;

	$scope.cerrarSesion = function(){
		localStorage.removeItem('usuario');
		$state.go('login');
		$rootScope.loggeado = false;	
	}

}]);