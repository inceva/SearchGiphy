SearchGiphyApp
.factory("AuthService", ['$location', '$http', function ($location, $http) {
    'use strict';
    return {
        login: function (credentials) {
            var creds = btoa( credentials.username + ':' + credentials.password);
            return $http.get('http://' + credentials.username + ':' + credentials.password + '@localhost:3000/login', {
                headers: {'Authorization': 'Basic ' + creds}
            })
                .success(function (response) {
                    if (typeof $location.search().q !== 'undefined') {
                        $location.path('search').search('q', $location.search().q).search('u', creds);
                    } else {
                        $location.path('').search('u', creds);
                    }
                })
                .error(function (response) {
                    $location.path('login');
                });
        }
    };
}]);