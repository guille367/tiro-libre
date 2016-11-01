angular.module('app.controllers')

.controller('indexCtroller',['$scope','$state','userServices',function($scope,$state,userServices){

	$scope.loggeado = localStorage.getItem('usuario') != null;
    $scope.usuario = userServices.getUsuario();
    
    
	$scope.cerrarSesion = function(){
		
		userServices.cerrarSesion().then(function(){
          localStorage.removeItem('usuario');
          $scope.loggeado = false;
		  $state.go('login');
        });
        
	}

}]);