angular.module('app.controllers')

.controller('torneoCtroller',['$scope','$state','torneosService','$ionicLoading','gralFactory','$ionicModal', '$rootScope', 
    'equiposService','userServices',function($scope,$state,torneosService,$ionicLoading,gralFactory,$ionicModal,$rootScope, equiposService,userServices){

    $scope.torneos = [];
    $scope.torneo = {};
    $scope.equipo = {};
    $scope.checked = false;
    $scope.jugadoresTitulares = [];
    $scope.jugadoresSuplentes = [];

    $scope.bloqBtnPagar = false;

    $scope.user = userServices.getUsuario();
    $scope.fechaActual = new Date();

    $scope.options = {
    locale: 'es',
    format: 'l',
    };

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

    };

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



    $scope.openPago = function(form){

        var continuar = true;

        var jugadores = $scope.jugadoresTitulares.concat($scope.jugadoresSuplentes); 

        if(!form.$valid)
            gralFactory.showError('Revise los datos ingresados.');
        else
            {

                jugadores.forEach(function(j){

                    jugadores.forEach(function(h){
                        if(j.$$hashKey != h.$$hashKey && j.dni == h.dni){
                            gralFactory.showError('El dni' + j.dni + ' se encuentra repetido');
                            continuar = false;
                            return;
                            }
                        });

                    if(continuar = false)
                        return;
                });

                if(!continuar)
                    return;

                $scope.torneo.equipos.forEach(function(eq){
                    if ($scope.equipo.nombreEq == eq.nombreEq){
                        gralFactory.showError('El nombre del equipo ya se encuentra registrado');
                        continuar = false;
                    };

                    eq.jugadores.forEach(function(jugadorAnotado){
                        jugadores.forEach(function(jugadorNuevo){
                            if(jugadorAnotado.dni == jugadorNuevo.dni){
                                gralFactory.showError('El nombre del equipo ya se encuentra registrado');
                                continuar = false;
                                return;
                            };
                        });
                        if(!continuar)
                            return;
                    });

                });       


                if(continuar)
                    alert("paso,man")

            }

        return;

        $scope.anotarEquipo(jugadores);
        $scope.user.nombreCompleto = $scope.user.apellido + ', ' + $scope.user.nombre;
        if($scope.checked == true){
            $scope.modalPago.show();
        };
    };

    $scope.openTorneo = function (r) {
        $scope.torneo = r;
        $scope.jugadoresTitulares = [];
        $scope.jugadoresSuplentes = [];

        console.log(r);

        torneosService.getTorneo($scope.torneo._id)
        .then(function(t){
            torneo = t;
            $scope.torneo = t;
          })
        .catch(function(e){
        alert(e);
        });

        if($scope.torneo.equipos.length != $scope.torneo.cantEquipos){
            
            for(var i = 0 ; i < $scope.torneo.jugTitulares ; i ++){
                $scope.jugadoresTitulares.push({});
            } 

        }else{
            $scope.bloqBtnPagar = true;
        };

        $scope.modalTorneo.show();
    };

    $scope.agregarSuplente = function(){
        $scope.jugadoresSuplentes.push({});
    };

    $scope.eliminarSuplente = function(id){
        $scope.jugadoresSuplentes = $scope.jugadoresSuplentes.filter(function(j){
            return j.$$hashKey != id;
        });
    };

    $scope.anotarEquipo = function(equipo,jugadores){
        

        $scope.contar = 0;
        $scope.equipo.usuarioResp = $scope.user.username;
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
        getTorneos();
    };

    $scope.pagarInscripcion = function(form){

        if(form.$valid)
            alert(true);
        else
            alert(false)

        return;

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
    $ionicModal.fromTemplateUrl('client/templates/dialogs/pagotarjeta.html',{
        scope: $scope,
        animation:'slide-in-up',
    }).then(function(modal){
        console.log($scope.torneos);
        $scope.modalPago = modal;
    });

}])