angular.module('app.controllers', ['ionic', 'ngAnimate', 'ui.rCalendar',])
 
.controller('misDatosController',['userServices','$scope','$ionicPopup',function (userServices,$scope,$ionicPopup,$ionicAlert) {

	$scope.usuario = userServices.getUsuario();

	var Foto = function(){
		console.log($scope.usuario);
		if ($scope.usuario.foto == ""){
			$scope.usuario.foto = "logo_default.png" 
		};		
	};

	Foto();

	$scope.openPopUp = function(obj,atributo){
		$scope.data ={};
		$ionicPopup.show({
		    template: '<input type="'+obj+'" ng-model="data.dato">',
		    title: 'Modificación de ' + atributo,
		    subTitle: 'Ingrese el nuevo ' + atributo,
		    scope: $scope,
		    buttons: [
		      {
		        text: '<b>Guardar</b>',
		        type: 'button-positive',
		        onTap: function(e) {

		          if (atributo == "teléfono"){
		          	if($scope.data.dato >= 10000000 && $scope.data.dato <= 99999999999){
		          		$scope.usuario.telefono = $scope.data.dato;
		          		userServices.update($scope.usuario);
		          		$ionicPopup.alert({template:'Modificación exitosa!'});	
		          	}else{
		          		$ionicPopup.alert({title: 'Error',template:'Verificar el número'});
		          	};					        

		          };
		          if (atributo == "mail"){
		          	$scope.usuario.mail = $scope.data.dato;
		          	userServices.update($scope.usuario);
		          };

		          	
		        }
		      },
		      { text: 'Cerrar'}
		    ]
		  })


	};
    
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

