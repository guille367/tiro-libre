angular.module('app.controllers')

.controller('indexCtroller',['$scope','$state','$rootScope','userServices',function($scope,$state,$rootScope,userServices){

	$rootScope.loggeado = localStorage.getItem('usuario') != null;

	$scope.cerrarSesion = function(){
		localStorage.removeItem('usuario');
		userServices.loggearUsuario({});
		$state.go('login');
		$rootScope.loggeado = false;	
	}

}]);