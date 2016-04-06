
angular
.module('optionsApp', [])
.controller('HtmlCtrl', ['$scope', function($scope) {
	angular.extend($scope, {
		lang: chrome.i18n.getMessage("@@ui_locale"),
		localized: function(key) {
			return chrome.i18n.getMessage(key);
		}
	});
}])
.controller('OptionsCtrl', ['$scope', function($scope) {
	chrome.storage.sync.get("state", function(result) {
		var state;
		try {
			state = JSON.parse(result);
		} catch(err) {
		}
		if (!state) {
			state = {};
		}
		if (!state.rules || !state.rules.length) {
			angular.extend(state, {
				rules: [
				{
					"match": [
				    "*://*.birchlabs.co.uk/*",
				    "*://birchlabs.co.uk/*"
					],
					"playlist":
					[
					'../../music/elevator.mp3'
					]
				}
				]
			});
		}

		angular.extend($scope, {
			loading: false,
			state: state
		});
		$scope.$apply();
	});

	angular.extend($scope, {
		loading: true,
		state: {},
		serialize: function() {
			return JSON.stringify($scope.state, null, "  ");
		}
	});
}])
.controller('RulesCtrl', ['$scope', function($scope) {
	
}])
.controller('RuleCtrl', ['$scope', function($scope) {
	
}]);