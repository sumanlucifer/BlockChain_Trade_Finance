sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"

], function (BaseController, JSONModel) {
	"use strict";
	var that;
	return BaseController.extend("temp.L_C.controller.buyerpendingviewDetails", {

		onInit: function () {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			that = this;
			this.setModel(oViewModel, "buyerPendingView");
			this.getRouter().getRoute("buyerpendingviewDetails").attachMatched(this.onBuyerPendingMatched, this);
		},

		onBuyerPendingMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments"),

				sBuyerPendingUri = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getlcdatabyID/" + oArgs.sLCId;
			this.sLCid = oArgs.sLCId;

			this.getModel("BuyerPendingModel").loadData(sBuyerPendingUri,
				null, true, "GET", null,
				false, {
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address
				}).then(function () {

				that.getView().getModel("buyerPendingView").setProperty("/token", that.getModel("BuyerPendingModel").getProperty(
					"/data/LCTokenNumber"));

			}).catch(function (oError) {
				sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).status.message : oError.message);
			});

		},
		/* buyerPending view details submit functionality*/
		buyerViewSubmit: function () {

			var oPayload = {

				"LCId": this.sLCid,

				"LCStatus": "Submit"

			};

			sap.ui.core.BusyIndicator.show();

			jQuery.ajax({

				type: "PUT",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/updateLCStatus",
				data: JSON.stringify(oPayload),
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},

				success: function (odata) {
					sap.m.MessageToast.show(odata.message);
					that.getRouter().navTo("Dashboard");
					sap.ui.core.BusyIndicator.hide();

				},
				error: function (oError) {

					sap.m.MessageToast.show(oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},

		buyerLCButtonCreateNav: function () {
			that.getRouter().navTo("Dashboard");
		},

		pendingviewdeatilcancel: function () {
			that.getRouter().navTo("Dashboard");
		}

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf temp.L_C.view.buyerpendingviewDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf temp.L_C.view.buyerpendingviewDetails
		 */
		//	onExit: function() {
		//
		//	}
	});
});