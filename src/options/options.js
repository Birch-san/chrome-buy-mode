// if (!chrome || !chrome.i18n) {
// 	chrome = {
// 		i18n: {
// 			getMessage: function(key) {
// 				return key;
// 			}
// 		}
// 	}
// }

angular
.module('optionsApp', ['controllers'])
.module('controllers')
.controller('HtmlCtrl', ['$scope', function($scope) {
	angular.extend($scope, {
		lang: chrome.i18n.getMessage("@@ui_locale"),
		localized: function(key) {
			return chrome.i18n.getMessage(key);
		}
	});
}])
.controller('OptionsCtrl', ['$scope', function($scope) {
	function toObj() {
		return {
			rules: []
		};
	}

	angular.extend($scope, {
		serialize: function() {
			return JSON.stringify(toObj());
		}
	});
}])
.controller('RulesCtrl', ['$scope', function($scope) {

}])
.controller('RuleCtrl', ['$scope', function($scope) {

}]);