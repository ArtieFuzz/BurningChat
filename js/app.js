var colors = [
    'aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal'
];

var app = angular.module('app', ['firebase', 'ngCookies', 'luegg.directives', 'ngImgur', 'burningForeignLanguage', 'burningChatRenderer']);

app.value('firebaseRef', new Firebase('https://burningchat.firebaseio.com'));

app.value('bflConfig', {
    baseUrl : '/bfl/',
    defaultLang : 'en_US',
    langs : [
        'en_US',
        'ko_KR'
    ]
});

app.controller('controller', function($scope, $http, $firebase, $cookies, imgur, firebaseRef, $bfl, $translate) {

    imgur.setAPIKey('Client-ID 77ced1743b47ed0')

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
        var type;
        var msg = $scope.me.text;
        if (msg.slice(0, 4) === 'http') {
            //var footer = msg.slice(-4, 0);
            type = 'link';
        } else {
            type = 'msg';
        }
        $msgRef.$push({
            type : type,
            time : new Date().getTime(),
            nick : $scope.me.nick,
            msg : msg
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

    angular.element(document.getElementById('imgUpload')).on('change', function(e) {
        var file = e.target.files[0];
        imgur.upload(file).then(function(model) {
            $msgRef.$push({
                type : 'img',
                time : new Date().getTime(),
                nick : $scope.me.nick,
                msg : model.link,
                name : file.name
            });
        });
    });

    $msgRef.$push({
        type : 'log',
        time : new Date().getTime(),
        nick : $scope.me.nick,
        msg : 'Joined here'
    });
});
