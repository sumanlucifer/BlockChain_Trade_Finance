sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, DateFormat, Fragment) {
	"use strict";
	var that;
	return BaseController.extend("Trade_Finance.Trade_Finance.controller.buyerpendingviewDetails", {

		onInit: function () {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			that = this;

			this.setModel(oViewModel, "buyerPendingView");
			that.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			that.oRouter.getRoute("buyerpendingviewDetails").attachMatched(this.onBuyerPendingMatched, this);
		},

		onBuyerPendingMatched: function (oEvent) {
			var clear = "";
			clear = (sap.ui.getCore().oApproveDialog) ? sap.ui.getCore().oApproveDialog = "" : "";
			clear = (sap.ui.getCore().osdRejectionDialog) ? sap.ui.getCore().oRejectionDialog = "" : "";
			clear = (sap.ui.getCore().oblUploadDialog) ? sap.ui.getCore().oblUploadDialog = "" : "";
			clear = (sap.ui.getCore().oblPreviewDialog) ? sap.ui.getCore().oblPreviewDialog = "" : "";
			clear = (this._oBusyDialog) ? this._oBusyDialog = "" : "";
			clear = (this._oPopover) ? this._oPopover = "" : "";
			clear = (sap.ui.getCore().oSubmitDialog) ? sap.ui.getCore().oSubmitDialog = "" : "";
			clear = (sap.ui.getCore().oDeleteDialog) ? sap.ui.getCore().oDeleteDialog = "" : "";

			sap.ui.core.BusyIndicator.show();
			var oArgs = oEvent.getParameter("arguments"),

				// sBuyerPendingUri = "/blockchainLC/api/getlcdatabyID/" + oArgs.sLCId;
				sBuyerPendingUri = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/getlcdatabyID/" + oArgs.sLCId;
			this.sLCid = oArgs.sLCId;

			this.getModel("BuyerPendingModel").loadData(sBuyerPendingUri,
				null, true, "GET", null,
				false, {
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address
				}).then(function () {

				that.getView().getModel("buyerPendingView").setProperty("/token", that.getModel("BuyerPendingModel").getProperty(
					"/data/LCTokenNumber"));

				var oJsonModel = new sap.ui.model.json.JSONModel();
				var hisArray = [{
					"sectionid": "",
					"image": "./image/h1High.jpg",
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
					"BuyerPendingModel").getProperty("/data/LCTokenNumber");
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
		/* buyerPending view details submit functionality*/
		buyerViewSubmit: function () {

			var oPayload = {

				"LCId": this.sLCid,

				"LCStatus": "Submit"

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
					sap.m.MessageToast.show(odata.message);
					that.getRouter().navTo("Dashboard");
					sap.ui.core.BusyIndicator.show();

				},
				error: function (oError) {
					// if (oError.status === )
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
					// sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).status.message : oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});

		},

		buyerLCButtonCreateNav: function () {

			that.oRouter.navTo("Dashboard");

		},

		pendingviewdeatilcancel: function () {

			that.oRouter.navTo("Dashboard");

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
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Trade_Finance.Trade_Finance.view.buyerpendingviewDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Trade_Finance.Trade_Finance.view.buyerpendingviewDetails
		 */
		//	onExit: function() {
		//
		//	}
	});
});