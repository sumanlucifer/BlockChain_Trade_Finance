sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
], function (BaseController, MessageToast, JSONModel) {
	"use strict";

	return BaseController.extend("Trade_Finance.Trade_Finance.controller.Login", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Login").attachPatternMatched(this.onLoginMatched, this);
		},

		onLoginMatched: function () {
			var clear = "";
			clear = (sap.ui.getCore().oApproveDialog) ? sap.ui.getCore().oApproveDialog = "" : "";
			clear = (sap.ui.getCore().osdRejectionDialog) ? sap.ui.getCore().oRejectionDialog = "" : "";
			clear = (sap.ui.getCore().oblUploadDialog) ? sap.ui.getCore().oblUploadDialog = "" : "";
			clear = (sap.ui.getCore().oblPreviewDialog) ? sap.ui.getCore().oblPreviewDialog = "" : "";
			clear = (this._oBusyDialog) ? this._oBusyDialog = "" : "";
			clear = (this._oPopover) ? this._oPopover = "" : "";
			clear = (sap.ui.getCore().oSubmitDialog) ? sap.ui.getCore().oSubmitDialog = "" : "";
			clear = (sap.ui.getCore().oDeleteDialog) ? sap.ui.getCore().oDeleteDialog = "" : "";

			this.getView().byId("uid").setValue("");
			this.getView().byId("pasw").setValue("");
		},

		onLoginTap: function () {
			// this.onCbusyOpen();
			var that = this;
			var emailId = this.getView().byId("uid").getValue();
			var passwrd = this.getView().byId("pasw").getValue();
			if (emailId !== "" && passwrd !== "") {
				//	var sUrParam = "userId="+userId+"&password="+password;
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var payload = {
					"email": emailId,
					"password": passwrd
				};
				sap.ui.core.BusyIndicator.show();
				$.ajax({
					// url: "/blockchainLC/api/login",
					/*local server url*/
					url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/login",
					// url: "/api/login",
					type: 'POST',
					data: JSON.stringify(payload),
					contentType: "application/json",
					success: function (odata) {
						if (odata.message == "Login Successful") {
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
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageToast.show(odata.message);
							that.getOwnerComponent().oMyStorage.clear();
							that.getOwnerComponent().oMyStorage.put("data", odata.data);
						} else {
							sap.m.MessageToast.show(odata.message);
							sap.ui.core.BusyIndicator.hide();
						}
						// that.onCbusyClose();

					},

					error: function (oError) {
						sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
						// that.onCbusyClose();
					}
				});
			} else {
				sap.m.MessageToast.show("Both fileds are mandatroy");
				// that.onCbusyClose();
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