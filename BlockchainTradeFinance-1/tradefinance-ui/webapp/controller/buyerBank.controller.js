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
	return BaseController.extend("temp.L_C.controller.buyerBank", {
		formatter: formatter,
		onInit: function () {

			that = this;

			that.buyerlccreateModel = new JSONModel();
			that.getView().setModel(that.buyerlccreateModel, "buyerlccreateModel");

			this.getRouter().getRoute("buyerBank").attachMatched(this.onbuyerBankMatched, this);

		},

		onbuyerBankMatched: function () {
			that.loadNewLC();
			that.loadReviwedLC();
			that.loadTile();

		},

		/* loadTile detais */
		loadTile: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllCounts",
				// "http://localhost:3000/api/getAllCounts",

				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (odata) {
					that.getView().getModel("buyerlccreateModel").setProperty("/SubmittedByBuyer", odata.data.SUB_BUYER);
					that.getView().getModel("buyerlccreateModel").setProperty("/submitList", (odata.data.COMPLETED + odata.data.APP_BUYER_BANK +
						odata.data.REJ_BUYER_BANK + odata.data.APP_SELLER_BANK + odata.data.REJ_SELLER_BANK + odata.data.GOODS_DIS_PEN + odata.data
						.PAYMENT_PROGRESS
					));
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

		/*loadNew lc details*/
		loadNewLC: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbystatus/SUB_BUYER",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					that.getView().getModel("buyerlccreateModel").setProperty("/submittedlcs", data);
					that.getView().getModel("buyerlccreateModel").refresh(true);
					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oerror) {
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},

		/*loadReviwedLC lc deatils*/
		loadReviwedLC: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbyAllStatus?status=APP_BUYER_BANK,REJ_BUYER_BANK,APP_SELLER_BANK,REJ_SELLER_BANK,GOODS_DIS_PEN,PAYMENT_PROGRESS,COMPLETED",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					that.getView().getModel("buyerlccreateModel").setProperty("/submittinglcs", data);
					that.getView().getModel("buyerlccreateModel").refresh(true);
					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oerror) {
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},

		/* open Approvefragment*/
		onApproveDialogPress: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oBindingContextPath = oBindingContext.getPath();
			var oContextData = oBindingContext.getObject();

			// this.lcID = oContextData.LCId;
			this.lcToken = oContextData.LCTokenNumber;

			this.getModel("buyerlccreateModel").setProperty("/tokenNum", this.lcToken);

			var approvefrag = "temp.L_C.fragment.approve";
			if (!sap.ui.getCore().oApproveDialog) {
				sap.ui.getCore().oApproveDialog = sap.ui.xmlfragment(
					approvefrag,
					this);
			}

			this.getView().addDependent(sap.ui.getCore().oApproveDialog);
			sap.ui.getCore().oApproveDialog.bindElement({
				path: oBindingContextPath,
				model: "buyerlccreateModel"
			});
			sap.ui.getCore().oApproveDialog.open();

		},

		/*approving new lc's*/
		approveNewLC: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");

			var oContextData = oBindingContext.getObject();

			this.lcID = oContextData.LCId;

			var oPayload = {

				"LCId": this.lcID,

				"LCStatus": "SUB_BUYER"

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

					that.loadNewLC();
					that.loadTile();
					sap.m.MessageToast.show(odata.message);

					sap.ui.getCore().oApproveDialog.close();

					sap.ui.core.BusyIndicator.hide();

				},
				error: function (oError) {

					sap.m.MessageToast.show(oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});
		},

		onpressapproveClose: function () {
			sap.ui.getCore().oApproveDialog.close();
		},

		/*navigation from new lc to details view with approve and cancel button*/
		newSubmiitedSBDetails: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();

			this.getRouter().navTo("newlcbuyerbankviewDetails", {
				tokenPath: oTokenPathID,
				sLCId: oBindingContext.getProperty("LCId")
			});

		},
		/*navigation from  reviwed lc landing page to submit lc page with back button*/
		newReiwedDetails: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();

			this.getRouter().navTo("submitlcviewDetails", {
				tokenPath: oTokenPathID,
				sLCId: oBindingContext.getProperty("LCId")
			});
		},

		/*filter on new list */
		searchBuyerBank: function (oEvent) {
			var value = oEvent.getParameters().newValue;
			if (value === undefined) {
				value = oEvent.getParameters().query;
			}
			var oTable = this.getView().byId("PendingTable");
			var filters = new Filter([
				new Filter("LCTokenNumber", FilterOperator.Contains, value),
				new Filter("SEL_NAME", FilterOperator.Contains, value),
				new Filter("PROD_TYPE", FilterOperator.Contains, value),

			]);

			oTable.getBinding("items").filter(filters);

		},

		onAfterRendering: function () {

		},

		onExit: function () {

		}

	});

});