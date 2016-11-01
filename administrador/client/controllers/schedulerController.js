angular.module('myApp').controller("schedulerController", function($scope, usuarioServices, canchaService, $log, $rootScope, $uibModal, ngDialog){


  $scope.usuarios = {};
  $scope.canchas = {};
  $scope.hora = {};
  $scope.reserva = 0;
  $rootScope.saldo = 0;
  $rootScope.pago = {};
  



  //funcion que calcula el precio de la reserva
  $scope.calcularPrecio=function(event){
      
       $rootScope.horaInicio = event.start;
       $rootScope.horaFin = event.end;

      var horasReserva =  $rootScope.horaFin.getHours() -  $rootScope.horaInicio.getHours(); 

      var precio = "";

      angular.forEach($scope.data, function(value, key){
          if (value.value == event.cancha) {
            precio = value.precioDiurno;
            return;
          }
        });

      if($rootScope.horaFin.getHours() < $rootScope.config.horaNocturna.substr(0,2) ){
        var total = horasReserva * precio; 
        $scope.reserva = (total * $rootScope.config.porcReserva) / 100;
        return total 
      };


  }; 


  $scope.actualizarPrecioPorCancha = function(x){

        var horasReserva =  $rootScope.horaFin.getHours() -  $rootScope.horaInicio.getHours(); 

      var precio = "";

      angular.forEach($scope.data, function(value, key){
          if (value.value == x) {
            precio = value.precioDiurno;
            return;
          }
        });

      if($scope.horaFin.getHours() < $rootScope.config.horaNocturna.substr(0,2) ){
        return  horasReserva * precio;
        
      };

  };


  var getCanchas = function () {
      canchaService.getAll()
        .then(function(res){
          $scope.canchas = res;

          $scope.schedulerOptions = {
            date: kendo.date.today(),
            majorTimeHeaderTemplate: kendo.template("<strong>#=kendo.toString(date, 'HH:mm')#</strong>"),
            startTime: new Date("2013/6/6 01:00 AM"),
            endTime: new Date("2013/6/6 24:00"),
            height: 600,
            minorTickCount: 1,
            majorTick: 60,
            workDayStart: new Date("2013/1/1 08:00 AM"),
            workDayEnd: new Date("2013/1/1 23:00"),
            showWorkHours: false, 
            views: [
              { type: "day", selected: true },
              "week",
              "month",
              "agenda",
              "timeline"
              ],
            editable: {
              template: $("#customEditorTemplate").html(),
              resize: false
            },
            eventTemplate: $("#event-template").html(),
            timezone: "Etc/UTC",
            dataSource: {
              batch: true,
              transport: {
                read: {
                  url: "http://localhost:3001/reserva/read",
                  dataType: "json"
                },
                update: {
                  url: "http://localhost:3001/reserva/update",
                  type: "put",
                  dataType: "json"
                },
                create: {
                  url: "http://localhost:3001/reserva/post",
                  type: "post",
                  dataType: "json"
                },
                destroy: {
                  url: "http://localhost:3001/reserva/delete",
                  type: "delete",
                  dataType: "json"
                },
                parameterMap: function(options, operation) {
                  if (operation == "create") {
                    return {models: options.models};
                  };
                  if (operation == "update") {
                    return {models: options.models, id: options.models[0]._id};
                  };
                  if (operation == "read") {

                  };
                  if (operation == "destroy") {
                    return { id: options.models[0]._id};
                  };
                } 
              },
              schema: {
                model: {
                  id: "taskId",
                  fields: {
                    taskId: { from: "TaskID", type: "string" },
                    username: { from: "Username", validation: { required: true } },
                    start: { type: "date", from: "Start" },
                    end: { type: "date", from: "End" },
                    startTimezone: { from: "StartTimezone" },
                    endTimezone: { from: "EndTimezone" },
                    description: { from: "Description" },
                    recurrenceId: { from: "RecurrenceID" },
                    recurrenceRule: { from: "RecurrenceRule" },
                    recurrenceException: { from: "RecurrenceException" },
                    cancha: { from: "Cancha", validation: { required: true } },
                    isAllDay: { type: "boolean", from: "IsAllDay" },
                    precioTotal: { from: "PrecioTotal" },
                    precioReserva: { from: "PrecioReserva" },
                    saldo: { from: "Saldo" }
                  }
                }
              }
            },
            resources: [
              {
                field: "cancha",
                title: "Cancha",
                dataSource: []
              }
            ],
          navigate: function(e) {
            $scope.schedulerOptions.resources[0].dataSource = $scope.data;
          },
          dataBound: function(e) {
            
          },
          //Esta funcion se va a ejecutar cuando se abre el template para una nueva reserva
          edit: function(e) {

            if (e.event.cancha =='' && e.event.username=='') {
              e.event.set('taskId', e.event.uid);
            }

            var precio = $scope.calcularPrecio(e.event);
            e.event.set('precioTotal', precio);          
            reserva.value = (precio * $rootScope.config.porcReserva) / 100;
            

          },

          //Ésta funcion se ejecuta al guardar el evento
          save: function(e) {

          },

          change: function(e) {
            console.log("Change"); 
          },

          cancel: function(e) {
          }

        };


        $scope.data = [];
        
        angular.forEach($scope.canchas, function(value, key){
          var desc = { text: value.nombre, value: value._id, color: value.color, precioDiurno: value.pDiurno, precioNocturno: value.pNocturno};
          $scope.data.push(desc);
        });
        $scope.schedulerOptions.resources[0].dataSource = $scope.data;

      });
    }

  var getUsuarios = function () {
      usuarioServices.getAll()
        .then(function(res){
          $scope.usuarios = res;
        });
    }

  getUsuarios();
  getCanchas();


  //Funcion que se ejecuta cuando se modifica el horario de inicio de reserva
  $scope.onDateSelectedInicio = function(e) {
          var datePicker = e.sender;
          $rootScope.horaInicio = datePicker.value();
          var precio = $scope.actualizarPrecioPorCancha(this.dataItem.cancha);
          this.dataItem.set('precioTotal', precio); 
          $scope.reserva = (precio * $rootScope.config.porcReserva) / 100;
          $rootScope.pago.preciototal = precio;
          $rootScope.pago.precioReserva = $scope.reserva;
          this.dataItem.set('saldo', precio);  
          $rootScope.saldo = precio;

  };

  //Funcion que se ejecuta cuando se modifica el horario de finalizacion de reserva      
  $scope.onDateSelectedFin = function(e) {
          var datePicker2 = e.sender;
           $rootScope.horaFin = datePicker2.value();
           var precio = $scope.actualizarPrecioPorCancha(this.dataItem.cancha);
          this.dataItem.set('precioTotal', precio);
          $scope.reserva = (precio * $rootScope.config.porcReserva) / 100; 
          $rootScope.pago.preciototal = precio;
          $rootScope.pago.precioReserva = $scope.reserva;
          this.dataItem.set('saldo', precio);
          $rootScope.saldo = precio;

  };

  //Funcion que se ejecuta cuando se selecciona otra cancha
  $scope.cambioCancha = function(x, e) {
          var precio = $scope.actualizarPrecioPorCancha(x);
          this.dataItem.set('precioTotal', precio);
          $scope.reserva = (precio * $rootScope.config.porcReserva) / 100;
          $rootScope.pago.preciototal = precio;
          $rootScope.pago.precioReserva = $scope.reserva;
          this.dataItem.set('saldo', precio);
          $rootScope.saldo = precio;

  };





  $scope.open = function (size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'pagoTarjeta.html',
        controller: 'modalPagarController',
        backdrop  : 'static',
        keyboard  : false,
        size: size,
        resolve: {
          test: function () {
            return size;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
          getCanchas();
        });
    };

    
	})


