angular.module('app.services')

.service('canchaService',['$http','generalServices',function($http,generalServices){

	var cancha = {};

	this.getCancha = function(){
		return cancha;
	}

	this.setCancha = function(c){
		cancha = c;
	}

	this.getCanchas = function(){
		return $http.get(generalServices.urlCanchas + '/get').then(function(d){
			return d;
		})
	}


}])