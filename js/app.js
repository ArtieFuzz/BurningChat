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

app.controller('controller', function($scope, $http, $firebase, $cookies, firebaseRef, $bfl, $translate) {

    $scope.langs = $bfl.langs;
    $scope.setLang = $bfl.setLang;

    $scope.translate = $translate;

    $scope.timestamp = $cookies.burningchat_timestamp || 'hh:mm';

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

    $scope.$watch('me.nick', function(nick) {
        if (!nick) return;
        $cookies.burningchat_nick = nick;
    });

    $scope.$watch('timestamp', function(timestamp) {
        $cookies.burningchat_timestamp = timestamp;
    });

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

    var chat = {};
    var archive = {};

    chat.lines = $msgRef.$asArray();
    chat.elems = $userRef.$asArray();

    chat.submit = function() {
        if (!$scope.me.text) return;
        $msgRef.$push({
            type : 'msg',
            time : new Date().getTime(),
            nick : $scope.me.nick,
            msg : $scope.me.text
        });
        $scope.me.text = '';
    };

    chat.elemClick = function(elem) {

    }

    archive.lines = [];
    archive.elems = $firebase(firebaseRef.child('archive')).$asArray();

    archive.submit = function() {

    }

    archive.elemClick = function(elem) {
        $http.get('/archive/' + elem.name).success(function(data) {
            $scope.lines = data;
        })
    }

    $scope.$watch('isChat', function(isChat) {
        if (isChat) {
            $scope.lines = chat.lines;
            $scope.elems = chat.elems;
            $scope.submit = chat.submit;
            $scope.elemClick = chat.elemClick;
        } else {
            $scope.lines = archive.lines;
            $scope.elems = archive.elems;
            $scope.submit = archive.submit;
            $scope.elemClick = archive.elemClick;
        }
    });

    $msgRef.$push({
        type : 'log',
        time : new Date().getTime(),
        nick : $scope.me.nick,
        msg : 'Joined here'
    });
});