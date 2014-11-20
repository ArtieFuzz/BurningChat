(function(angular){
    'use strict';

    angular.module('burningForeignLanguage', [])
        .factory('$bfl', function($http, bflConfig) {
            var result = {
                langs : bflConfig.langs,
                defaultLang : bflConfig.defaultLang,
                lang : bflConfig.defaultLang,
                dictionary : [],
                prvDict : [],
                defaultDict : []
            };
            $http.get(bflConfig.baseUrl + result.defaultLang).success(function(data) {
                result.defaultDict = data;
                result.dictionary = data;
                result.prvDict = data;
            });
            result.setLang = function(newLang) {
                for (var i in bflConfig.langs) {
                    if (bflConfig.langs[i] === newLang) {
                        result.lang = newLang;
                        $http.get(bflConfig.baseUrl + result.lang).success(function (data) {
                            result.prvDict = result.dictionary;
                            result.dictionary = data;

                        }).error(function() {
                            result.prvDict = result.dictionary;
                            result.dictionary = [];
                        });

                        return;
                    }
                }
            };
            return result;
        })
        .factory('$translate', function($bfl) {
            return function translate(target) {
                return $bfl.dictionary[$bfl.defaultDict.indexOf(target)];
            }
        })
        .directive('bflTranslate', function($bfl) {
            return {
                link : function(scope, element, attrs) {
                    scope.$watch(function() {
                        return $bfl.dictionary
                    }, function(dictionary) {
                        element.text(
                            dictionary[$bfl.prvDict.indexOf(element.text())] ||
                            $bfl.defaultDict[$bfl.prvDict.indexOf(element.text())] ||
                            element.text()
                        );
                    }, true);
                }
            }
        })
        .directive('bflInit', function($bfl) {
            return {
                link : function(scope, element, attrs) {
                    var targets = attrs.bflInit.split(' ');
                    angular.forEach(targets, function each(target) {
                        scope[target] = target;
                        scope.$watch(function() {
                            return $bfl.dictionary
                        }, function(dictionary) {
                            scope[target] = dictionary[$bfl.defaultDict.indexOf(target)] ||
                                            target;
                        }, true);
                    });

                }
            }
        })
        .directive('bflLanguage', function($bfl) {
            return {
                link : function(scope, element, attrs) {
                    $bfl.setLang(attrs.bflLanguage);
                }
            }
        });

}(angular));