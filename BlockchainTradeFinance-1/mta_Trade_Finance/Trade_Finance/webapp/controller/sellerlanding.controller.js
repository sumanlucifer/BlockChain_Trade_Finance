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
	return BaseController.extend("Trade_Finance.Trade_Finance.controller.sellerlanding", {
		formatter: formatter,
		onInit: function () {
			that = this;

			that.buyerlccreateModel = new JSONModel();
			that.getView().setModel(that.buyerlccreateModel, "buyerlccreateModel");

			this.getRouter().getRoute("sellerlanding").attachMatched(this.onsellerMatched, this);

		},
		onsellerMatched: function () {
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
			// that.loadSellerReviwedLC();
			// that.loadSellerTile();

		},
		/*loadNew lc details*/
		loadData: function () {
			sap.ui.core.BusyIndicator.show();
			$.ajax({
				type: "GET",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/landingPage?newlc=APP_SELLER_BANK&status=GOODS_DIS_PEN,REJ_SELLER,PAYMENT_PROGRESS,COMPLETED",
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
						data.Review[i].gooddispatch = false;
						data.Review[i].paymentProcess = false;
						if (data.Review[i].LCStatus === "GOODS_DIS_PEN") {
							data.Review[i].gooddispatch = true;
						} else if (data.Review[i].LCStatus === "PAYMENT_PROGRESS" || data.Review[i].LCStatus === "COMPLETED") {
							data.Review[i].paymentProcess = true;
						}
					}

					that.getView().getModel("buyerlccreateModel").setProperty("/SubmittedByBuyer", data.statistics.APP_SELLER_BANK);
					that.getView().getModel("buyerlccreateModel").setProperty("/submitList", (
						data.statistics.GOODS_DIS_PEN + data.statistics.PAYMENT_PROGRESS + data.statistics.REJ_SELLER));

					that.getView().getModel("buyerlccreateModel").setProperty("/completeList", data.statistics.COMPLETED);
					that.getView().getModel("buyerlccreateModel").setProperty("/accountBalanceList", data.statistics.accountBalance);

					that.getView().getModel("buyerlccreateModel").setProperty("/sBanksubmittedlcs", data.newLC);
					that.getView().getModel("buyerlccreateModel").setProperty("/sBankRsubmittinglcs", data.Review);
					that.getView().getModel("buyerlccreateModel").refresh(true);

					sap.ui.core.BusyIndicator.hide();

				},

				error: function (oError) {
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},
		// loadSellerNewLC: function () {

		// 	sap.ui.core.BusyIndicator.show();
		// 	$.ajax({
		// 		type: "GET",
		// 		// url: "/blockchainLC/api/getAllLCbystatus/APP_SELLER_BANK",
		// 		url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbystatus/APP_SELLER_BANK",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"Accept": "application/json",
		// 			"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
		// 			address: that.getOwnerComponent().oMyStorage.get("data").address

		// 		},
		// 		contentType: "application/json;charset=utf-8",
		// 		success: function (data) {
		// 			that.getView().getModel("buyerlccreateModel").setProperty("/sBanksubmittedlcs", data);
		// 			that.getView().getModel("buyerlccreateModel").refresh(true);
		// 			sap.ui.core.BusyIndicator.hide();

		// 		},

		// 		error: function (oerror) {
		// 			sap.ui.core.BusyIndicator.hide();
		// 		}

		// 	});

		// },
		// /*loadReviwedLC lc deatils*/
		// loadSellerReviwedLC: function () {

		// 	sap.ui.core.BusyIndicator.show();
		// 	$.ajax({
		// 		type: "GET",
		// 		// url: "/blockchainLC/api/getAllLCbyAllStatus?status=REJ_BUYER_BANK,REJ_SELLER_BANK,GOODS_DIS_PEN,PAYMENT_PROGRESS,COMPLETED",
		// 		url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getAllLCbyAllStatus?status=REJ_BUYER_BANK,REJ_SELLER_BANK,GOODS_DIS_PEN,PAYMENT_PROGRESS,COMPLETED",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"Accept": "application/json",
		// 			"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
		// 			address: that.getOwnerComponent().oMyStorage.get("data").address

		// 		},
		// 		contentType: "application/json;charset=utf-8",
		// 		success: function (data) {
		// 			for (var i = 0; i < data.data.length; i++) {
		// 				data.data[i].gooddispatch = false;
		// 				data.data[i].paymentProcess = false;
		// 				if (data.data[i].LCStatus === "GOODS_DIS_PEN") {
		// 					data.data[i].gooddispatch = true;
		// 				} else if (data.data[i].LCStatus === "PAYMENT_PROGRESS") {
		// 					data.data[i].paymentProcess = true;
		// 				}
		// 			}

		// 			that.getView().getModel("buyerlccreateModel").setProperty("/sBankRsubmittinglcs", data);
		// 			that.getView().getModel("buyerlccreateModel").refresh(true);
		// 			sap.ui.core.BusyIndicator.hide();

		// 		},

		// 		error: function (oerror) {
		// 			sap.ui.core.BusyIndicator.hide();
		// 		}

		// 	});

		// },
		/*loadSellerTile: function () {

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

		},*/

		/* open Approvefragment*/
		onPressApproveS: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oBindingContextPath = oBindingContext.getPath();
			var oContextData = oBindingContext.getObject();

			// this.lcID = oContextData.LCId;
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

				"lcStatus": "GOODS_DIS_PEN"

			};

			sap.ui.core.BusyIndicator.show();

			jQuery.ajax({

				type: "POST",
				// url: "/blockchainLC/api/tokenTransfer ",
				url: "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/tokenTransfer ",
				data: JSON.stringify(oPayload),
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},

				success: function (odata) {

					that.loadData();
					// that.loadSellerTile();
					// that.loadSellerReviwedLC();

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

		onpressRejectClose: function () {
			sap.ui.getCore().oRejectionDialog.close();
		},
		onpressapproveClose: function () {
			sap.ui.getCore().oApproveDialog.close();
		},
		/* open Rjectfragment*/
		onrejectionS: function (oEvent) {

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
				"lcStatus": "REJ_SELLER"

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

		/* new lc view deatils*/
		approveSBViewDetails: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();

			var ownerAddress = oBindingContext.getModel().getProperty(oBindingContext.getPath()).OwnerAddress;

			this.getRouter().navTo("newlcsellerviewDetails", {
				tokenPath: oTokenPathID,
				sLCId: oBindingContext.getProperty("LCId"),
				ownerAdd: ownerAddress

			});

		},
		/*reviwed lc view details*/

		reviwedSBDetails: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel"),
				oBindingContextPath = oBindingContext.getPath(),
				oTokenPathID = oBindingContextPath.split("/").slice(-1).pop();

			this.getRouter().navTo("reviwedlcsellerviewDetails", {
				tokenPath: oTokenPathID,
				sLCId: oBindingContext.getProperty("LCId")
			});

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
		/* open approve fragment*/
		/* bl upload function*/
		pressBLLoad: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oBindingContextPath = oBindingContext.getPath();
			var oContextData = oBindingContext.getObject();

			// this.lcID = oContextData.LCId;
			this.lcToken = oContextData.LCTokenNumber;

			this.getModel("buyerlccreateModel").setProperty("/tokenNum", this.lcToken);

			var blUploadfrag = "Trade_Finance.Trade_Finance.fragment.uploadBill";
			if (!sap.ui.getCore().oblUploadDialog) {
				sap.ui.getCore().oblUploadDialog = sap.ui.xmlfragment(
					blUploadfrag,
					this);
			}

			this.getView().addDependent(sap.ui.getCore().oblUploadDialog);
			sap.ui.getCore().oblUploadDialog.bindElement({
				path: oBindingContextPath,
				model: "buyerlccreateModel"
			});
			var fileLoader = sap.ui.getCore().byId("idUpLoadFile");
			fileLoader.setValue("");
			sap.ui.getCore().oblUploadDialog.open();

		},
		handleUploadComplete: function (oEvent) {
			this.onCbusyClose();
			// sap.ui.core.BusyIndicator.hide();
			this.loadData();
		},
		/* calling Post api for BL upload*/
		UploadBL: function (oEvent) {
			this.onCbusyOpen();
			var oBindingContext = oEvent.getSource().getBindingContext("buyerlccreateModel");
			var oContextData = oBindingContext.getObject();
			this.lcID = oContextData.LCId;
			var address = that.getOwnerComponent().oMyStorage.get("data").address;

			var fileLoader = sap.ui.getCore().byId("idUpLoadFile");
			var url = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/uploadBill";
			fileLoader.setUploadUrl(url);
			var token = that.getOwnerComponent().oMyStorage.get("data").token;
			fileLoader.removeAllHeaderParameters();
			if (fileLoader.getHeaderParameters().length === 0) {
				var headerParma = new sap.ui.unified.FileUploaderParameter();
				headerParma.setName('auth-token');
				headerParma.setValue(token);
				fileLoader.addHeaderParameter(headerParma);

				var headerParma = new sap.ui.unified.FileUploaderParameter();
				headerParma.setName('address');
				headerParma.setValue(address);
				fileLoader.addHeaderParameter(headerParma);

				headerParma = new sap.ui.unified.FileUploaderParameter();
				var lcid = this.lcID;
				headerParma.setName('LCID');
				headerParma.setValue(lcid);
				fileLoader.addHeaderParameter(headerParma);
			}
			fileLoader.setSendXHR(true);
			fileLoader.upload();
			sap.ui.getCore().oblUploadDialog.close();

			/*
						var token = that.getOwnerComponent().oMyStorage.get("data").token;
						var oView = this.getView();
						var oFileUploader = sap.ui.getCore().byId("idUpLoadFile");
						var sFileName = oFileUploader.getValue();
						if (sFileName === "") {
							sap.m.MessageToast.show("Please select a File to Upload");
							return;
						}

						var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
						var base64_marker = "data:" + file.type + ";base64,";
						var reader = new FileReader();
						//on load
						reader.onload = function (evt) {
							// return function (evt) {
							var base64Index = evt.target.result.indexOf(base64_marker) + base64_marker.lenght;
							var base64 = {
								"bill": evt.target.result.substring(base64Index),
								"LCID": 90
							};
							var sService2 = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/uploadBill";
							var service_url = sService2;

							jQuery.ajax({
								url: service_url,
								asyn: false,
								datatype: "json",
								contentType: "multipart/form-data",
								cache: false,
								data: base64,
								type: "post",
								beforeSend: function (xhr) {
									xhr.setRequestHeader("content-Type", file.type);
									xhr.setRequestHeader("slug", sFileName);
									xhr.setRequestHeader("auth-token", token);
								},
								success: function (odata) {
									sap.m.MessageToast.show("file successfully uploaded");
									oFileUploader.setValue("");
								},
								error: function (odata) {
									sap.m.MessageToast.show("file Upload error");
								}
							});

						};
						//Read file
						reader.readAsDataURL(file);*/
		},

		uploadBLClose: function () {
			sap.ui.getCore().oblUploadDialog.close();
		},

		blPreviewClose: function () {
			sap.ui.getCore().oblPreviewDialog.close();
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
				new sap.ui.model.Filter("LCStatus", sap.ui.model.FilterOperator.EQ, "APP_SELLER_BANK")
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
				new sap.ui.model.Filter("LCStatus", sap.ui.model.FilterOperator.NE, "APP_SELLER_BANK")
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

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Trade_Finance.Trade_Finance.view.sellerlanding
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Trade_Finance.Trade_Finance.view.sellerlanding
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Trade_Finance.Trade_Finance.view.sellerlanding
		 */
		onExit: function () {
			sap.ui.getCore().oApproveDialog.destroy();
			sap.ui.getCore().oRejectionDialog.destroy();
		}

	});

});