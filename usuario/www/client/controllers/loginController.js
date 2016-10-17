angular.module('app.controllers')

.controller('loginCtroller',['$scope','$state','$rootScope','userServices',function($scope,$state,$rootScope,userServices){
	
	var user = {};
	$scope.error = false;

	$scope.loggearse = function(username,password){

		user.username = username;
		user.password = password;

		console.log(user);

		console.log(user)
		userServices.loggearUsuario(user)
		.then(function(){
			$scope.error = false;
			$rootScope.loggeado = true;
			$state.go('canchas');
		})
		.catch(function(e){
			$scope.error = true;
			console.log("error de loggeo")
		})

	};

	$scope.saludar = function(){userServices.saludar()};


}]);