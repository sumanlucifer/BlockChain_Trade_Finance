sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, DateFormat, Fragment) {
	"use strict";
	var that;
	return BaseController.extend("Trade_Finance.Trade_Finance.controller.sbankreviewedviewDeatils", {

		onInit: function () {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			that = this;
			this.setModel(oViewModel, "SellerBankReviwedView");
			this.getRouter().getRoute("sbankreviewedviewDeatils").attachMatched(this.onSellerbankSubmittedMatched, this);
		},

		onSellerbankSubmittedMatched: function (oEvent) {

			var clear = "";
			clear = (sap.ui.getCore().oApproveDialog) ? sap.ui.getCore().oApproveDialog = "" : "";
			clear = (sap.ui.getCore().osdRejectionDialog) ? sap.ui.getCore().oRejectionDialog = "" : "";
			clear = (sap.ui.getCore().oblUploadDialog) ? sap.ui.getCore().oblUploadDialog = "" : "";
			clear = (sap.ui.getCore().oblPreviewDialog) ? sap.ui.getCore().oblPreviewDialog = "" : "";
			clear = (this._oBusyDialog) ? this._oBusyDialog = "" : "";
			clear = (this._oPopover) ? this._oPopover = "" : "";
			clear = (sap.ui.getCore().oSubmitDialog) ? sap.ui.getCore().oSubmitDialog = "" : "";
			clear = (sap.ui.getCore().oDeleteDialog) ? sap.ui.getCore().oDeleteDialog = "" : "";

			var oArgs = oEvent.getParameter("arguments"),

				// sBuyerSmittigUri = "/blockchainLC/api/getlcdatabyID/" + oArgs.sLCId;
				sBuyerSmittigUri = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getlcdatabyID/" + oArgs.sLCId;
			this.sLCid = oArgs.sLCId;

			this.getModel("SellerBankSubmittedModel").loadData(sBuyerSmittigUri,
				null, true, "GET", null,
				false, {
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address
				}).then(function () {
				// var sOrdersData = oView.getModel("OrdersModel").getProperty("/data");
				that.getView().getModel("SellerBankReviwedView").setProperty("/token", that.getModel("SellerBankSubmittedModel").getProperty(
					"/data/LCTokenNumber"));

				var oJsonModel = new sap.ui.model.json.JSONModel();
				var hisArray = [{
					"sectionid": "",
					"image": "./image/h1.jpg",
					"sectionName": "L/C Creation",
					"user": "",
					"position": 0,
					"date": "",
					"doneBy": ""
				}, {
					"sectionid": "",
					"image": "./image/h2.jpg",
					"sectionName": "L/C Submission",
					"user": "",
					"position": 1,
					"date": "",
					"doneBy": ""
				}, {
					"sectionid": "",
					"image": "./image/h3.jpg",
					"sectionName": "Buyer Bank Review",
					"user": "",
					"position": 2,
					"date": "",
					"doneBy": ""
				}, {
					"sectionid": "",
					"image": "./image/h4.jpg",
					"sectionName": "Seller Bank Review",
					"user": "",
					"position": 3,
					"date": "",
					"doneBy": ""
				}, {
					"sectionid": "",
					"image": "./image/h5.jpg",
					"sectionName": "Seller Review",
					"user": "",
					"position": 4,
					"date": "",
					"doneBy": ""
				}, {
					"sectionid": "",
					"image": "./image/h6.jpg",
					"sectionName": "Goods Dispatch",
					"user": "",
					"position": 5,
					"date": "",
					"doneBy": ""
				}, {
					"sectionid": "",
					"image": "./image/h7.jpg",
					"sectionName": "Payment Settlement",
					"user": "",
					"position": 6,
					"date": "",
					"doneBy": ""
				}, {
					"sectionid": "",
					"image": "./image/h8.jpg",
					"sectionName": "L/C Complete",
					"user": "",
					"position": 7,
					"date": "",
					"doneBy": ""
				}];
				oJsonModel.setData({
					"items": hisArray
				});
				that.getView().setModel(oJsonModel, "processFlow");
				that.getView().byId("processflow1").setZoomLevel("Three");
				var url = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/lcHistory/getLcHistoryByLcToken/" + that.getModel(
					"SellerBankSubmittedModel").getProperty("/data/LCTokenNumber");
				jQuery.ajax({
					type: "GET",
					// url: "/blockchainLC/api/updateLCStatus",
					url: url,
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
						"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
						address: that.getOwnerComponent().oMyStorage.get("data").address
					},
					success: function (odata) {
						var hisArr = that.getView().getModel("processFlow").getData().items;
						var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "dd.MM.YYYY"
						});
						if (odata.lcDetails.length > 0) {
							for (var i = 0; i < odata.lcDetails.length; i++) {
								switch (odata.lcDetails[i].LCStatus) {
								case 'PENDING':
									hisArr[0].user = odata.lcDetails[i].ChangedByName;
									hisArr[0].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[0].image = "./image/h1High.jpg";
									break;
								case 'SUB_BUYER':
									hisArr[1].user = odata.lcDetails[i].ChangedByName;
									hisArr[1].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[1].image = "./image/h2High.jpg";
									break;
								case 'APP_BUYER_BANK':
									hisArr[2].user = odata.lcDetails[i].ChangedByName;
									hisArr[2].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[2].image = "./image/h3High.jpg";
									break;
								case 'REJ_BUYER_BANK':
									hisArr[2].user = odata.lcDetails[i].ChangedByName;
									hisArr[2].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[2].image = "./image/h3High.jpg";
									break;
								case 'APP_SELLER_BANK':
									hisArr[3].user = odata.lcDetails[i].ChangedByName;
									hisArr[3].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[3].image = "./image/h4High.jpg";
									break;
								case 'REJ_SELLER_BANK':
									hisArr[3].user = odata.lcDetails[i].ChangedByName;
									hisArr[3].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[3].image = "./image/h4High.jpg";
									break;
								case 'REJ_SELLER':
									hisArr[4].user = odata.lcDetails[i].ChangedByName;
									hisArr[4].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[4].image = "./image/h5High.jpg";
									break;
								case 'GOODS_DIS_PEN':
									hisArr[4].user = odata.lcDetails[i].ChangedByName;
									hisArr[4].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[4].image = "./image/h5High.jpg";
									break;
								case 'PAYMENT_PROGRESS':
									hisArr[5].user = odata.lcDetails[i].ChangedByName;
									hisArr[5].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[5].image = "./image/h6High.jpg";
									break;
								case 'COMPLETED':
									hisArr[6].user = odata.lcDetails[i].ChangedByName;
									hisArr[6].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[6].image = "./image/h7High.jpg";

									hisArr[7].user = odata.lcDetails[i].ChangedByName;
									hisArr[7].date = dateFormat.format(new Date(odata.lcDetails[i].ChangedOn));
									hisArr[7].image = "./image/h8High.jpg";
									break;
								default:
									break;
								}
							}
						}
						var finalModel = new sap.ui.model.json.JSONModel();
						finalModel.setData({
							"items": hisArr
						});
						that.getView().setModel(finalModel, "processFlow");
						that.getView().getModel("processFlow").refresh(true);
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (oError) {
						sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
						sap.ui.core.BusyIndicator.hide();
					}
				});

			}).catch(function (oError) {
				sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
			});

		},

		sbankreviewviewdeatils: function () {
			that.getRouter().navTo("sellerBnaklandingPage");

		},

		sbankback: function () {
			that.getRouter().navTo("sellerBnaklandingPage");

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
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Trade_Finance.Trade_Finance.view.sbankreviewedviewDeatils
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Trade_Finance.Trade_Finance.view.sbankreviewedviewDeatils
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Trade_Finance.Trade_Finance.view.sbankreviewedviewDeatils
		 */
		//	onExit: function() {
		//
		//	}

	});

});