angular.module('app.services')

.service('torneosService',['$http','generalServices',function($http,generalServices){

    this.getTorneos = function(){
        return $http.get(generalServices.urlTorneos + '/')
            .then(function(d){
                return d;
            })
            .catch(function(e){
                throw e;
            });
    }

}]);