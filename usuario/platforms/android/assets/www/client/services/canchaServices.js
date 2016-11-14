angular.module('app.services')

.service('canchaService',['$http','generalServices',function($http,generalServices){

	var cancha = {};

	this.getCancha = function(){
		return cancha;
	}

	this.setCancha = function(c){
		cancha = c;
	}

    this.setReservasCancha = function(r){
        cancha.reservas = r;
    }
    
    this.getReservasCancha = function(idCancha){
        // + '/read' + cancha._id
        return $http.get(generalServices.urlCanchas + '/getreservas/' + idCancha)
            .then(function(d){
                return schedulerToIC(d.data);
            })
            .catch(function(e){
                throw e;
            });
    }
    
	this.getCanchas = function(){
		return $http.get(generalServices.urlCanchas + '/get').then(function(d){
			return d;
		});
	}

    var schedulerToIC = function(o){
        return o.map(function(event){
            return {
                allDay: false,
                startTime: new Date(event.Start),
                endTime: new Date(event.End),
                title: 'Reserva'
            }
        });
    }
    
    var ICToscheduler = function(o){
        // Implementar
    }
    
}])