angular.module('myApp').controller("schedulerController", function($scope, usuarioServices, canchaService){


  $scope.usuarios = {};
  $scope.canchas = {};


  

  var getCanchas = function () {
      canchaService.getAll()
        .then(function(res){
          $scope.canchas = res;

          $scope.schedulerOptions = {
            date: kendo.date.today(),
            startTime: new Date("2013/6/6 09:00 AM"),
            endTime: new Date("2013/6/6 23:00"),
            height: 600,
            views: [
              { type: "day", selected: true },
              "week",
              "month",
              "agenda",
              "timeline"
              ],
            editable: {
              template: $("#customEditorTemplate").html(),
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
                    username: { from: "Username", defaultValue: "Seleccionar", validation: { required: true } },
                    start: { type: "date", from: "Start" },
                    end: { type: "date", from: "End" },
                    startTimezone: { from: "StartTimezone" },
                    endTimezone: { from: "EndTimezone" },
                    description: { from: "Description" },
                    recurrenceId: { from: "RecurrenceID" },
                    recurrenceRule: { from: "RecurrenceRule" },
                    recurrenceException: { from: "RecurrenceException" },
                    cancha: { from: "Cancha", defaultValue: 1 },
                    isAllDay: { type: "boolean", from: "IsAllDay" }
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
          
          },
          dataBound: function(e) {
            var scheduler =  this;
            var resource = scheduler.resources[0];
            var data = $scope.data;
            //you can read the resources from remote source if needed:
            resource.dataSource.data(data);
          },
          edit: function(e) {
            $scope.schedulerOptions.resources[0].dataSource = $scope.data;
            var container = e.container;
            /* ACTION: ADD custom button */
            var newButton = $('<a class="k-button" >Tarjeta</a>');
              //wire its click event
              newButton.click(function(e) { 
                $('#pagoTarjeta').appendTo("body").modal('show');
              });
              //add the button to the container
              var buttonsContainer = container.find(".btn-group");
              buttonsContainer.append(newButton);
            }
          };
        $scope.data = [];
        var i = 0;
        angular.forEach($scope.canchas, function(value, key){
          var desc = { text: value.nombre, value: i, color: value.color};
          $scope.data.push(desc);
          i = i + 1;
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


	




    
	})
















