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
        $scope.precioTotal = 0;
        $scope.precioReserva = 0;
        $scope.abonaTotal = true;
        $scope.reserva = {
            abonaTotal: true
        };
        var eventosDelDia = {};
    
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
                eventosDelDia = 
                $scope.calendar.eventSource.filter(function(d){
                    return (d.startTime.getDate() == $scope.fechaSeleccionada.getDate()) && 
                    (d.startTime.getMonth() == $scope.fechaSeleccionada.getMonth())
                    });
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

            $scope.horario.time.from = selectedTime.getHours() * 60;
            $scope.horario.time.dFrom = selectedTime.getHours() * 60;
            //$scope.horario.time.dTo= (selectedTime.getHours() * 60) + 60;

            $scope.fechaSeleccionada = selectedTime;
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
            // Precios
            /*var horarioNocturno = Number($scope.datosClub.horaNocturna.split(':')[0]);
            var cantHoras = ($scope.horario.time.to / 60) - ($scope.horario.time.from / 60);
            var precio = 0;

            for(var i = 0 ; i < cantHoras ; i ++){

                var q = ($scope.horario.time.from / 60) + i;
                
                if(q >= horarioNocturno)
                    precio += $scope.cancha.pNocturno;
                else
                    precio += $scope.cancha.pDiurno;

            }
            
            $scope.reserva.precioTotal = precio;
            $scope.reserva.precioReserva = precio * ($scope.datosClub.porcReserva * 0.01);*/

            $scope.modalPago.show();
        }

        $scope.closePago = function() {
            $scope.modalPago.hide();
        }

        var loadReservas = function(){
            $scope.calendar.eventSource = canchaService.getCancha().reservas;
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

            /*var usuario = JSON.parse(userServices.getUsuario());
            var reserva = {};

            $scope.fechaSeleccionada.setHours($scope.horario.time.from / 60);
            var fechaInicio = $scope.fechaSeleccionada;
            $scope.fechaSeleccionada.setHours($scope.horario.time.to / 60);
            var fechaFin = $scope.fechaSeleccionada;
            var saldo = $scope.abonaTotal ? 0 : $scope.reserva.precioTotal _ $scope.reserva.precioReserva;
            
            $scope.reserva.TaskID = uuid.v4();
            $scope.reserva.Username = usuario.username;
            $scope.reserva.Cancha = $scope.cancha._id;
            $scope.reserva.Description = 'Reserva ' + usuario.username;
            $scope.reserva.Start = fechaInicio;
            $scope.reserva.End = fechaFin;
            $scope.reserva.Saldo = saldo;
            */
            
            if(!form.$valid)
                gralFactory.showError('Por favor corrobore sus datos.');
            else{

            $ionicLoading.show();
                
            reservaService
                .createReserva($scope.reserva)
                    .then(function(d){
                    $ionicLoading.hide();
                    gralFactory.showMessage('Pago procesado. Muchas gracias!');
                    $state.go('/canchas');
                    })
                    .catch(function(e){
                    $ionicLoading.hide();
                    gralFactory.showError('Error al procesar el pago. Comuníquese con el administrador');
                    });
                
            setTimeout(function(){
                $ionicLoading.hide();
                // Volver a buscar las reservas.
                $scope.modalPago.hide();
                $scope.modalReserva.hide();
                gralFactory.showMessage('Pago procesado. Muchas gracias!');
                
            },2000);
        }
    };

    }]);

