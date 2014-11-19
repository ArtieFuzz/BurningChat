(function(angular){
    'use strict';

    angular.module('burningForeignLanguage', [])
        .factory('bflLanguage', function($http, bflConfig) {
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
        .directive('bflTranslate', function(bflLanguage) {
            return {
                link : function(scope, element, attrs) {
                    scope.$watch(function() {
                        return bflLanguage.dictionary
                    }, function(dictionary) {
                        element.text(
                            dictionary[bflLanguage.prvDict.indexOf(element.text())] ||
                            bflLanguage.defaultDict[bflLanguage.prvDict.indexOf(element.text())] ||
                            element.text()
                        );
                    })
                }
            }
        });

}(angular));