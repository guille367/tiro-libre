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
            
            var myUploader = new uploader(document.getElementById('input-1'));
            var archivo = myUploader.input.files[0];

            var q = new FormData();
            q.append('input-1',archivo);

            generalServices.uploadImage(q)
            .then(function(d){
                $scope.nuevoUsuario.foto = archivo.name; 
            })
            .catch(function(e){
                if(archivo){
                    console.log(e);
                    gralFactory.showError('Ocurrio un error al subir la imagen');
                }
                $scope.nuevoUsuario.foto = 'logo_default.png';
            })
            .then(function(){
            
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
                
            });
            
        };
        
    };

    $scope.recuperarPw = function(form,username){

        $scope.errorMessage = undefined;
        $scope.message = undefined;

        if(!form.$valid){
            $scope.errorMessage = "Ingrese un usuario.";
        }
        else{
            $ionicLoading.show();

            userServices.recuperarPw(username)
                .then(function(d){
                    $ionicLoading.hide();
                    $scope.message = "Revise su correo electronico.";
                })
                .catch(function(e){
                    $ionicLoading.hide();
                    $scope.errorMessage = e.data.err;
                });

        }
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