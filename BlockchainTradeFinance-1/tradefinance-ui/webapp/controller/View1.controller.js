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
	return BaseController.extend("temp.L_C.controller.View1", {
		formatter: formatter,
		onInit: function () {
			that = this;

			that.buyerlccreateModel = new JSONModel();
			that.getView().setModel(that.buyerlccreateModel, "buyerlccreateModel");

			this.getRouter().getRoute("Dashboard").attachMatched(this.onDashboardMatched, this);
		},

		onDashboardMatched: function () {
			that.loadPendingLC();
			that.loadSubmittedLC();
			that.loadTile();

		},

		/* loadTile detais */
		loadTile: function () {

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
					that.getView().getModel("buyerlccreateModel").setProperty("/pendingList", odata.data.PENDING);
					that.getView().getModel("buyerlccreateModel").setProperty("/submitList", odata.data.SUB_BUYER);
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

		/*loadpending lc details*/
		loadPendingLC: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbystatus/PENDING",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					that.getView().getModel("buyerlccreateModel").setProperty("/pendinglcs", data);
					that.getView().getModel("buyerlccreateModel").refresh(true);
					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oerror) {
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},

		/*loadsubmitted lc deatils*/
		loadSubmittedLC: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbyAllStatus?status=SUB_BUYER,APP_BUYER_BANK,REJ_BUYER_BANK,APP_SELLER_BANK,REJ_SELLER_BANK,GOODS_DIS_PEN, PAYMENT_PROGRESS,COMPLETED",
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

		/* open submit fragment*/
		onSubmitDialogPress: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oBindingContextPath = oBindingContext.getPath();
			var oContextData = oBindingContext.getObject();

			// this.lcID = oContextData.LCId;
			this.lcToken = oContextData.LCTokenNumber;

			this.getModel("buyerlccreateModel").setProperty("/tokenNum", this.lcToken);

			var submitfrag = "temp.L_C.fragment.submitDialouge";
			if (!sap.ui.getCore().oSubmitDialog) {
				sap.ui.getCore().oSubmitDialog = sap.ui.xmlfragment(
					submitfrag,
					this);
			}

			this.getView().addDependent(sap.ui.getCore().oSubmitDialog);
			sap.ui.getCore().oSubmitDialog.bindElement({
				path: oBindingContextPath,
				model: "buyerlccreateModel"
			});
			sap.ui.getCore().oSubmitDialog.open();

			// if (!this.oSubmitDialog) {
			// 	this.oSubmitDialog = new sap.ui.xmlfragment("creatsubmitFrag", "temp.L_C.fragment.submitDialouge",
			// 		this);
			// 	this.getView().addDependent(this.oSubmitDialog);
			// }
			// this.oSubmitDialog.open();

		},

		uploadbill: function () {
			if (!this.oSubmitDialog) {
				this.oSubmitDialog = new sap.ui.xmlfragment("creatsubmitFrag", "temp.L_C.fragment.submitDialouge",
					this);
				this.getView().addDependent(this.oSubmitDialog);
			}
			this.oSubmitDialog.open();
		},

		/*submitting pending lc's*/
		submitPendingLC: function (oEvent) {
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
					that.loadSubmittedLC();
					that.loadPendingLC();
					that.loadTile();
					sap.m.MessageToast.show(odata.message);

					sap.ui.getCore().oSubmitDialog.close();

					sap.ui.core.BusyIndicator.hide();

				},
				error: function (oError) {

					sap.m.MessageToast.show(oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});
		},

		onPressLeaveClose: function () {
			sap.ui.getCore().oSubmitDialog.close();

		},

		closeCancelDialog: function () {
			sap.ui.getCore().oSubmitDialog.close();
		},

		newLCCreateRequest: function () {

			this.getRouter().navTo("buyerlcCreate");

		},

		/*navigation from pending lc to details view with submit and cancel button*/
		viewPendingDetails: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();

			this.getRouter().navTo("buyerpendingviewDetails", {
				tokenPath: oTokenPathID,
				sLCId: oBindingContext.getProperty("LCId")
			});

		},
		/*navigation from  submittedlc landing page to submit lc page with back button*/
		viewSubmittedDetails: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();

			this.getRouter().navTo("submitlcviewDetails", {
				tokenPath: oTokenPathID,
				sLCId: oBindingContext.getProperty("LCId")
			});
		},
		/* bl preview pdf viewer*/
		bLpreviewpress: function (oEvent) {

			this._pdfViewer.setTitle("Bill of Landing");
			this._pdfViewer.open();

		},
		/* filter on pending list*/
		searchBuyer: function (oEvent) {
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

		},

		searchBuyerSubmit: function (oEvent) {
			var value = oEvent.getParameters().newValue;
			if (value === undefined) {
				value = oEvent.getParameters().query;
			}
			var oTable = this.getView().byId("submittedTable");
			var filters = new Filter([
				new Filter("LCTokenNumber", FilterOperator.Contains, value),
				new Filter("SEL_NAME", FilterOperator.Contains, value),
				new Filter("PROD_TYPE", FilterOperator.Contains, value),

				// new Filter("l_cValue", FilterOperator.EQ, value)

			]);

			oTable.getBinding("items").filter(filters);

		}
	});
});