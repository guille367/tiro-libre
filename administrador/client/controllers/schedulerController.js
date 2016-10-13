angular.module('myApp').controller("schedulerController", function($scope){

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
                dataType: "json"
              },
              parameterMap: function(options, operation) {
                if (operation !== "read" && options.models) {
                  return {models: options.models};
                }
              }
        },
        	schema: {
              model: {
                id: "taskId",
                fields: {
                  taskId: { from: "_id", type: "string" },
                  title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                  start: { type: "date", from: "Start" },
                  end: { type: "date", from: "End" },
                  startTimezone: { from: "StartTimezone" },
                  endTimezone: { from: "EndTimezone" },
                  description: { from: "Description" },
                  recurrenceId: { from: "RecurrenceID" },
                  recurrenceRule: { from: "RecurrenceRule" },
                  recurrenceException: { from: "RecurrenceException" },
                  ownerId: { from: "OwnerID", defaultValue: 1 },
                  isAllDay: { type: "boolean", from: "IsAllDay" }
                }
              }
            }
          },
          resources: [
            {
              field: "ownerId",
              title: "Owner",
              dataSource: [
                { text: "Cancha 1", value: 1, color: "#f8a398" },
                { text: "Cancha 2", value: 2, color: "#51a0ed" },
                { text: "Cancha 3", value: 3, color: "#56ca85" }
              ]
            }
          ],
        edit: function(e) {
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

    
	})
















