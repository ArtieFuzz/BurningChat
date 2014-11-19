var config = {
    server : 'https://burningchat.firebaseio.com',
    colors : [
        'aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal'
    ]
};

var app = angular.module('app', ['firebase', 'ngCookies', 'luegg.directives', 'burningForeignLanguage']);

app.value('firebase', new Firebase(config.server));

app.value('bflConfig', {
    baseUrl : '/bfl/',
    defaultLang : 'en_US',
    langs : [
        'en_US',
        'ko_KR'
    ]
});

app.controller('controller', function($scope, $firebase, $cookies, firebase, bflLanguage) {

    $scope.langs = bflLanguage.langs;
    $scope.setLang = bflLanguage.setLang;

    var $msgRef = $firebase(firebase.child('msg'));
    var $userRef = $firebase(firebase.child('user'));

    var me = {
        nick : $cookies.burningchat_nick || 'John Smith',
        text : '',
        style: {
            color : $cookies.burningchat_color || config.colors[Math.floor(Math.random() * config.colors.length)]
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

    $scope.$watch('me', function() {
        $cookies.burningchat_nick = $scope.me.nick;
        $cookies.burningchat_color = $scope.me.style.color;
    }, true);

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
    }
});