angular.module('app.controllers')

.controller('loginCtroller',['$scope','$state','$rootScope','userServices','$ionicLoading','gralFactory',function($scope,$state,$rootScope,userServices,$ionicLoading,gralFactory){
	
	var user = {};
	$scope.nuevoUsuario = {};
	$scope.error = false;

	$scope.loggearse = function(username,password){
        
        $ionicLoading.show();
        
		user.username = username;
		user.password = password;

		$ionicLoading.show();
        
		userServices.loggearUsuario(user)
            .then(function(){
                $ionicLoading.hide();
            
                $scope.error = false;
                $rootScope.loggeado = true;
                $state.go('canchas');
            })
            .catch(function(e){
                $ionicLoading.hide();
                
                $scope.error = true;
                console.log("error de loggeo");
            });

	};

	$scope.registrar = function(form){
        
        if(!form.$valid){
            gralFactory.showError('Se encontraron errores en el registro');
            return;
        }
        else{
            if($scope.nuevoUsuario.password !== form.passrepeat.$modelValue){
                gralFactory.showError('Las contraseñas no coinciden');
                return;
            }
            
            $ionicLoading.show();
            
            $scope.nuevoUsuario.fechaAlta = new Date();
            $scope.nuevoUsuario.estado = "Activo";
            $scope.nuevoUsuario.cantIncumplim = 3;
            
            userServices.
                registrarUsuario($scope.nuevoUsuario)
                    .then(function(d){
                        $ionicLoading.hide();
                        alert(d.msg);
                        fnLoggeo(d.u,d.pw);
                    })
                    .catch(function(e){
                        $ionicLoading.hide();
                        var err = e.data != undefined ? e.data : 'No pudo ser registrado';
                        gralFactory.showError(err);
                    });
        };
        
	}

    var fnLoggeo = function(username,password){
        
        $ionicLoading.show();
        
		user.username = username;
		user.password = password;

		$ionicLoading.show();
        
		userServices.loggearUsuario(user)
            .then(function(){
                $ionicLoading.hide();
            
                $scope.error = false;
                $rootScope.loggeado = true;
                $state.go('canchas');
            })
            .catch(function(e){
                $ionicLoading.hide();
                
                $scope.error = true;
                console.log("error de loggeo");
            });

	};
    
}]);