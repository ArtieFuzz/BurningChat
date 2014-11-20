(function(angular){
    'use strict';

    angular.module('burningForeignLanguage', [])
        .factory('bflService', function($http, bflConfig) {
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
        .directive('bflTranslate', function(bflService) {
            return {
                link : function(scope, element, attrs) {
                    scope.$watch(function() {
                        return bflService.dictionary
                    }, function(dictionary) {
                        element.text(
                            dictionary[bflService.prvDict.indexOf(element.text())] ||
                            bflService.defaultDict[bflService.prvDict.indexOf(element.text())] ||
                            element.text()
                        );
                    }, true);
                }
            }
        })
        .directive('bflInit', function(bflService) {
            return {
                link : function(scope, element, attrs) {
                    var target = attrs.bflInit;
                    scope[target] = target;
                    scope.$watch(function() {
                        return bflService.dictionary
                    }, function(dictionary) {
                        scope[target] = dictionary[bflService.defaultDict.indexOf(target)] ||
                        target;
                    }, true);
                }
            }
        })
        .directive('bflLanguage', function(bflService) {
            return {
                link : function(scope, element, attrs) {
                    bflService.setLang(attrs.bflLanguage);
                }
            }
        });

}(angular));