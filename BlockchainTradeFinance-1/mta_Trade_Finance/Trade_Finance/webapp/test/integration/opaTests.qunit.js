/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"temp/L_C/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});