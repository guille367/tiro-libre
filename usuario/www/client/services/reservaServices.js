angular.module('app.services')

.service('reservaService',['$http','generalServices',function($http,generalServices){
	
	this.getReservas = function(){
		return $http.get( generalServices.urlReservas + '/getAll')
			.then(function(d){
				console.log(d);
			})
	}

}]);