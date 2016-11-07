angular.module('app.controllers')

.controller('calendarioCtroller',['$scope','$state','$ionicModal','$ionicLoading','canchaService','reservaService','userServices','gralFactory','generalServices','uuid',
    function ($scope,$state,$ionicModal,$ionicLoading,canchaService,reservaService,userServices,gralFactory,generalServices,uuid) {
        'use strict';
        
        $scope.cancha = canchaService.getCancha();
        $scope.calendar = {};
        $scope.reservasDia = {};
        $scope.modo = 'mes';
        $scope.fechaSeleccionada = new Date();
        $scope.habilitarReserva = false;
        $scope.datosClub = {};
        $scope.calendar.eventSource = {};
        
        $scope.reserva = {
            abonaTotal: false
        };
        
        var reservasCancha = [];
        var reservasDelDia = [];

        $scope.horario = {
                time: { 
                    step: 60, // step width
                    minRange: 60, // min range
                    hours24: false, // true for 24hrs based time | false for PM and AM
                    dFrom: 0,
                    dTo: 1440
                }
        };
        
        $ionicModal.fromTemplateUrl('client/templates/dialogs/reserva.html', {
                scope: $scope,
                animation: 'slide-in-up',
                title:'Reserva'
            }).then(function(modal) {
                $scope.modalReserva = modal;
        });

        $ionicModal.fromTemplateUrl('client/templates/dialogs/pagotarjeta.html',{
            scope: $scope,
            animation:'slide-in-up',
        }).then(function(modal){
            $scope.modalPago = modal;
        });

        $scope.changeMode = function () {

            $scope.calendar.mode = $scope.calendar.mode == 'month' ? 'day' : 'month';
            $scope.modo = $scope.calendar.mode === 'day' ? 'dia' : 'mes';
            console.log($scope.calendar.eventSource);
            if($scope.modo == 'dia'){
                reservasDelDia = 
                $scope.calendar.eventSource.filter(function(d){
                    return (d.startTime.getDate() == $scope.fechaSeleccionada.getDate()) && 
                    (d.startTime.getMonth() == $scope.fechaSeleccionada.getMonth())
                    });

                //$scope.calendar.eventSource = reservasDelDia;
            }
            else{
                //$scope.calendar.eventSource = reservasCancha;
            }
        };

        $scope.loadEvents = function () {
            $scope.calendar.eventSource = createRandomEvents();
        };

        $scope.onEventSelected = function (event) {
            console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
        };

        $scope.onViewTitleChanged = function (title) {
            $scope.viewTitle = title;
        };

        $scope.today = function () {
            $scope.calendar.currentDate = new Date();
        };

        $scope.isToday = function () {
            var today = new Date(),
                currentCalendarDate = new Date($scope.calendar.currentDate);

            today.setHours(0, 0, 0, 0);
            currentCalendarDate.setHours(0, 0, 0, 0);
            return today.getTime() === currentCalendarDate.getTime();
        };

        $scope.onTimeSelected = function (selectedTime, events) {
            console.log('Selected time: ' + selectedTime + ', hasEvents: ' + (events !== undefined && events.length !== 0));            
            $scope.fechaSeleccionada = selectedTime;
            
            reservasDelDia = 
                $scope.consolealendar.eventSource.filter(function(d){
                    return (d.startTime.getDate() == $scope.fechaSeleccionada.getDate()) && 
                    (d.startTime.getMonth() == $scope.fechaSeleccionada.getMonth())
                    });

            $scope.horario.time.from = selectedTime.getHours() * 60;
            $scope.horario.time.dFrom = $scope.horario.time.from;
            var to;

            if($scope.modo == 'dia' && reservasDelDia.length > 0){
                to = reservasDelDia.find(function(e){
                    return selectedTime.getHours() < (e.startTime.getHours())
                })
            }

            if(to){
                $scope.horario.time.dTo = to.startTime.getHours() * 60;
                $scope.horario.time.to = to.startTime.getHours() * 60;
            }
            else{
                $scope.horario.time.dTo = Number($scope.cancha.horaFin.split(':')[0]) * 60;
                //$scope.horario.time.to = selectedTime
            }

            $scope.habilitarReserva = (events !== undefined && events.length !== 0);
        };

        function createRandomEvents() {

            var events = [];
            for (var i = 0; i < 50; i += 1) {
                var date = new Date();
                var startDay = Math.floor(Math.random() * 90) - 45;
                var startTime;
                var endTime;
                var startHour = Math.floor(Math.random() * 24);
                var endHour = startHour + 1;
                startTime = new Date(date.getFullYear(), date.getMonth(), startDay, startHour);
                endTime = new Date(date.getFullYear(), date.getMonth(), startDay, endHour);
                events.push({
                    title: 'Reserva - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false
                })
            }
            return events;
        }

        $scope.openReserva = function(){
            $scope.modalReserva.show();
        }

        $scope.closeReserva = function() {
            $scope.modalReserva.hide();
        }

        $scope.openPago = function(){
            
            var horarioNocturno = Number($scope.datosClub.horaNocturna.split(':')[0]);
            var cantHoras = ($scope.horario.time.to / 60) - ($scope.horario.time.from / 60);
            var precio = 0;

            for(var i = 0 ; i < cantHoras ; i ++){

                var q = ($scope.horario.time.from / 60) + i;
                
                if(q >= horarioNocturno)
                    precio += $scope.cancha.pNocturno;
                else
                    precio += $scope.cancha.pDiurno;

            }
            
            $scope.reserva.PrecioTotal = precio;
            $scope.reserva.PrecioReserva = precio * ($scope.datosClub.porcReserva * 0.01);

            $scope.modalPago.show();
        }

        $scope.closePago = function() {
            $scope.modalPago.hide();
        }

        var loadReservas = function(){
            console.log(canchaService.getCancha().reservas);
            reservasCancha = canchaService.getCancha().reservas;
            $scope.calendar.eventSource = reservasCancha;
        };
        
        var getDatosClub = function(){
            generalServices.getDatosClub()
                .then(function(d){
                    $scope.datosClub = d.data[0];
                });
        };

        getDatosClub();
        loadReservas();

        $scope.pagarReserva = function(form){
            
                    
            if(!form.$valid)
                gralFactory.showError('Por favor corrobore sus datos.');
            else{

            $ionicLoading.show();
                
            var usuario = userServices.getUsuario();
            var reserva = {};
            var fechaInicio = angular.copy($scope.fechaSeleccionada);
            fechaInicio.setHours($scope.horario.time.from / 60,0,0,0);
            var fechaFin = angular.copy($scope.fechaSeleccionada);
            fechaFin.setHours($scope.horario.time.to / 60,0,0,0);

            var saldo = $scope.reserva.abonaTotal ? 0 : $scope.reserva.PrecioTotal - $scope.reserva.PrecioReserva;
            
            $scope.reserva.TaskID = uuid.v4();
            $scope.reserva.Username = usuario.username;
            $scope.reserva.Cancha = $scope.cancha._id;
            $scope.reserva.Description = 'Reserva ' + usuario.username;
            $scope.reserva.Start = fechaInicio;
            $scope.reserva.End = fechaFin;
            $scope.reserva.Saldo = saldo;
            $scope.reserva.FechaReserva = new Date();

            reservaService
                .createReserva($scope.reserva)
                    .then(function(d){
                    $ionicLoading.hide();
                    $scope.modalReserva.hide();
                    $scope.modalPago.hide();
                    $state.go('canchas')
                    gralFactory.showMessage('Pago procesado. Muchas gracias!');
                    })
                    .catch(function(e){
                    $ionicLoading.hide();

                    gralFactory.showError('Error al procesar el pago. Comuníquese con el administrador');
                    });
         
            }
    };

    }]);

