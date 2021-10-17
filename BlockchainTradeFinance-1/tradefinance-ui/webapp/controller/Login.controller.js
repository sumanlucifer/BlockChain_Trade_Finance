sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"

], function (Controller, MessageToast, JSONModel) {
	"use strict";
	var that;
	return Controller.extend("temp.L_C.controller.Login", {

		onInit: function () {

		},

		onLoginTap: function () {

			that = this;
			var emailId = this.getView().byId("uid").getValue();
			var passwrd = this.getView().byId("pasw").getValue();
			if (emailId !== "" && passwrd !== "") {
				//	var sUrParam = "userId="+userId+"&password="+password;
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var payload = {
					"email": emailId,
					"password": passwrd
				};
				$.ajax({
					// url: "/blockchainLC/api/user/login",
					/*local server url*/
					url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/login",
					// url: "/api/login",
					type: 'POST',
					data: JSON.stringify(payload),
					contentType: "application/json",

					success: function (odata) {

						var srole = odata.data.role;
						if (srole === "3") {
							oRouter.navTo("sellerlanding");
						} else if (srole === "4") {
							oRouter.navTo("Dashboard");
						} else if (srole === "5") {
							oRouter.navTo("buyerBank");
						} else if (srole === "6") {
							oRouter.navTo("sellerBnaklandingPage");
						}
						sap.m.MessageToast.show(odata.message);
						that.getOwnerComponent().oMyStorage.clear();
						that.getOwnerComponent().oMyStorage.put("data", odata.data);

					},

					error: function (oerror) {
						sap.m.MessageToast.show(oerror.message);

					}
				});
			} else {
				sap.m.MessageToast.show("Please enter valid emailId and password");
			}
		},

		onBeforeRendering: function () {

		},

		onAfterRendering: function () {

		},

		onExit: function () {

		}

	});

});