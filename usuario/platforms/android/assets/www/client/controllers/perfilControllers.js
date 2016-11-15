angular.module('app.controllers', ['ionic', 'ngAnimate', 'ui.rCalendar',])
 
.controller('misDatosController',['userServices','$scope','$ionicPopup','$state','gralFactory','userServices','generalServices','$ionicLoading'
	,function (userServices,$scope,$ionicPopup,$state,gralFactory,userServices,generalServices,$ionicLoading) {

	$scope.usuario = userServices.getUsuario();
	$scope.nuevoUsuario = angular.copy($scope.usuario);

	$scope.nuevoUsuario.password = '';
	$scope.nuevoUsuario.fechaNac = new Date($scope.usuario.fechaNac);

	var Foto = function(){
		console.log($scope.usuario);
		if ($scope.usuario.foto == ""){
			$scope.usuario.foto = "logo_default.png" 
		};		
	};

	Foto();

    $scope.openModif = function(){
    	$state.go('modifperfil');
    }

    $scope.closeModif = function(){
    	$state.go('perfil');
    }

    $scope.confirmarModif = function(form){
    	if(!form.$valid)
    		gralFactory.showError('Verifique sus datos');
    	else{
            
            if($scope.usuario.password != $scope.nuevoUsuario.password){
            	gralFactory.showError('Password incorrecta');
            	return;
            }

            $ionicLoading.show();
            
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
                userServices.modifPerfil($scope.nuevoUsuario)
    			.then(function(d){
                    $ionicLoading.hide();
    				localStorage.setItem('usuario',JSON.stringify($scope.nuevoUsuario));
    				gralFactory.showMessage('Perfil modificado!');
    				$state.go('perfil');
    			})
    			.catch(function(e){
                    $ionicLoading.hide();
    				gralFactory.showError(e.data.err);
    			});
                
            });
            
    	};
    };

    $scope.setImage = function(f){
    	var myUploader = new uploader(document.getElementById('input-1'));
    	var q = new FormData();
    	q.append('input-1',f[0]);

    	userServices.sendPhoto(q);
    	//myUploader.send();
    }
    
}])



.controller('misEquiposCtroller', ['$scope','$ionicModal', '$stateParams','torneosService', 'userServices','gralFactory','$ionicPopup','equiposService',function($scope,$ionicModal,$stateParams,torneosService, userServices,gralFactory, $ionicPopup,equiposService){
	
	$scope.torneos = {};
	$scope.misTorneos = [];
    $scope.equipos = [];
    $scope.equipo = [];
    $scope.fechaActual = new Date();
    $scope.usuario = userServices.getUsuario();

    var getTorneos = function(){
        torneosService.getAll()
            .then(function(d){
                $scope.torneos = d.data;
                angular.forEach($scope.torneos, function(value, key){
                    angular.forEach(value.equipos, function(value2, key2){
                    	if(value2.usuarioResp == $scope.usuario.username){
                    		$scope.equipos.push(value2) ;
                    		$scope.misTorneos.push(value);
                    	};
                	});
                });
                $scope.misTorneos = $scope.misTorneos.filter($scope.quitarTorneo);                
            })  
            .catch(function(e){
                var err = e.data ? e.data : 'Vuelva a intentar más tarde';
                gralFactory.showError(err);
            });
    }
    getTorneos();

    $scope.quitarTorneo = function(objeto){
	    var dif = moment(objeto.fechaFin).diff(moment($scope.fechaActual), 'day');
	    if(dif < 0){
	      return false;
	    }else{
	      return true;
	    };

	};

	$scope.eliminarJugador = function(eq, jug){
		console.log(jug);
		angular.forEach($scope.misTorneos, function(value, key){
           	if(value._id == eq.idTorneo){
           		var dif = moment(value.fechaCierreInscripcion).diff(moment($scope.fechaActual), 'day');
		    	if(dif >= 0 ){
	           		if(value.jugTitulares < eq.jugadores.length){
	           			angular.forEach(eq.jugadores, function(value, key){
	           				if(value.dni == jug){
	           					eq.jugadores.splice(key,1);
	           					equiposService.save(eq);
	           				};
	           			});
	           		}else{
	           			gralFactory.showError('La cantidad de jugadores minima es: ' + value.jugTitulares);
	           			
	           		};
	           	}else{
	           		gralFactory.showError('La fecha de inscripción finalizó');
	           	};
            };
        });
	};

	$scope.nuevoJugador = function(eq){
		$scope.existe = false;
		angular.forEach($scope.misTorneos, function(value, key){
		    if(value._id == eq.idTorneo){
		    	var dif = moment(value.fechaCierreInscripcion).diff(moment($scope.fechaActual), 'day');
		    	if(dif >= 0 ){
			    	var limiteJugadores = value.jugTitulares + value.jugSuplentes;
			        if(limiteJugadores > eq.jugadores.length){
			        	$scope.jugadores = [];
			       		$scope.data ={};
						$ionicPopup.show({
						    template: '<b>DNI</b>: <input type="number" ng-model="data.dni"> <br> <b>Nombre/Apellido</b><input type="text" ng-model="data.nombre">',
						    title: 'Crear nuevo Jugador',
						    subTitle: 'Ingrese el nuevo jugador',
						    scope: $scope,
						    buttons: [
						    	{
							        text: '<b>Guardar</b>',
							        type: 'button-positive',
							        onTap: function(e) {
								        if($scope.data.dni >=10000000 && $scope.data.dni <=99999999 && $scope.data.dni != null && $scope.data.nombre != null && $scope.data.nombre != ""){
								        	angular.forEach($scope.misTorneos, function(value, key){
								        		if(value._id == eq.idTorneo){
								        			angular.forEach(value.equipos, function(value2, key2){
								        				angular.forEach(value2.jugadores, function(value3, key3){
								        					if(value3.dni == $scope.data.dni){
								        						$scope.existe = true;
								        					};
								        				});
								        			});
								        		};
								        	});
								        }else{
								        	gralFactory.showError('Verifique los datos ingresados');
								        	return;
								        };	

								        if($scope.existe == false){						        	
									        eq.jugadores.push($scope.data);
								        }else{
								        	gralFactory.showError('El DNI ya se encuentra registrado para otro equipo');
								        };
							        }
						      	},
						      { text: 'Cerrar'}
						    ]
						  })

			          	}else{
			           	gralFactory.showError('Ya posee el límite de jugadores: ' +limiteJugadores);
			           	return;
			   		};
			   	}else{
	           		gralFactory.showError('La fecha de inscripción finalizó');
	           		return;
	           	};
		    };	
		});
	};
    
    $ionicModal.fromTemplateUrl('client/templates/dialogs/integrantes.html',{
    	scope: $scope,
    	animation:'slide-in-up',
    }).then(function(modal){
    	$scope.modalIntegrantes = modal;
    });

    $scope.openIntegrantes = function(e){    	
    	$scope.modalIntegrantes.show();
    	$scope.equipo = e;
    }

    $scope.closeIntegrantes = function(){
    	$scope.modalIntegrantes.hide();
    }

}])

.controller('misGruposController',['$scope',function function_name($scope) {
	
}])

