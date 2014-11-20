var app = angular.module('archive', ['firebase', 'burningForeignLanguage', 'burningChatRenderer']);

app.value('firebaseRef', new Firebase('https://burningchat.firebaseio.com'));

app.value('bflConfig', {
    baseUrl : '/bfl/',
    defaultLang : 'en_US',
    langs : [
        'en_US',
        'ko_KR'
    ]
});

app.controller('controller', function($scope, $http, $firebase, bflService, firebaseRef) {
    $scope.langs = bflService.langs;
    $scope.setLang = bflService.setLang;

    $scope.locale = function(time) {
        return moment.utc(time).local().format($scope.timestamp);
    }

    $scope.lines = [];

    $scope.files = $firebase(firebaseRef.child('archive')).$asArray();

    $scope.setArchive = function(name) {
        $http.get('/archive/' + name).success(function(data) {
            $scope.lines = data;
            console.log(data);
        });
    }

    $scope.show = function(line) {
        switch (line.type) {
            case 'msg':
            case 'link':
            case 'img':
                return true;
            case 'log':
                return $scope.log;
            default:
                return false;
        }
    }
});