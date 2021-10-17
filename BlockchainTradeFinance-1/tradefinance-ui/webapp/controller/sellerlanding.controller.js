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
	return BaseController.extend("temp.L_C.controller.sellerlanding", {
		formatter: formatter,
		onInit: function () {
			that = this;

			that.buyerlccreateModel = new JSONModel();
			that.getView().setModel(that.buyerlccreateModel, "buyerlccreateModel");

			this.getRouter().getRoute("sellerlanding").attachMatched(this.onsellerMatched, this);

		},
		onsellerMatched: function () {

			that.loadSellerNewLC();
			that.loadSellerReviwedLC();
			that.loadSellerTile();

		},
		/*loadNew lc details*/
		loadSellerNewLC: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbystatus/APP_SELLER_BANK",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					that.getView().getModel("buyerlccreateModel").setProperty("/sBanksubmittedlcs", data);
					that.getView().getModel("buyerlccreateModel").refresh(true);
					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oerror) {
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},
		/*loadReviwedLC lc deatils*/
		loadSellerReviwedLC: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbyAllStatus?status=REJ_BUYER_BANK,REJ_SELLER_BANK,GOODS_DIS_PEN,PAYMENT_PROGRESS,COMPLETED",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					that.getView().getModel("buyerlccreateModel").setProperty("/sBankRsubmittinglcs", data);
					that.getView().getModel("buyerlccreateModel").refresh(true);
					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oerror) {
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},
		loadSellerTile: function () {

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
					that.getView().getModel("buyerlccreateModel").setProperty("/SubmittedByBuyer", odata.data.APP_SELLER_BANK);
					that.getView().getModel("buyerlccreateModel").setProperty("/submitList", (odata.data.COMPLETED + odata.data.REJ_BUYER_BANK +
						odata.data.REJ_SELLER_BANK + odata.data.GOODS_DIS_PEN + odata.data.PAYMENT_PROGRESS));
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

		newlcpressseller: function () {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("newlcsellerviewDetails");

		},
		reviewedlcpressseller: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("reviwedlcsellerviewDetails");

		},
		searchSeller: function (oEvent) {
			var value = oEvent.getParameters().newValue;
			if (value === undefined) {
				value = oEvent.getParameters().query;
			}
			var oTable = this.getView().byId("PendingTable");
			var filters = new Filter([
				new Filter("LCTokenNumber", FilterOperator.Contains, value),
				new Filter("SEL_NAME", FilterOperator.Contains, value),
				new Filter("PROD_TYPE", FilterOperator.Contains, value),

				// new Filter("l_cValue", FilterOperator.EQ, value)

			]);

			oTable.getBinding("items").filter(filters);

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf temp.L_C.view.sellerlanding
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf temp.L_C.view.sellerlanding
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf temp.L_C.view.sellerlanding
		 */
		//	onExit: function() {
		//
		//	}

	});

});