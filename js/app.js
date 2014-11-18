var config = {
    server : 'https://burningchat.firebaseio.com',
    colors : [
        'aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'
    ]
}

var app = angular.module('app', ['firebase']);

app.value('firebase', new Firebase(config.server));

app.controller('controller', function($scope, $firebase, firebase) {

    var $msgRef = $firebase(firebase.child('msg'));
    var $userRef = $firebase(firebase.child('user'));
    var color = config.colors[Math.floor(Math.random() * config.colors.length)];

    var me = {
        nick : 'John Smith',
        text : '',
        style: {
            color : color
        }
    }
    $userRef.$push(me).then(function(myRef) {
        myRef.onDisconnect().remove();
        $firebase(myRef).$asObject().$bindTo($scope, 'me');
    });

    $scope.lines = $msgRef.$asArray();
    $scope.users = $userRef.$asArray();

    $scope.send = function() {
        $msgRef.$push({
            time : new Date().getTime(),
            nick : $scope.me.nick,
            msg : $scope.me.text
        });
        $scope.me.text = '';
    }

    $scope.locale = function(time) {
        return moment.utc(time).local().format($scope.timestamp);
    }
});