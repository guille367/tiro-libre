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
            title: 'Error',
            template: msg,
            buttons:[{ text: 'Aceptar', type: 'button-positive' }]
        });
    }
    
    return gralFactory;
    
}])

.service('generalServices', ['$http',function($http){

	var url = "http://localhost:3001";

	this.urlUsuarios = url + '/usuario';
	this.urlReservas = url + '/reserva';
	this.urlCanchas = url + '/cancha';
    this.urlTorneos = url + '/torneos';
    
	this.getDatosClub = function (){
		return $http.get(url + '/configuracion/get')
					then(function(d){
						return d.data[0];
					})
					.catch(function(e){
						console.log(e);
					})
	}
    
}]);
