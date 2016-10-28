angular.module('app.controllers')

.controller('calendarioCtroller',['$scope','$ionicModal','canchaService', function ($scope,$ionicModal,canchaService) {
        'use strict';
        
        $scope.cancha = canchaService.getCancha();
        $scope.calendar = {};
        $scope.reservasDia = {};
        $scope.modo = 'mes';
        $scope.fechaSeleccionada = new Date();
        $scope.habilitarReserva = false;
        $scope.calendar.eventSource = canchaService.getReservasCancha();
        $scope.reserva = {};
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
                console.log($scope.cancha)
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
            $scope.modo = $scope.calendar.mode === 'day' ? 'día' : 'mes';

            if($scope.calendar.mode == 'day'){
                eventosDelDia = 
                $scope.calendar.eventSource.filter(function(d){
                    return (d.startTime.getDay() == selectedTime.getDay()) && 
                    (d.startTime.getMonth() == selectedTime.getMonth())
                    });
            }
            else{
                eventosDelDia = {};
            }

            console.log($scope.modo);
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
            
            $scope.reserva = {
                fecha: selectedTime,
                horaInicio: selectedTime.getHours(),
                horaFin: (selectedTime.getHours() + 1)
            }

             

            $scope.horario.time.from = selectedTime.getHours() * 60;
            $scope.horario.time.to = $scope.horario.time.from + 60;
            $scope.horario.time.dFrom = selectedTime.getHours() * 60;
            $scope.horario.time.dTo= (selectedTime.getHours() * 60) + 480 ;
            /*$scope.horario.time.dFrom = selectedTime.getHours() * 60;
            $scope.horario.time.dTo = $scope.horario.time.from() + 60;
            $scope.horario.time.from = selectedTime.getHours() * 60;*/

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

        $scope.closePago = function() {
            $scope.modalPago.hide();
        }


    }]);

