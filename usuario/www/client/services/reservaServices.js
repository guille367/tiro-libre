angular.module('app.services')

.service('reservaService',['$http','generalServices','canchaService',function($http,generalServices){
	
	var reserva = {};

	this.getReservas = function(){
		
		return $http.get( generalServices.urlReservas + '/read')
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