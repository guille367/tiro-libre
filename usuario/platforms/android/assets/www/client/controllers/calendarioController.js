angular.module('app.controllers')

.controller('calendarioCtroller',['$scope','$ionicModal', function ($scope,$ionicModal) {
        'use strict';
        $scope.calendar = {};
        $scope.reservasDia = {};
        $scope.modo = 'mes';
        $scope.fechaSeleccionada;
        $scope.habilitarReserva = false;

        $scope.reserva = {
            fechaInicio : new Date(),
            fechaFin : new Date()
        }

        $ionicModal.fromTemplateUrl('client/templates/dialogs/reserva.html', {
                scope: $scope,
                animation: 'slide-in-up',
                title:'Reserva',
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
            $scope.modo = $scope.calendar.mode === 'day' ? 'día' : 'mes';
            console.log($scope.modo)
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

        $scope.closeReserva = function() {
            $scope.modalReserva.hide();
        }

        $scope.closePago = function() {
            $scope.modalPago.hide();
        }

    }]);

