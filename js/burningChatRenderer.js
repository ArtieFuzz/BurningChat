(function(angular){
    'use strict';

    angular.module('burningChatRenderer', [])
        .directive('bcRender', function($compile) {

            var prefix = '<span ng-if="timestamp">[{{locale(line.time)}}]</span><{{line.nick}}> ';

            var template = {};
            template.msg = prefix + '{{line.msg}}';
            template.link = prefix + '<a href="{{line.msg}}"></a>';
            template.img = prefix + '{{line.name}}<br><img ng-if="img" src="{{line.msg}}"><a href="{{line.msg}}"></a></img><a ng-if="!img" href="{{line.msg}}">';
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