sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	var that;

	return BaseController.extend("temp.L_C.controller.newlcbuyerbankviewDetails", {

		onInit: function () {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			that = this;
			this.setModel(oViewModel, "buyerbankPendingView");
			this.getRouter().getRoute("newlcbuyerbankviewDetails").attachMatched(this.onBuyerSubmittedMatched, this);

		},

		onBuyerSubmittedMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments"),

				sBuyerPendingUri = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getlcdatabyID/" + oArgs.sLCId;
			this.sLCid = oArgs.sLCId;

			this.getModel("BuyerSubmittedModel").loadData(sBuyerPendingUri,
				null, true, "GET", null,
				false, {
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address
				}).then(function () {

				that.getView().getModel("buyerbankPendingView").setProperty("/token", that.getModel("BuyerSubmittedModel").getProperty(
					"/data/LCTokenNumber"));

			}).catch(function (oError) {
				sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).status.message : oError.message);
			});

		},

		/* buyerbankPending view details submit functionality*/
		// buyerViewApprove: function () {

		// 	var oPayload = {

		// 		"LCId": this.sLCid,

		// 		"LCStatus": "Submit"

		// 	};

		// 	sap.ui.core.BusyIndicator.show();

		// 	jQuery.ajax({

		// 		type: "PUT",
		// 		url: "http://localhost:3000/api/updateLCStatus",
		// 		data: JSON.stringify(oPayload),
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"Accept": "application/json",
		// 			"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
		// 			address: that.getOwnerComponent().oMyStorage.get("data").address

		// 		},

		// 		success: function (odata) {
		// 			sap.m.MessageToast.show(odata.message);
		// 			that.getRouter().navTo("Dashboard");
		// 			sap.ui.core.BusyIndicator.hide();

		// 		},
		// 		error: function (oError) {

		// 			sap.m.MessageToast.show(oError.message);
		// 			sap.ui.core.BusyIndicator.hide();
		// 		}

		// 	});

		// },

		buyerbankapproveback: function () {
			that.getRouter().navTo("buyerBank");
		},

		pendingviewdeatilcancel: function () {
			that.getRouter().navTo("buyerBank");

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf temp.L_C.view.newlcbuyerbankviewDetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf temp.L_C.view.newlcbuyerbankviewDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf temp.L_C.view.newlcbuyerbankviewDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});