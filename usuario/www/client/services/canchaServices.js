angular.module('app.services')

.service('canchaService',['$http','generalServices',function($http,generalServices){

	var cancha = {};

	this.getCancha = function(){
		return cancha;
	}

	this.setCancha = function(c){
		cancha = c;
	}

    this.getReservasCancha = function(r){
        return cancha.reservas;
    }
    
    this.setReservasCancha = function(r){
        cancha.reservas = r;
    }
    
    this.getReservasCancha = function(){
        return $http.get(generalServices.urlCancha + '/getreservas' + cancha._id)
            .then(function(d){
                return schedulerToIC(d);
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

    // Corroborar que arme bien el objeto
    var schedulerToIC = function(o){
        return o.map(function(event){
            return {
                allDay: false,
                endTime: o.Start.$date,
                startTime: o.End.$date,
                title: 'Reserva'
            }
        });
    }
    
    var ICToscheduler = function(o){
        // Implementar
    }
    
}])