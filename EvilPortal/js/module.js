registerController("EvilPortalTabController", ['$api', '$scope', function($api, $scope) {

	$scope.tabs = [{
		title: "Evil Portal",
		url: "evilportal.controller.html"
	}, {
		title: "Configuration",
		url: "evilportal.config"
	}, {
		title: "Changes",
		url: "evilportal.change"
	}];

	$scope.currentTab = "evilportal.controller.html";

	$scope.onClickTab = function(tab) {
		$scope.currentTab = tab.url;
	}

	$scope.isActiveTab = function(tabUrl) {
		return tabUrl == $scope.currentTab;
	}

}]);

registerController("EvilPortalController", ['$api', '$scope', function($api, $scope) {

	getControls();

	$scope.portals = [
	{
		title: "Portal1"
	},
	{
		title: "Portal2"
	},
	{
		title: "Portal3"
	},
	{
		title: "Portal4"
	}];

	$scope.messages = [];

	$scope.throbber = true;

	$scope.handleControl = function(control) {
		control.throbber = true;
		switch (control.title) {
			case "Dependencies":
				$api.request({
					module: "EvilPortal",
					action: "handleDepends"
				}, function(response) {
					getControls();
					control.throbber = false;
					$scope.sendMessage(control.title, response.control_message);
				});
				break;

			case "NoDogSplash":
				$api.request({
					module: "EvilPortal",
					action: "startStop"
				}, function(response) {
					getControls();
					control.throbber = false;
					$scope.sendMessage(control.title, response.control_message);
				});
				break;

			case "Auto Start":
				$api.request({
					module: "EvilPortal",
					action: "enableDisable"
				}, function(response) {
					getControls();
					control.throbber = false;
					$scope.sendMessage(control.title, response.control_message);
				});
				break;
		}
	}

	$scope.sendMessage = function(t, m) {
		// Add a new message to the top of the list
		$scope.messages.unshift({title: t, msg: m});

		// if there are 4 items in the list remove the 4th item
		if ($scope.messages.length == 4) {
			$scope.dismissMessage(3);
		}
	}

	$scope.dismissMessage = function($index) {
		//var index = $scope.messages.indexOf(message);
		$scope.messages.splice($index, 1);
	}

	function getControls() {
		$scope.throbber = true;
		$api.request({
			module: "EvilPortal",
			action: "getControlValues"
		}, function(response) {
			updateControls(response);
		});
	}

	function updateControls(response) {
		var deps;
		var running;
		var autostart;
		if (response.dependencies == false) {
			deps = "Install";
			$scope.sendMessage("Missing Dependencies", "NoDogSplash must first be installed before you can use Evil Portal");
		} else {
			deps = "Uninstall";
		}
		if (response.running == false) {
			running = "Start";
		} else {
			running = "Stop";
		}
		if (response.autostart == false) {
			autostart = "Enable";
		} else {
			autostart = "Disable";
		}
		//alert(deps);
		$scope.controls = [
		{
			title: "Dependencies",
			status: deps,
			visible: true,
			throbber: false
		},
		{
			title: "NoDogSplash",
			status: running,
			visible: response.dependencies,
			throbber: false
		},
		{
			title: "Auto Start",
			status: autostart,
			visible: response.dependencies,
			throbber: false
		}];
		$scope.throbber = false;
	}

}]);