angular
.module('optionsApp', [])
.controller('HtmlCtrl', ['$scope', function($scope) {
	angular.extend($scope, {
		lang: chrome.i18n.getUILanguage(),
		localized: function(key) {
			return chrome.i18n.getMessage(key);
		}
	});
}])