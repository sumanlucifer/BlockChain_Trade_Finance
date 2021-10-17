sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	var that;

	return BaseController.extend("temp.L_C.controller.submitlcviewDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf temp.L_C.view.submitlcviewDetails
		 */
		onInit: function () {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			that = this;
			this.setModel(oViewModel, "buyerSubmitView");
			this.getRouter().getRoute("submitlcviewDetails").attachMatched(this.onBuyerSubmittedMatched, this);

		},

		onBuyerSubmittedMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments"),

				sBuyerSmittigUri = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getlcdatabyID/" + oArgs.sLCId;
			this.sLCid = oArgs.sLCId;

			this.getModel("BuyerSubmitModel").loadData(sBuyerSmittigUri,
				null, true, "GET", null,
				false, {
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address
				}).then(function () {
				// var sOrdersData = oView.getModel("OrdersModel").getProperty("/data");
				that.getView().getModel("buyerSubmitView").setProperty("/token", that.getModel("BuyerSubmitModel").getProperty(
					"/data/LCTokenNumber"));

			}).catch(function (oError) {
				sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).status.message : oError.message);
			});

		},

		/* back button navigation for landing page*/

		buyerLCButtonCreateNav: function () {
			that.getRouter().navTo("Dashboard");
		},
		/*back button navigation for landing page*/

		submitBack: function () {
				that.getRouter().navTo("Dashboard");
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf temp.L_C.view.submitlcviewDetails
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf temp.L_C.view.submitlcviewDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf temp.L_C.view.submitlcviewDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});