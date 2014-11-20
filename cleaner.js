var exec = require('child_process').exec;
var fs = require('fs');
var Firebase = require('firebase');
var _ = require('underscore');

var firebaseio = 'https://burningchat.firebaseio.com';

function uid(len) {
    var az = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    var buf = [];
    for (var i=0;i<len;i++) {
        buf.push(az[Math.floor(Math.random() * az.length)]);
    }
    return buf.join('');
}

var firebase = new Firebase(firebaseio);
var fileName = uid(24);
var time = new Date().getTime();

var archives = firebase.child('archive');
var messages = firebase.child('message');

messages.once('value', function(snapshot) {
    messages.remove();
    fs.writeFile('./archive/' + fileName, JSON.stringify(_.values(snapshot.val())), {encoding : 'utf8'}, function(err) {
        if (err) {
            console.error('Error on writing file', err);
            return;
        }
        archives.push({
            prefix : time,
            name : fileName
        }, function(err) {
            if (err) {
                console.error('Error on pushing archive data', err);
                return;
            }
            var child = exec('firebase deploy', function(stderr, stdout, err) {
                console.log('stdout : ' + stdout);
                console.error('stderr : ' + stderr);
                console.error('err : ' + err);
            });
            child.on('exit', function() {
                process.exit();
            })
        });
    });
});