angular.module('app.controllers', ['ionic', 'ngAnimate', 'ui.rCalendar'])
 
.controller('misDatosController',['$scope','$ionicPopup',function function_name($scope,$ionicPopup,$ionicAlert) {
	
	$scope.perfil = {
		nombre:'Piñeyro, Miguel Ángel',
		telefono: 1558956295,
		mail:'miguelpiñeyro@gmail.com',
		club:'Sportivo Dock Sud',
		jugadorPref:'Javier Gandolfi',
		posicion:'Central'
	};


	$scope.openPopUp = function(obj,nombre){
		$ionicPopup.show({
		    template: '<input type="text" ng-model="perfil.'+obj+'">',
		    title: 'Modificación de ' + nombre,
		    subTitle: 'Ingrese el nuevo ' + nombre,
		    scope: $scope,
		    buttons: [
		      {
		        text: '<b>Guardar</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		          /*if (!$scope.perfil.obj) {
		            //don't allow the user to close unless he enters wifi password
		            e.preventDefault();
		          } else { 	*/
		            $ionicPopup.alert({template:'Modificación exitosa!'});
		          	
		        }
		      },
		      { text: 'Cerrar' }
		    ]
		  })
	};

	/*$ionicModal.fromTemplateUrl('dialogtelefono.html',{
    	scope: $scope,
    	animation:'slide-in-up',
    }).then(function(modal){
    	$scope.dialogTel = modal;
    });

    $ionicModal.fromTemplateUrl('dialogtelefono.html',{
    	scope: $scope,
    	animation:'slide-in-up',
    }).then(function(modal){
    	$scope.dialogMail = modal;
    });

    $scope.openDialog = function (dialog) {
    	dialog.show()
    }

    $scope.closeDialog = function (dialog) {
    	dialog.hide();
    }*/

}])

.controller('misEquiposCtroller', ['$scope','$ionicModal', '$stateParams',function($scope,$ionicModal,$stateParams){
    
    $ionicModal.fromTemplateUrl('client/templates/dialogs/integrantes.html',{
    	scope: $scope,
    	animation:'slide-in-up',
    }).then(function(modal){
    	$scope.modalIntegrantes = modal;
    });

    $scope.openIntegrantes = function(){
    	$scope.modalIntegrantes.show();
    }

    $scope.closeIntegrantes = function(){
    	$scope.modalIntegrantes.hide();
    }

}])

.controller('misGruposController',['$scope',function function_name($scope) {
	
}])

.run(function ($ionicPlatform, $animate) {
        'use strict';
        $animate.enabled(false);
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        'use strict';
        $stateProvider
            .state('tabs', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('tabs.home', {
                url: '/home',
                views: {
                    'home-tab': {
                        templateUrl: 'templates/home.html',
                        controller: 'CalendarDemoCtrl'
                    }
                }
            })
            .state('tabs.about', {
                url: '/about',
                views: {
                    'about-tab': {
                        templateUrl: 'templates/about.html'
                    }
                }
            })
            .state('tabs.contact', {
                url: '/contact',
                views: {
                    'contact-tab': {
                        templateUrl: 'templates/contact.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/tab/home');
    })

    .controller('CalendarDemoCtrl', function ($scope) {
        'use strict';
        $scope.calendar = {};
        $scope.changeMode = function (mode) {
            $scope.calendar.mode = mode;
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

        	$scope.calendar.mode = 'day';
            console.log('Selected time: ' + selectedTime + ', hasEvents: ' + (events !== undefined && events.length !== 0));
        };

        function createRandomEvents() {
            var events = [];
            for (var i = 0; i < 50; i += 1) {
                var date = new Date();
                var eventType = Math.floor(Math.random() * 2);
                var startDay = Math.floor(Math.random() * 90) - 45;
                var endDay = Math.floor(Math.random() * 2) + startDay;
                var startTime;
                var endTime;
                if (eventType === 0) {
                    startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                    if (endDay === startDay) {
                        endDay += 1;
                    }
                    endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                    events.push({
                        title: 'All Day - ' + i,
                        startTime: startTime,
                        endTime: endTime,
                        allDay: true
                    });
                } else {
                    var startMinute = Math.floor(Math.random() * 24 * 60);
                    var endMinute = Math.floor(Math.random() * 180) + startMinute;
                    startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                    endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                    events.push({
                        title: 'Reserva - ' + i,
                        startTime: startTime,
                        endTime: endTime,
                        allDay: false
                    });
                }
            }
            return events;
        }
    });