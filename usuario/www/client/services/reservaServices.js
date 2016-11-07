angular.module('app.services')

.service('reservaService',['$http','generalServices','canchaService',function($http,generalServices){
	
	var reserva = {};

    this.createReserva = function(r){
        return $http.post(generalServices.urlReservas + '/nuevareserva',r)
            .then(function(d){
                return d.data;
            })
            .catch(function(e){
            	throw e;
            })
    }
    
	this.getReservasUsuario = function(username){
		return $http.get( generalServices.urlReservas + '/read/' + username)
			.then(function(d){
				return d.data;
			});
	}

	this.getReserva = function(){
		return reserva;
	};

	this.setReserva = function(r){
		reserva = r;
	};


}]);