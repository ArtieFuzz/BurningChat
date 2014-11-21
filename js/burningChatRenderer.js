(function(angular){
    'use strict';

    angular.module('burningChatRenderer', [])
        .directive('bcRender', function($compile) {

            var prefix = '<span ng-if="timestamp">[{{locale(line.time)}}]</span><{{line.nick}}> ';

            var template = {};
            template.msg = prefix + '{{line.msg}}';
            template.link = prefix + '<a href="{{line.msg}}">Click me!</a>';
            template.img = prefix + '<span ng-if="img">{{line.name}}<br></span><img ng-if="img" src="{{line.msg}}"><a ng-if="!img" href="{{line.msg}}">{{line.name}}</a>';
            template.log = '<span class="log"><small>' + prefix + '<span bfl-translate>{{line.msg}}</span></small></span>';

            return {
                link : function(scope, element, attrs) {
                    var line = scope[attrs.bcRender];
                    if (!line) {
                        return;
                    }
                    element.append($compile(template[line.type] || 'error!')(scope));
                }
            }
        });

})(angular)