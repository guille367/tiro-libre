angular.module('app.controllers')

.controller('canchasCtroller',['$scope','$state','canchaService','$ionicLoading','gralFactory',function($scope,$state,canchaService,$ionicLoading,gralFactory){

	$scope.canchas = {};

	var getCanchas = function(){
        
        $ionicLoading.show();
        
        canchaService.getCanchas()
            .then(function(d){
                $ionicLoading.hide();
                $scope.canchas = d.data;
            })	
            .catch(function(e){
                $ionicLoading.hide();
                var err = e.data ? e.data : 'Vuelva a intentar más tarde';
                gralFactory.showError(err);
            });
    }

	$scope.verDisponibilidad = function(c){
        
        $state.go('calendario');
        /*
		canchaService.setCancha(c);
        
        $ionicLoading.show();
        canchaService.getReservasCancha(c._id)
            .then(function(d){
                $ionicLoading.hide();
                canchaService.setReservasCancha(d);
		        $state.go('calendario');
            })
            .catch(function(e){
                $ionicLoading.hide();
                gralFactory.showError('Comuníquese con el administrador.');
            });
        */
	}
    
    getCanchas();

}]);