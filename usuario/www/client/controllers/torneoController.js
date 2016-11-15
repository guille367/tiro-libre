angular.module('app.controllers')

.controller('torneoCtroller',['$scope','$state','torneosService','$ionicLoading','gralFactory','$ionicModal', '$rootScope', 
    'equiposService','userServices',function($scope,$state,torneosService,$ionicLoading,gralFactory,$ionicModal,$rootScope, equiposService,userServices){

    $scope.torneos = [];
    $scope.torneo = {};
    $scope.equipo = {};
    $scope.checked = false;
    $scope.jugadoresTitulares = [];
    $scope.jugadoresSuplentes = [];
    $scope.usuarioEq = true;
    $scope.bloqBtnPagar = false;

    $scope.usuario = userServices.getUsuario();
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
                $scope.torneos = $scope.torneos.filter($scope.quitarTorneo);
            })  
            .catch(function(e){
                $ionicLoading.hide();
                var err = e.data ? e.data : 'Vuelva a intentar más tarde';
                gralFactory.showError(err);
            });

    };

  $scope.quitarTorneo = function(objeto){
    var dif = moment(objeto.fechaFin).diff(moment($scope.fechaActual), 'day');
    if(dif < 0){
      return false;
    }else{
      return true;
    };

  };  

    $scope.openPago = function(form){

        var continuar = true;
        var existeJugador = false;

        var jugadores = $scope.jugadoresTitulares.concat($scope.jugadoresSuplentes); 

        if(!form.$valid)
            gralFactory.showError('Revise los datos ingresados.');
        else
            {

                jugadores.every(function(j){

                    existeJugador = jugadores.some(function(h){
                        if (j.$$hashKey != h.$$hashKey && j.dni == h.dni){
                            gralFactory.showError('El dni' + j.dni + ' se encuentra repetido');
                            continuar = false;
                            return true;
                            }
                        else
                            return false;
                    });

                    if(existeJugador)
                        return  false;
                    else
                        return true;
                });

                $scope.torneo.equipos.every(function(eq){

                    if ($scope.usuario.username == eq.usuarioResp){
                        gralFactory.showError('Usted ya se encuentra inscripto al torneo');
                        continuar = false;
                        return false;
                    }

                    if ($scope.equipo.nombreEq == eq.nombreEq){
                        gralFactory.showError('El nombre del equipo ya se encuentra registrado');
                        continuar = false;
                        return false;
                    };

                    eq.jugadores.every(function(jugadorAnotado){

                        jugadores.some(function(jugadorNuevo){
                            if(jugadorAnotado.dni == jugadorNuevo.dni){
                                gralFactory.showError('El dni ' + jugadorNuevo.dni + ' ya fue anotado al torneo');
                                continuar = false;
                                return true;
                            }
                            else
                                return false;   
                        });

                        if(!continuar)
                            return false;
                    });

                });       
                
                if(continuar){
                    $scope.equipo.usuarioResp = $scope.usuario.username;
                    $scope.equipo.idTorneo = $scope.torneo._id;
                    $scope.equipo.saldo = torneo.cantFechas * torneo.valorPorPartido;
                    $scope.equipo.fechasImpagas = torneo.cantFechas;
                    $scope.equipo.jugadores = jugadores;
                    $scope.modalPago.show();
                };

            };
    };

    $scope.openTorneo = function (r) {
        $scope.torneo = r;
        $scope.jugadoresTitulares = [];
        $scope.jugadoresSuplentes = [];

        $ionicLoading.show();
        torneosService.getTorneo($scope.torneo._id)
        .then(function(t){
            torneo = t;
            $scope.torneo = t;
            if($rootScope.loggeado == true){                
                angular.forEach($scope.torneo.equipos, function(value, key){
                    if(value.usuarioResp == $scope.usuario.username){
                        $scope.usuarioEq = false;
                        gralFactory.showMessage('Ya se encuentra anotado para este torneo');
                        $ionicLoading.hide();
                    };
                });
            };
            if ($scope.torneo.cantFechas > $scope.torneo.cantEquipos) {
              $scope.torneo.idaVuelta = "Si";
            }else{
              $scope.torneo.idaVuelta = "No";
            };
            $ionicLoading.hide();
          })
        .catch(function(e){
        alert(e);
        $ionicLoading.hide();
        });

        var difInsc = moment($scope.torneo.fechaCierreInscripcion).diff(moment($scope.fechaActual), 'day');

        if($scope.torneo.equipos.length != $scope.torneo.cantEquipos && difInsc >= 0){
            
            for(var i = 0 ; i < $scope.torneo.jugTitulares ; i ++){
                $scope.jugadoresTitulares.push({});

            } 

        }else{
            
            $scope.usuarioEq = false;
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

    $scope.anotarEquipo = function(){
      
        equiposService.save($scope.equipo)
            .then(function(equipo){
                 torneosService.save($scope.torneo,equipo)
                    .then(function(res){
                        $state.go('torneos');
                        $scope.modalPago.hide();
                        $scope.modalTorneo.hide();
                        gralFactory.showMessage('Muchas gracias por anotarse!');
                        getTorneos();
                    })
                    .catch(function(e){
                        gralFactory.showError('Ha ocurrido un error en la inscripcion.');
                    });            
            });

    };

    $scope.closeTorneo = function () {
        $scope.modalTorneo.hide();
        $scope.usuarioEq = true;
        getTorneos();
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

    getTorneos();
}])