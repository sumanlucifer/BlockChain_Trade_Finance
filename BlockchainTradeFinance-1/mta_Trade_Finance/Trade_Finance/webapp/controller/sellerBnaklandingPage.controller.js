sap.ui.define([
	"./BaseController",
	"sap/m/PDFViewer",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"Trade_Finance/Trade_Finance/formatter/formatter",
	"sap/ui/core/Fragment"
], function (BaseController, PDFViewer, JSONModel, Filter, FilterOperator, formatter, Fragment) {
	"use strict";
	var that;
	return BaseController.extend("Trade_Finance.Trade_Finance.controller.sellerBnaklandingPage", {
		formatter: formatter,
		onInit: function () {
			that = this;

			that.buyerlccreateModel = new JSONModel();
			that.getView().setModel(that.buyerlccreateModel, "buyerlccreateModel");

			this.getRouter().getRoute("sellerBnaklandingPage").attachMatched(this.onsellerBankMatched, this);
		},
		onsellerBankMatched: function () {
			var clear = "";
			clear = (sap.ui.getCore().oApproveDialog) ? sap.ui.getCore().oApproveDialog = "" : "";
			clear = (sap.ui.getCore().osdRejectionDialog) ? sap.ui.getCore().oRejectionDialog = "" : "";
			clear = (sap.ui.getCore().oblUploadDialog) ? sap.ui.getCore().oblUploadDialog = "" : "";
			clear = (sap.ui.getCore().oblPreviewDialog) ? sap.ui.getCore().oblPreviewDialog = "" : "";
			clear = (this._oBusyDialog) ? this._oBusyDialog = "" : "";
			clear = (this._oPopover) ? this._oPopover = "" : "";
			clear = (sap.ui.getCore().oSubmitDialog) ? sap.ui.getCore().oSubmitDialog = "" : "";
			clear = (sap.ui.getCore().oDeleteDialog) ? sap.ui.getCore().oDeleteDialog = "" : "";
			// that.loadSBankNewLC();
			that.loadData();
			// that.loadSBankTile();

		},
		loadData: function () {
			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/landingPage?newlc=APP_BUYER_BANK&status=APP_SELLER_BANK,REJ_SELLER_BANK,GOODS_DIS_PEN,REJ_SELLER,PAYMENT_PROGRESS,COMPLETED",
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

					that.getView().getModel("buyerlccreateModel").setProperty("/SubmittedByBuyer", data.statistics.APP_BUYER_BANK);
					that.getView().getModel("buyerlccreateModel").setProperty("/submitList", (
						data.statistics.APP_SELLER_BANK + data.statistics.GOODS_DIS_PEN + data.statistics.PAYMENT_PROGRESS + data.statistics.REJ_SELLER_BANK +
						data.statistics.REJ_SELLER
					));

					that.getView().getModel("buyerlccreateModel").setProperty("/completeList", data.statistics.COMPLETED);
					that.getView().getModel("buyerlccreateModel").setProperty("/accountBalanceList", data.statistics.accountBalance);

					that.getView().getModel("buyerlccreateModel").setProperty("/sellerBankcs", data.newLC);
					that.getView().getModel("buyerlccreateModel").setProperty("/sBankReviwedlcs", data.Review);
					that.getView().getModel("buyerlccreateModel").refresh(true);
					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oError) {
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

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

		// loadSBankReviwedLC: function () {

		// 	sap.ui.core.BusyIndicator.show();
		// 	$.ajax({
		// 		type: "GET",

		// 		url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbyAllStatus?status=REJ_BUYER_BANK,APP_SELLER_BANK,REJ_SELLER_BANK,GOODS_DIS_PEN,PAYMENT_PROGRESS,COMPLETED",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"Accept": "application/json",
		// 			"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
		// 			address: that.getOwnerComponent().oMyStorage.get("data").address

		// 		},
		// 		contentType: "application/json;charset=utf-8",
		// 		success: function (data) {
		// 			that.getView().getModel("buyerlccreateModel").setProperty("/sBankReviwedlcs", data);
		// 			that.getView().getModel("buyerlccreateModel").refresh(true);
		// 			sap.ui.core.BusyIndicator.hide();

		// 		},

		// 		error: function (oerror) {
		// 			sap.ui.core.BusyIndicator.hide();
		// 		}

		// 	});

		// },

		/*	loadSBankTile: function () {

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

			},*/
		/* open Approvefragment*/
		onPressApproveSB: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oBindingContextPath = oBindingContext.getPath();
			var oContextData = oBindingContext.getObject();
			this.lcToken = oContextData.LCTokenNumber;
			this.getModel("buyerlccreateModel").setProperty("/tokenNum", this.lcToken);
			var approvefrag = "Trade_Finance.Trade_Finance.fragment.approve";
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
			this.owneraddress = oContextData.OwnerAddress;
			var oPayload = {
				"fromAddress": this.owneraddress,
				"toAddress": this.getOwnerComponent().oMyStorage.get("data").address,
				"LcTokenId": this.lcID,
				"lcStatus": "APP_SELLER_BANK"
			};

			sap.ui.core.BusyIndicator.show();
			jQuery.ajax({

				type: "POST",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/tokenTransfer ",
				data: JSON.stringify(oPayload),
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},

				success: function (odata) {

					// that.loadSBankNewLC();
					// that.loadSBankTile();
					that.loadData();
					sap.m.MessageToast.show(odata.message);
					sap.ui.getCore().oApproveDialog.close();
					sap.ui.core.BusyIndicator.hide();

				},
				error: function (oError) {
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});
		},

		onpressapproveClose: function () {
			sap.ui.getCore().oApproveDialog.close();
		},

		/* open Rjectfragment*/
		onrejectionSB: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oBindingContextPath = oBindingContext.getPath();
			var oContextData = oBindingContext.getObject();
			this.lcToken = oContextData.LCTokenNumber;
			this.getModel("buyerlccreateModel").setProperty("/tokenNum", this.lcToken);
			var rejtionfrag = "Trade_Finance.Trade_Finance.fragment.Reject";
			if (!sap.ui.getCore().oRejectionDialog) {
				sap.ui.getCore().oRejectionDialog = sap.ui.xmlfragment(
					rejtionfrag,
					this);
			}

			this.getView().addDependent(sap.ui.getCore().oRejectionDialog);
			sap.ui.getCore().oRejectionDialog.bindElement({
				path: oBindingContextPath,
				model: "buyerlccreateModel"
			});
			sap.ui.getCore().oRejectionDialog.open();

		},

		/*Rejection of new lc's*/
		RejectNewLC: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oContextData = oBindingContext.getObject();
			this.lcID = oContextData.LCId;
			this.owneraddress = oContextData.OwnerAddress;
			var oPayload = {

				"LCId": this.lcID,
				"lcStatus": "REJ_SELLER_BANK"
			};

			this.onCbusyOpen();

			jQuery.ajax({
				type: "POST",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/lcreject ",
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
					// that.loadReviwedLC();
					sap.m.MessageToast.show(odata.message);
					sap.ui.getCore().oRejectionDialog.close();
					that.onCbusyClose();

				},
				error: function (oError) {
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
					that.onCbusyClose();
				}

			});
		},

		onpressRejectClose: function () {
			sap.ui.getCore().oRejectionDialog.close();
		},

		/*navigation from new lc to details view with approve and cancel button*/
		newSubmiitedSBDetails: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();
			var ownerAddress = oBindingContext.getModel().getProperty(oBindingContext.getPath()).OwnerAddress;
			this.getRouter().navTo("newlcsellerbankviewDetails", {
				tokenPath: oTokenPathID,
				sLCId: oBindingContext.getProperty("LCId"),
				ownerAdd: ownerAddress
			});

		},

		/*navigation from  reviwed lc landing page to submit lc page with back button*/
		newReviwedSBDetails: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();

			this.getRouter().navTo("sbankreviewedviewDeatils", {
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

		},

		/*filter on new list */

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
				new sap.ui.model.Filter("LCStatus", sap.ui.model.FilterOperator.EQ, "APP_BUYER_BANK")
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
				new sap.ui.model.Filter("LCStatus", sap.ui.model.FilterOperator.NE, "APP_BUYER_BANK")
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

		onBeforeRendering: function () {

		},

		onAfterRendering: function () {

		},

		onExit: function () {
			sap.ui.getCore().oApproveDialog.destroy();
			sap.ui.getCore().oRejectionDialog.destroy();
		}

	});

});