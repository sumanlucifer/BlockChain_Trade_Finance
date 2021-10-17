sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"temp/L_C/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("temp.L_C.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {

			const oSelf = this;
			// Storage Instance
			sap.ui.require(["sap/ui/util/Storage"], function (Storage) {
				oSelf.oMyStorage = new Storage(Storage.Type.session);
				// if (!oSelf.oMyStorage.get("data")) {
				// 	// oSelf._oLoginDialog.open();
				// 	// enable routing
				// 	oSelf.onEscapePreventDialog();
				// } else {
				// 	// enable routing
				// 	oSelf.getRouter().initialize();
				// }
			});

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});