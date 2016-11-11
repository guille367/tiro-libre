angular.module('app.controllers')

.controller('torneoCtroller',['$scope','$state','torneosService','$ionicLoading','gralFactory','$ionicModal', '$rootScope', 'equiposService','userServices',function($scope,$state,torneosService,$ionicLoading,gralFactory,$ionicModal,$rootScope, equiposService,userServices){

    $scope.torneos = [];
    $scope.torneo = {};
    $scope.equipo = {};
    $scope.checked = false;
    $scope.jugadores = [];
    $scope.bloqBtnAnot = true;
    $scope.bloqBtnPagar = false;
    $scope.usuario = userServices.getUsuario();
    $scope.fechaActual = new Date();
    $scope.options = {
    locale: 'es',
    format: 'l',
    };
    $scope.jugadores = [
        { id: 1,
            name: 1}
    ];
    
    var AgregarInput =function(a){
        console.log('AgregarInput');
        console.log(a);
        $scope.jugadores=[];
        for (i=0; i< a; i++){
             $scope.jugadores.push({ 
                id: $scope.jugadores.length +1
            });
        }
    }

    var getTorneos = function(){
        
        torneosService.getAll()
            .then(function(d){
                $ionicLoading.hide();
                $scope.torneos = d.data;
                $scope.torneos = $scope.torneos.filter($scope.quitarCancha);

            })  
            .catch(function(e){
                $ionicLoading.hide();
                var err = e.data ? e.data : 'Vuelva a intentar más tarde';
                gralFactory.showError(err);
            });

    }
    getTorneos();

  $scope.quitarCancha = function(objeto){
    var dif = moment(objeto.fechaFin).diff(moment($scope.fechaActual), 'day');
    if(dif == 0){
      return false;
    }else{
      return true;
    };

  };

    $scope.quitarJugador = function(objeto){
        if(objeto == null){
          return false;
        }else{
          return true;
        };
    };



    $scope.openPago = function(jugadores){
        $scope.anotarEquipo(jugadores);

        if($scope.checked == true){
            $scope.modalPago.show();
        };
    }

    $scope.openTorneo = function (r) {
        $scope.torneo = r;
        $scope.jugadores = [];
        torneosService.getTorneo($scope.torneo._id)
        .then(function(t){
            console.log(t);
            torneo = t;
            $scope.torneo = t;
            console.log('torneo');
            

          })
        .catch(function(e){
        alert(e);
        });


        if($scope.torneo.equipos.length != $scope.torneo.cantEquipos){
            
            var totalJugadores = $scope.torneo.jugTitulares + $scope.torneo.jugSuplentes;
            for(var i = 0 ; i < totalJugadores ; i ++){
                $scope.jugadores.push({});
            }    

        }else{
            $scope.loggeado = false;
        };

        $scope.modalTorneo.show();
    }

    $scope.anotarEquipo = function(equipo,jugadores){
        
        $scope.contar = 0;
        $scope.equipo.usuarioResp = $scope.usuario.username;
        $scope.equipo.idTorneo = $scope.torneo._id;
        $scope.equipo.jugadores = $scope.jugadores;
        $scope.equipo.saldo = torneo.cantFechas * torneo.valorPorPartido;
        $scope.equipo.fechasImpagas = torneo.cantFechas;



        if($scope.equipo.nombreEq != null && $scope.equipo.nombreEq != ""){

                $scope.equipo.jugadores = $scope.equipo.jugadores.filter($scope.quitarJugador);

                angular.forEach($scope.equipo.jugadores, function(value, key){
                    if(value.dni != null && value.nombre != null){
                        if(value.dni != "" && value.nombre != ""){
                            if(value.dni > 10000000 && value.dni < 99999999){
                                angular.forEach($scope.equipo.jugadores, function(value2, key2){
                                    if(value.dni == value2.dni && key == key2){
                                        $scope.contar = $scope.contar + 1;
                                        return;
                                    }if(value.dni != value2.dni){
                                        $scope.contar = $scope.contar + 1;
                                        return;
                                    }else{
                                        gralFactory.showError('El dni : ' + value.dni + ' esta repetido');
                                        $scope.checked = false;
                                        return forEach.break();        
                                    };
                                });
                                
                            }else{
                                gralFactory.showError('Verificar el dni: ' + value.dni);
                                $scope.checked = false;
                                return ;                        
                            };
                        }else{
                            return ;
                        };
                    }else{
                        return ;
                    };
                });

                angular.forEach($scope.torneo.equipos, function(jugad, key){
                    if (jugad.nombreEq != $scope.equipo.nombreEq){
                        $scope.equipo.jugadores = $scope.equipo.jugadores.filter($scope.quitarJugador);
                        angular.forEach($scope.equipo.jugadores, function(value, key){
                            jugad.jugadores = jugad.jugadores.filter($scope.quitarJugador);
                            angular.forEach(jugad.jugadores, function(jugadorDni, key){
                                if (jugadorDni.dni == value.dni){
                                    $scope.checked = false;
                                    gralFactory.showError('EL dni ya se encuentra registrado: ' + value.dni);
                                    $scope.contar = 0;
                                    return false;
                                }else{
                                    return ;
                                };
                            });
                        });
                    }else{
                        $scope.checked = false;
                        gralFactory.showError('El nombre del equipo ya se encuentra registrado');
                        $scope.contar = 0;
                        return false;
                    };
                });       
            }else{
                $scope.checked = false;
                gralFactory.showError('Completar el nombre del equipo');
                return;
        };


        if($scope.contar >= $scope.torneo.jugTitulares){              
            $scope.checked = true;       
            equiposService.save($scope.equipo)
                .then(function(equipo){

                     torneosService.save($scope.torneo,equipo)
                        .then(function(res){
                            $scope.torneos = {};
                            $scope.torneo = {};
                            getTorneos();
                        });             
                    $scope.equipo = {};
            });
                     
        }else{
            $scope.checked = false;
            gralFactory.showError('Completar los datos de los jugadores. Mínimo de jugadores: ' + $scope.torneo.jugTitulares);
            
        };


    };

    $scope.closeTorneo = function () {
        
        $scope.modalTorneo.hide();
        
        if(!$rootScope.loggeado){
            $state.go('login');
        }

        getTorneos();
        
    };

    $scope.pagarInscripcion = function(form){
        if(!form.$valid){
            gralFactory.showError('Por favor corrobore sus datos.');
            }
        else{
            console.log('form valid');
            $ionicLoading.show();
            setTimeout(function(){
                $ionicLoading.hide();
                $scope.modalPago.hide();
                $scope.modalTorneo.hide();
                $state.go('torneos');
                gralFactory.showMessage('Su equipo fue anotado, el pago procesado. Muchas gracias!');
                $scope.bloqBtnPagar = true;
                $scope.bloqBtnAnot = false;
            },2000);
        }
    };

    $scope.closePago = function () {
        $scope.modalPago.hide();
    }

    $ionicModal.fromTemplateUrl('client/templates/dialogs/detalletorneo.html',{
        scope: $scope,
        animation:'slide-in-up',

    }).then(function(modal){

        $scope.modalTorneo = modal;
    });    
    $ionicModal.fromTemplateUrl('client/templates/dialogs/pagotarjetaTorneo.html',{
        scope: $scope,
        animation:'slide-in-up',
    }).then(function(modal){
        console.log($scope.torneos);
        $scope.modalPago = modal;
    });

}])