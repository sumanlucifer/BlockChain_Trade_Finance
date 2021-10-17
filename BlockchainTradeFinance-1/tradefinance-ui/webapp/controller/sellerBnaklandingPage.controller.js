sap.ui.define([
	"./BaseController",
	"sap/m/PDFViewer",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"temp/L_C/formatter/formatter"
], function (BaseController, PDFViewer, JSONModel, Filter, FilterOperator, formatter) {
	"use strict";
	var that;
	return BaseController.extend("temp.L_C.controller.sellerBnaklandingPage", {
		formatter: formatter,
		onInit: function () {
			that = this;

			that.buyerlccreateModel = new JSONModel();
			that.getView().setModel(that.buyerlccreateModel, "buyerlccreateModel");

			this.getRouter().getRoute("sellerBnaklandingPage").attachMatched(this.onsellerBankMatched, this);
		},
		onsellerBankMatched: function () {
			that.loadSBankNewLC();
			that.loadSBankReviwedLC();
			that.loadSBankTile();

		},
		loadSBankNewLC: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbystatus/APP_BUYER_BANK",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					that.getView().getModel("buyerlccreateModel").setProperty("/sellerBankcs", data);
					that.getView().getModel("buyerlccreateModel").refresh(true);
					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oerror) {
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},

		loadSBankReviwedLC: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbyAllStatus?status=REJ_BUYER_BANK,APP_SELLER_BANK,REJ_SELLER_BANK,GOODS_DIS_PEN,PAYMENT_PROGRESS,COMPLETED",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					that.getView().getModel("buyerlccreateModel").setProperty("/sBankReviwedlcs", data);
					that.getView().getModel("buyerlccreateModel").refresh(true);
					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oerror) {
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},

		loadSBankTile: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllCounts",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (odata) {
					that.getView().getModel("buyerlccreateModel").setProperty("/SubmittedByBuyer", odata.data.APP_BUYER_BANK);
					that.getView().getModel("buyerlccreateModel").setProperty("/submitList", (odata.data.COMPLETED + odata.data.REJ_BUYER_BANK +
						odata.data.APP_SELLER_BANK + odata.data.REJ_SELLER_BANK + odata.data.GOODS_DIS_PEN + odata.data.PAYMENT_PROGRESS));
					that.getView().getModel("buyerlccreateModel").setProperty("/completeList", odata.data.COMPLETED);

					that.getView().getModel("buyerlccreateModel").setProperty("/accountBalanceList", odata.data.accountBalance);

					that.getView().getModel("buyerlccreateModel").refresh(true);
					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oerror) {
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},

		/*navigation from new lc to details view with approve and cancel button*/
		newSubmiitedSBDetails: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();

			this.getRouter().navTo("newlcsellerbankviewDetails", {
				tokenPath: oTokenPathID,
				sLCId: oBindingContext.getProperty("LCId")
			});

		},

		/*navigation from  reviwed lc landing page to submit lc page with back button*/
		newReviwedSBDetails: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();

			this.getRouter().navTo("newlcsellerbankviewDetails", {
				tokenPath: oTokenPathID,
				sLCId: oBindingContext.getProperty("LCId")
			});
		},

		handleFilterButtonPressed: function (oEvent) {
			var value = oEvent.getParameters().newValue;
			if (value === undefined) {
				value = oEvent.getParameters().query;
			}
			var oTable = this.getView().byId("PendingTable");
			var filters = new Filter([
				new Filter("l_cNo", FilterOperator.Contains, value),
				new Filter("productName", FilterOperator.Contains, value),
				new Filter("buyerName", FilterOperator.Contains, value),
				new Filter("sellername", FilterOperator.Contains, value),
				// new Filter("l_cValue", FilterOperator.EQ, value)

			]);

			oTable.getBinding("items").filter(filters);

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf temp.L_C.view.sellerBnaklandingPage
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf temp.L_C.view.sellerBnaklandingPage
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf temp.L_C.view.sellerBnaklandingPage
		 */
		//	onExit: function() {
		//
		//	}

	});

});