angular.module('myApp').controller('modalPagarController', function($scope, $uibModalInstance, $timeout, test, $rootScope){

  $scope.aPagar = "";
  $scope.opcionesConcepto = [{ nombre: "Total", visible: true } , { nombre: "Reserva", visible: true}];

  if(test.dataItem.saldo > 0 && test.dataItem.saldo != test.dataItem.precioTotal){
    $scope.opcionesConcepto[1].visible = false;
  }else{
    $scope.opcionesConcepto[1].visible = true;
  }


  $scope.cambioConcepto = function(){

    if ($scope.miConcepto == "Total") {
      if($scope.opcionesConcepto[1].visible === false){
        $scope.aPagar = test.dataItem.precioTotal - ((test.dataItem.precioTotal * $rootScope.config.porcReserva) /100);
      }else{
        $scope.aPagar = test.dataItem.precioTotal;
      };
      
    }else{
      $scope.aPagar = (test.dataItem.precioTotal * $rootScope.config.porcReserva) /100;
    };

  };


  $scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
            $rootScope.saldo = "";
        }, 300);
    };

    $scope.pagar = function (form) {

      if(form.$valid){
        console.log("ok");

        if ($scope.miConcepto == "Total") {
          test.dataItem.set('saldo', '0');
        }else{
          $rootScope.saldo = test.dataItem.precioTotal - ((test.dataItem.precioTotal * $rootScope.config.porcReserva) /100);
          test.dataItem.set('saldo', $rootScope.saldo);
        };

      }else{
        return;
      };

      

    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

});













