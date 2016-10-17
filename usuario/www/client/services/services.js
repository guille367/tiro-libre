angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('generalServices', [function(){

	var url = "http://localhost:3001";

	this.urlUsuarios = url + '/user';
	this.urlReservas = url + '/reservas';
	this.urlCanchas = url + '/cancha';
}]);
