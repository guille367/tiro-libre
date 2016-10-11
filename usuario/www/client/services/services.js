angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('generalServices', [function(){

	var url = "http://localhost:3003";

	this.urlUsuarios = url + '/user';

	this.urlReservas = url + '/reservas';

}]);