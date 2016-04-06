
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
		saving: false,
		state: {},
		serialize: function() {
			return JSON.stringify($scope.state, null, "  ");
		},
		addMatch: function($event, rule) {
			$event.preventDefault();
			$event.stopPropagation();
			rule.match.push("");
		},
		addSong: function($event, rule) {
			$event.preventDefault();
			$event.stopPropagation();
			rule.playlist.push("");
		},
		addRule: function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.state.rules.push({
				match: [
				"*://*.google.com/*",
				"*://google.com/*"
				],
				playlist: []
			});
		},
		submit: function($invalid) {
			if ($invalid) {
				return;
			}

			angular.extend($scope, {
				saving: true
			});
			setTimeout(function() {
				angular.extend($scope, {
					saving: false
				});
				$scope.$apply();
			}, 1500);
		}
	});
}])
.controller('RulesCtrl', ['$scope', function($scope) {
	
}]);