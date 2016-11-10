angular.module('app.controllers')

.controller('loginCtroller',['$scope','$rootScope','$state','userServices','$ionicLoading','gralFactory',function($scope,$rootScope,$state,userServices,$ionicLoading,gralFactory){
    
    var user = {};
    $scope.nuevoUsuario = {};
    $scope.error = false;

    $scope.loggearse = function(username,password){
        fnLoggeo(username,password)
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
            $scope.nuevoUsuario.cantIncumplim = 0;
            $scope.nuevoUsuario.foto = '';
            
            userServices.
                registrarUsuario($scope.nuevoUsuario)
                    .then(function(d){
                        fnLoggeo(d.username,d.password);
                    })
                    .catch(function(e){
                        $ionicLoading.hide();
                        var err = e.data != undefined ? e.data : 'No pudo ser registrado';
                        gralFactory.showError(err);
                    });
        };
        
    }

    var fnLoggeo = function(username,password){
        
        
        user.username = username;
        user.password = password;
        $ionicLoading.show();
        
        userServices.loggearUsuario(user)
            .then(function(){
                $ionicLoading.hide();
                $scope.error = false;
                $rootScope.loggeado = true;
                gralFactory.showMessage('Bienvenido!');
                $state.go('canchas');
            })
            .catch(function(e){
                $ionicLoading.hide();
                $scope.error = true;
                console.log("error de loggeo");
            });

    };
    
}]);