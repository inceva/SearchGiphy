
var SearchGiphyApp = angular
    .module("SearchGiphyApp", [
        'ui.router',
        'ngRoute'
    ])
    .controller('_LoginController_', ['$scope', 'AuthService', function($scope, AuthService) {
        
        $scope.login = function () {
            return AuthService.login($scope.user); 
        };
    }])
    .config(function ($urlRouterProvider, $stateProvider) {
        'use strict';
        //$urlRouterProvider.otherwise('/');
        
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.htm',
                controller: function ($scope, $location) {
                    $scope.search = function () {
                        if (typeof $location.search().u !== 'undefined') {
                            $location.path('search').search('q', $scope.searchData).search('u', $location.search().u);
                        } else {
                            $location.path('search').search('q', $scope.searchData); //Pass search data to the search view
                        }
                    };
                }
            })
            .state('user', {
                url: '/user',
                templateUrl: 'templates/add-user.htm',
                controller: function ($scope, $location, $http) {
                    $scope.save = function () {
                        return $http.post('http://localhost:3000/signup', $scope.user)
                            .success(function(response) {
                                alert(JSON.stringify(response));
                                return response.data;
                            })  
                    };
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.htm',
                controller: '_LoginController_'
            })
            .state('search', {
                url: '/search',
                templateUrl: 'templates/result.htm',
                controller: [ '$scope', 'gif', function ($scope, gif) {
                    $scope.gif = gif;
                }],
                resolve: {
                    gif: ['$http', '$location', function ($http, $location) {console.log($location.search())
                        if (typeof $location.search().u === 'undefined') {
                            $location.path('login');
                        }
                        return $http.get('http://localhost:3000/search?q=' + $location.search().q,{
                            headers: {'Authorization': 'Basic ' + $location.search().u},
                            data: $location.search()
                        })
                            .error(function (response) {
                                $location.path('login');
                            })
                        .success(function (response) {
                                return response.data;
                            })
                            .then(function(response){
                                return response.data;
                            }).then(function(response){
                                return response.data;
                            });
                    }]
                }
            });
    });
