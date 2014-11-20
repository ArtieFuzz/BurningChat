var colors = [
    'aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal'
];

var app = angular.module('app', ['firebase', 'ngCookies', 'luegg.directives', 'burningForeignLanguage', 'burningChatRenderer']);

app.value('firebaseRef', new Firebase('https://burningchat.firebaseio.com'));

app.value('bflConfig', {
    baseUrl : '/bfl/',
    defaultLang : 'en_US',
    langs : [
        'en_US',
        'ko_KR'
    ]
});

app.controller('controller', function($scope, $firebase, $cookies, firebaseRef, bflService) {

    $scope.langs = bflService.langs;
    $scope.setLang = bflService.setLang;

    var $msgRef = $firebase(firebaseRef.child('message'));
    var $userRef = $firebase(firebaseRef.child('user'));

    var me = {
        nick : $cookies.burningchat_nick || 'John Smith',
        text : '',
        style: {
            color : colors[Math.floor(Math.random() * colors.length)]
        }
    };
    $scope.me = me;

    if ($cookies.burningchat_id) {
        $userRef.$set($cookies.burningchat_id, me).then(function(myRef) {
            myRef.onDisconnect().remove();
            $firebase(myRef).$asObject().$bindTo($scope, 'me');
        });
    } else {
        $userRef.$push(me).then(function(myRef) {
            $cookies.burningchat_id = myRef.key();
            myRef.onDisconnect().remove();
            $firebase(myRef).$asObject().$bindTo($scope, 'me');
        });
    }

    $scope.$watch('me.nick', function() {
        if (!$scope.me.nick) return;
        $cookies.burningchat_nick = $scope.me.nick;
    });

    $scope.lines = $msgRef.$asArray();
    $scope.users = $userRef.$asArray();

    $scope.send = function() {
        if (!$scope.me.text) return;
        $msgRef.$push({
            type : 'msg',
            time : new Date().getTime(),
            nick : $scope.me.nick,
            msg : $scope.me.text
        });
        $scope.me.text = '';
    };

    $scope.locale = function(time) {
        return moment.utc(time).local().format($scope.timestamp);
    };

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
    };

    $msgRef.$push({
        type : 'log',
        time : new Date().getTime(),
        nick : $scope.me.nick,
        msg : 'Joined here'
    });
});