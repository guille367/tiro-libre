angular.module('myApp').controller("schedulerController", function($scope, $http, usuarioServices, canchaService, $log, $rootScope, $uibModal, ngDialog){


  $scope.usuarios = {};
  $scope.canchas = {};
  $scope.hora = {};
  $scope.reserva = 0;
  $rootScope.saldo = 0;
  $rootScope.pago = {};
  $scope.checkReservasLocked = false;

 



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

      return $scope.actualizarPrecioPorCancha(event.cancha);

/*
      if($rootScope.horaFin.getHours() < $rootScope.config.horaNocturna.substr(0,2) ){
        var total = horasReserva * precio; 
        $scope.reserva = (total * $rootScope.config.porcReserva) / 100;
        return total 
      };
*/

  }; 


  $scope.actualizarPrecioPorCancha = function(x){

        var horasReserva =  $rootScope.horaFin.getHours() -  $rootScope.horaInicio.getHours(); 

      var precio = "";

      if($scope.horaFin.getHours() <= $rootScope.config.horaNocturna.substr(0,2) ){

        angular.forEach($scope.data, function(value, key){
          if (value.value == x) {
            precio = value.precioDiurno;
            return;
          }
        });
        return  horasReserva * precio;
      };

      if($scope.horaFin.getHours() > $rootScope.config.horaNocturna.substr(0,2) ){

        if($rootScope.horaInicio.getHours() >= $rootScope.config.horaNocturna.substr(0,2)){

          angular.forEach($scope.data, function(value, key){
          if (value.value == x) {
            precio = value.precioNocturno;
            return;
            };
          });
        return  horasReserva * precio;

        }else{

          var horasSinLuz = $rootScope.config.horaNocturna.substr(0,2) - $rootScope.horaInicio.getHours();
          var horasConLuz = $scope.horaFin.getHours() - $rootScope.config.horaNocturna.substr(0,2);
          var precioConLuz = 0;
          var precioSinLuz = 0;

          angular.forEach($scope.data, function(value, key){
          if (value.value == x) {
            precioConLuz = value.precioNocturno;
            precioSinLuz = value.precioDiurno;
            return;
            };
          });

          precio = (horasSinLuz * precioSinLuz) + (horasConLuz * precioConLuz);
          return precio;
        };

        
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
                    saldo: { from: "Saldo" },
                    fechaReserva: { from: "FechaReserva" }
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
            //$scope.schedulerOptions.resources[0].dataSource = $scope.data;
          },
          dataBound: function(e) {
            
          },
          //Esta funcion se va a ejecutar cuando se abre el template para una nueva reserva
          edit: function(e) {

            if (e.event.isNew()){
              $scope.verFechaReserva = false;
              $scope.$digest();
              if(e.event.start < (new Date())){
            
                ngDialog.openConfirm({
                  animation: true,
                  template: 'modalDialogId',
                  className: 'ngdialog-theme-default',
                  backdrop  : 'static',
                  keyboard  : false
                  }).then(function (value) {
                  }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                  });
                e.preventDefault();
                return;
              };

              
            }else{

              for (var u = 0; u < $scope.usuarios.length; u++) {
              if (e.event.username == $scope.usuarios[u].username) {
                
                if ($scope.usuarios[u].dni == 0) {
                  { break; }
                }else{

                  if (e.event.saldo == '0') {
                    var buttonsContainer = e.container.find(".k-edit-buttons");
                    var cancelButton = buttonsContainer.find(".k-scheduler-update");
                    cancelButton.hide();
                    { break; }
                  };

                  
                }

              } 
              
            };
              
              
              $scope.verFechaReserva = true;
            $scope.fechaDeReserva = moment(e.event.fechaReserva).format('LLLL');
            $scope.$digest();
            };
            

            if (e.event.cancha =='' && e.event.username=='') {
              e.event.set('taskId', e.event.uid);
            }

            var precio = $scope.calcularPrecio(e.event);
            e.event.set('precioTotal', precio);          
            reserva.value = (precio * $rootScope.config.porcReserva) / 100;
            
            for (var u = 0; u < $scope.usuarios.length; u++) {
              if (e.event.username == $scope.usuarios[u].username) {
                
                if ($scope.usuarios[u].dni == 0) {
                  e.event.set('saldo', 0);
                  $scope.mostrar = false;
                  $scope.$digest();
                  return;
                }else{
                  $scope.mostrar = true;
                  $scope.$digest();
                }

              } 
              
            };
            
            $scope.mostrar = true;
            $scope.$digest();
            
            

          },

          //Ésta funcion se ejecuta al guardar el evento
          save: function(e) {

            if (e.event.isNew()) {

              //Verificar que la cancha seleccionada no esté ya reservada
              var list = this.dataSource._data;
              for (var i = 0, len = list.length -1; i < len; i++) {
              
                if (list[i].start.toString() == e.event.start.toString()){
                  console.log(list[i].cancha + " Asignada");
                  if(list[i].cancha.toString() == e.event.cancha.toString()){
                    $scope.canchaUsada = true;
                    $scope.$digest();
                    e.preventDefault();
                    return;
                  }else{
                    $scope.canchaUsada = false;
                  }
                }
              };
              e.event.set("fechaReserva", moment()._d);
              $scope.verFechaReserva = false;

            };


            for (var u = 0; u < $scope.usuarios.length; u++) {
              if (e.event.username == $scope.usuarios[u].username) {
                if ($scope.usuarios[u].cantIncumplim >= 3) {
                  $scope.incumplimiento = true;
                  $scope.$digest();
                  e.preventDefault();
                  return;
                }else{
                  $scope.incumplimiento = false;
                }

                if ($scope.usuarios[u].dni == 0) {
                  e.event.set('saldo', 0);
                }

              } 
              
            };
            

            //verificar que el horario seleccionado este dentro de los horarios de la cancha
            if (e.event.start.getHours() < $rootScope.config.horaApertura.substr(0,2) || e.event.start.getHours() >= $rootScope.config.horaCierre.substr(0,2)){
              $scope.errorHoraInicioComplejo = true;
              $scope.$digest();
              e.preventDefault();
                  return;
            }else{
              $scope.errorHoraInicioComplejo = false;
            }


            if (e.event.end.getHours() <= $rootScope.config.horaApertura.substr(0,2) || e.event.end.getHours() > $rootScope.config.horaCierre.substr(0,2)){
              $scope.errorHoraFinComplejo = true;
              $scope.$digest();
              e.preventDefault();
                  return;
            }else{
              $scope.errorHoraFinComplejo = false;
            }

            //Verificar que el horario esté dentro del horario de la cancha
            angular.forEach($scope.data, function(value, key){
              if (value.value == e.event.cancha) {
                if (value.luz == false && e.event.end.getHours() > $rootScope.config.horaNocturna.substr(0,2)) {
                  $scope.canchaSinLuz = true;
                  $scope.$digest();
                  e.preventDefault();
                  return;
                }else{
                  $scope.canchaSinLuz = false;
                };
              }
            });

            //Verificar que la fecha de reserva no sea anterior a la fecha actual
            if(e.event.start < (new Date()) ){
              $scope.horarioAnterior = true;
              $scope.$digest();
              e.preventDefault();
            }else{
              $scope.horarioAnterior = false;
            };

            $scope.verFechaReserva = false;
           


          },

          change: function(e) {
            console.log("Change"); 
          },

          cancel: function(e) {
            console.log("cancel"); 
            $scope.canchaUsada = false;
            $scope.canchaSinLuz = false;
            $scope.horarioAnterior = false;
            $scope.verFechaReserva = false;
            $scope.$digest();
          
            
          },

          resize: function(e) {
            console.log("resize"); 
          },

          resizeEnd: function(e) {
            console.log("resize-end"); 
          },



        };


        $scope.data = [];
        
        angular.forEach($scope.canchas, function(value, key){
          var desc = { text: value.nombre, value: value._id, color: value.color, precioDiurno: value.pDiurno, estado: value.estado, precioNocturno: value.pNocturno, luz: value.luz, horaIni: value.horaIni, horaFin: value.horaFin};
          $scope.data.push(desc);
        });

        $scope.data = $scope.data.filter($scope.quitarCancha);
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
          var datePicker = e.sender;
           $rootScope.horaFin = datePicker.value();
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
          this.dataItem.set('precioReserva', precio);
          $rootScope.pago.preciototal = precio;
          $rootScope.pago.precioReserva = $scope.reserva;
          this.dataItem.set('saldo', precio);
          $rootScope.saldo = precio;


  };


  $scope.quitarCancha = function(objeto){

    if(objeto.estado == "En reparción"){
      return false;
    }else{
      return true;
    };

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

  //Funcion que define si se bloquean las canchas o no.
  $scope.onChange = function(){
    if($scope.checkReservasLocked == true){
     
      var value = JSON.stringify({ locked: true }); 
      canchaService.updateState(value);

    }else{
        
      var value = JSON.stringify({ locked: false }); 
      canchaService.updateState(value);

    };
  };


  /*
  //Funcion para verificar las reservas vencidas
  $scope.verificarReservas = function(){

    $http.get("http://localhost:3001/reserva/read")
    .then(function(response) {
      $scope.misReservas = response.data;

      var horaActual = moment().format();

      for (var i=0; i<$scope.misReservas.length; i++) {

        var horaReserva = moment($scope.misReservas[i].Start).format();
        var dif = moment(horaReserva).diff(moment(horaActual), 'hours');
        
        if (dif < 48 && dif >=0 && $scope.misReservas[i].Saldo == $scope.misReservas[i].PrecioTotal) {

          for (var x=0; x <$scope.usuarios.length; x++) {

            if ($scope.usuarios[x].username == $scope.misReservas[i].Username) {

              $http.delete("http://localhost:3001/reserva/eliminar", {params: {_id: $scope.misReservas[i]._id}}).then(function(response) {
              });
              
              usuarioServices.incumplimiento($scope.usuarios[x]).then(function(response) {
              });
              return;
            };

          };


        };
      }


    });

  };
  */

  
  //Final del controller
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













