sap.ui.define([
	"./BaseController",
	"sap/m/PDFViewer",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"Trade_Finance/Trade_Finance/formatter/formatter",
	"sap/ui/model/FilterType",
	"sap/ui/core/Fragment"
], function (BaseController, PDFViewer, JSONModel, Filter, FilterOperator, formatter, FilterType, Fragment) {
	"use strict";

	var that;
	return BaseController.extend("Trade_Finance.Trade_Finance.controller.View1", {
		formatter: formatter,
		onInit: function () {
			that = this;
			that.buyerlccreateModel = new JSONModel();
			that.getView().setModel(that.buyerlccreateModel, "buyerlccreateModel");
			this.getRouter().getRoute("Dashboard").attachMatched(this.onDashboardMatched, this);
		},

		onDashboardMatched: function () {
			var clear = "";
			clear = (sap.ui.getCore().oApproveDialog) ? sap.ui.getCore().oApproveDialog = "" : "";
			clear = (sap.ui.getCore().osdRejectionDialog) ? sap.ui.getCore().oRejectionDialog = "" : "";
			clear = (sap.ui.getCore().oblUploadDialog) ? sap.ui.getCore().oblUploadDialog = "" : "";
			clear = (sap.ui.getCore().oblPreviewDialog) ? sap.ui.getCore().oblPreviewDialog = "" : "";
			clear = (this._oBusyDialog) ? this._oBusyDialog = "" : "";
			clear = (this._oPopover) ? this._oPopover = "" : "";
			clear = (sap.ui.getCore().oSubmitDialog) ? sap.ui.getCore().oSubmitDialog = "" : "";
			clear = (sap.ui.getCore().oDeleteDialog) ? sap.ui.getCore().oDeleteDialog = "" : "";

			that.loadData();
			// that.loadTile();
		},

		/* loadTile detais */
		/*loadTile: function () {

			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				// url: "/blockchainLC/api/getAllCounts",
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

		},*/

		/*loadpending lc details*/
		loadData: function () {
			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/landingPage?newlc=PENDING&status=SUB_BUYER,APP_BUYER_BANK,REJ_BUYER_BANK,APP_SELLER_BANK,REJ_SELLER_BANK,GOODS_DIS_PEN,REJ_SELLER,PAYMENT_PROGRESS,COMPLETED",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				contentType: "application/json;charset=utf-8",
				success: function (odata) {
					var data = odata.data;
					for (var i = 0; i < data.Review.length; i++) {
						data.Review[i].paymentProcess = false;
						if (data.Review[i].LCStatus === "PAYMENT_PROGRESS" || data.Review[i].LCStatus === "COMPLETED") {
							data.Review[i].paymentProcess = true;
						}
					}

					that.getView().getModel("buyerlccreateModel").setProperty("/pendingList", data.statistics.PENDING);
					that.getView().getModel("buyerlccreateModel").setProperty("/submitList", data.statistics.SUB_BUYER + data.statistics.APP_BUYER_BANK +
						data.statistics.REJ_BUYER_BANK + data.statistics.APP_SELLER_BANK + data.statistics.REJ_SELLER_BANK + data.statistics.GOODS_DIS_PEN +
						data.statistics.PAYMENT_PROGRESS + data.statistics.REJ_SELLER);
					that.getView().getModel("buyerlccreateModel").setProperty("/completeList", data.statistics.COMPLETED);
					that.getView().getModel("buyerlccreateModel").setProperty("/accountBalanceList", data.statistics.accountBalance);

					that.getView().getModel("buyerlccreateModel").setProperty("/pendinglcs", data.newLC);
					that.getView().getModel("buyerlccreateModel").setProperty("/submittinglcs", data.Review);

					that.getView().getModel("buyerlccreateModel").refresh(true);

					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oError) {
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
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

			var submitfrag = "Trade_Finance.Trade_Finance.fragment.submitDialouge";
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
			// 	this.oSubmitDialog = new sap.ui.xmlfragment("creatsubmitFrag", "Trade_Finance.Trade_Finance.fragment.submitDialouge",
			// 		this);
			// 	this.getView().addDependent(this.oSubmitDialog);
			// }
			// this.oSubmitDialog.open();

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

			this.onCbusyOpen();

			jQuery.ajax({

				type: "PUT",
				// url: "/blockchainLC/api/updateLCStatus",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/updateLCStatus",
				data: JSON.stringify(oPayload),
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},

				success: function (odata) {
					that.loadData();
					// that.loadTile();
					sap.m.MessageToast.show(odata.message);

					sap.ui.getCore().oSubmitDialog.close();

					that.onCbusyClose();

				},
				error: function (oError) {
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);

					that.onCbusyClose();
				}

			});
		},

		/*delete lc */
		/* open reject fragment*/
		deleteLc: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oBindingContextPath = oBindingContext.getPath();
			var oContextData = oBindingContext.getObject();

			// this.lcID = oContextData.LCId;
			this.lcToken = oContextData.LCTokenNumber;

			this.getModel("buyerlccreateModel").setProperty("/tokenNum", this.lcToken);

			var deletefrag = "Trade_Finance.Trade_Finance.fragment.delete";
			if (!sap.ui.getCore().oDeleteDialog) {
				sap.ui.getCore().oDeleteDialog = sap.ui.xmlfragment(
					deletefrag,
					this);
			}

			this.getView().addDependent(sap.ui.getCore().oDeleteDialog);
			sap.ui.getCore().oDeleteDialog.bindElement({
				path: oBindingContextPath,
				model: "buyerlccreateModel"
			});
			sap.ui.getCore().oDeleteDialog.open();

			// if (!this.oSubmitDialog) {
			// 	this.oSubmitDialog = new sap.ui.xmlfragment("creatsubmitFrag", "Trade_Finance.Trade_Finance.fragment.submitDialouge",
			// 		this);
			// 	this.getView().addDependent(this.oSubmitDialog);
			// }
			// this.oSubmitDialog.open();

		},

		/*delete lc*/
		onPressdeleteLc: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");

			var oContextData = oBindingContext.getObject();

			this.lcID = oContextData.LCId;

			var oPayload = {

				"LCId": this.lcID,

				"LCStatus": "DELETE"

			};

			sap.ui.core.BusyIndicator.show();

			jQuery.ajax({

				type: "PUT",
				// url: "/blockchainLC/api/updateLCStatus",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/updateLCStatus",

				data: JSON.stringify(oPayload),
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},

				success: function (odata) {
					that.loadData();
					// that.loadTile();
					sap.m.MessageToast.show(odata.message);

					sap.ui.getCore().oDeleteDialog.close();

					sap.ui.core.BusyIndicator.hide();

				},
				error: function (oError) {
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});
		},

		closeDeleteLC: function () {
			sap.ui.getCore().oDeleteDialog.close();
		},

		/*end of delete lc*/

		onPressLeaveClose: function () {
			sap.ui.getCore().oSubmitDialog.close();

		},

		closeCancelDialog: function () {
			sap.ui.getCore().oSubmitDialog.close();
		},

		newLCCreateRequest: function (oevent) {

			// sap.ui.getCore().getElementById('idProductType').setValue("");

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
		blPreviewClose: function () {
			sap.ui.getCore().oblPreviewDialog.close();
		},
		/* bl preview review*/
		pressBLPreview: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oBindingContextPath = oBindingContext.getPath();
			var oContextData = oBindingContext.getObject();
			this.lcToken = oContextData.LCTokenNumber;

			this.getModel("buyerlccreateModel").setProperty("/tokenNum", this.lcToken);

			var blpreviwfrag = "Trade_Finance.Trade_Finance.fragment.blPreview";
			if (!sap.ui.getCore().oblPreviewDialog) {
				sap.ui.getCore().oblPreviewDialog = sap.ui.xmlfragment(
					blpreviwfrag,
					this);
			}

			this.getView().addDependent(sap.ui.getCore().oblPreviewDialog);
			sap.ui.getCore().oblPreviewDialog.bindElement({
				path: oBindingContextPath,
				model: "buyerlccreateModel"
			});
			// sap.ui.getCore().oblPreviewDialog.open();
			this.lcID = oContextData.LCId;
			var url = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getfilefromIPFS/" + this.lcID;

			$.ajax({
				type: "GET",

				url: url,
				headers: {
					// "Content-Type": "application/json",
					// "Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},
				// contentType: "application/json;charset=utf-8",
				success: function (data) {

					var decodedPdfContent = window.atob(data.data);
					// var decodedPdfContent = data;
					var byteArray = new Uint8Array(decodedPdfContent.length)
					for (var i = 0; i < decodedPdfContent.length; i++) {
						byteArray[i] = decodedPdfContent.charCodeAt(i);
					}
					var blob = new Blob([byteArray.buffer], {
						type: 'application/pdf'
					});
					var _pdfurl = URL.createObjectURL(blob);

					if (!this._PDFViewer) {
						this._PDFViewer = new sap.m.PDFViewer({
							width: "auto",
							source: _pdfurl // my blob url
						});
						jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
					}
					this._PDFViewer.downloadPDF = function () {

						sap.ui.core.util.File.save(
							byteArray.buffer,
							"Hello_UI5",
							"pdf",
							"application/pdf"
						);
					};
					// this._PDFViewer.open();
					// sap.ui.getCore().oblPreviewDialog.getContent()[0].addContent(this._PDFViewer);

					var oJsonModel = new sap.ui.model.json.JSONModel();
					oJsonModel.setData({
						"source": this._PDFViewer.getSource()
					});
					sap.ui.getCore().byId("pdfid").setModel(oJsonModel, "pdfDocModel");

					sap.ui.getCore().oblPreviewDialog.open();
					sap.ui.core.BusyIndicator.hide();

				},
				error: function (oError) {
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});

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
				new Filter("PROD_TYPE", FilterOperator.Contains, value)
			], false);
			var oFilterName = new sap.ui.model.Filter([
				new sap.ui.model.Filter("LCStatus", sap.ui.model.FilterOperator.EQ, "PENDING")
			]);
			var andFilter = new sap.ui.model.Filter([filters, oFilterName], true);
			var aFilters = [];
			aFilters.push(andFilter);
			oTable.getBinding("items").filter(aFilters);

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
				new Filter("PROD_TYPE", FilterOperator.Contains, value)
			], false);
			var oFilterName = new sap.ui.model.Filter([
				new sap.ui.model.Filter("LCStatus", sap.ui.model.FilterOperator.NE, "PENDING")
			]);
			var andFilter = new sap.ui.model.Filter([filters, oFilterName], true);
			var aFilters = [];
			aFilters.push(andFilter);
			oTable.getBinding("items").filter(aFilters);

		},

		openLogoutFragment: function (oEvent) {
			var oButton = oEvent.getSource();

			// create popover
			if (!this._oPopover) {
				Fragment.load({
					name: "Trade_Finance.Trade_Finance.fragment.logout",
					controller: this
				}).then(function (pPopover) {
					this._oPopover = pPopover;
					this.getView().addDependent(this._oPopover);
					var gData = this.getOwnerComponent().oMyStorage.get("data");
					var oJsonModel = new sap.ui.model.json.JSONModel();
					oJsonModel.setData({
						"employeeProfileInfo": gData
					});
					this._oPopover.setModel(oJsonModel, "personalInfoModel");
					this._oPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(oButton);
			}
		},
		onlogoutPress: function () {
			this.getOwnerComponent().logout();
			// sap.ui.getCore().oLogoutDialog.close();
			this._oPopover.close();
		},
		onExit: function () {
			sap.ui.getCore().oApproveDialog.destroy();
			sap.ui.getCore().oRejectionDialog.destroy();
		}
	});
});