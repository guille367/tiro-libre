angular.module('app.services', [])

.factory('gralFactory', ['$ionicPopup',function($ionicPopup){

    var gralFactory = {};
    
    gralFactory.showError = function(msg){
        $ionicPopup.alert({
            title: 'Error',
            template: msg,
            buttons:[{ text: 'Cerrar', type: 'button-assertive' }]
        });
    };
    
    gralFactory.showMessage = function(msg){
        $ionicPopup.alert({
            title: 'Mensaje',
            template: msg,
            buttons:[{ text: 'Aceptar', type: 'button-positive' }]
        });
    }
    
    return gralFactory;
    
}])

.service('generalServices', ['$http','$rootScope',function($http,$rootScope){

	//var url = "http://localhost:3001";
    var url = "http://192.168.43.208:3001";
    
    $rootScope.urlImagenes = url + '/img//';
	this.urlUsuarios = url + '/usuario';
	this.urlReservas = url + '/reserva';
	this.urlCanchas = url + '/cancha';
    this.urlTorneos = url + '/torneo';
    this.urlEquipos = url + '/equipo';
    
	this.getDatosClub = function (){
		return $http.get(url + '/configuracion/get')
					then(function(d){
						return d.data[0];
					})
					.catch(function(e){
						console.log(e);
					})
	}
    
    this.uploadImage = function(form){
        return $http.post(url + '/api/photo',form,
                    {transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}})
					then(function(d){
						return d.data[0];
					})
					.catch(function(e){
						throw e.data;
					})
    }
    
}]);
