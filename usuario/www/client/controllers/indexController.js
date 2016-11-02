angular.module('app.controllers')

.controller('indexCtroller',['$scope','$state','$rootScope','userServices',function($scope,$state,$rootScope,userServices){

	$rootScope.loggeado = localStorage.getItem('usuario') != null;

	$scope.cerrarSesion = function(){
		
		userServices.cerrarSesion()
            .then(function(){
                localStorage.removeItem('usuario');
                $rootScope.loggeado = false;	
                $state.go('login');
            });

	}

}]);