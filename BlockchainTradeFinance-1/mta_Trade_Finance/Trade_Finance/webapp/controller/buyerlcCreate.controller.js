sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, DateFormat, Fragment) {
	"use strict";
	var that;
	return BaseController.extend("Trade_Finance.Trade_Finance.controller.buyerlcCreate", {

		onInit: function () {
			that = this;

			var createmodel = {
				"lccreat": {
					"productTYPE": "",
					"productQun": "",
					"productprice": "",
					"productvalue": "",
					"productEdate": "",
					"productintsetrate": ""
				}

			};

			var items = [

				{
					key: "1",
					text: "Computers"
				},

				{
					key: "2",
					text: "Mobile Phones"
				}, {
					key: "3",
					text: "Software"
				}, {
					key: "4",
					text: "Computer Hardware"
				}, {
					key: "5",
					text: "Servers"
				}

			];

			that.productModel = new JSONModel();
			that.getView().setModel(that.productModel, "productModel");
			that.productModel.setProperty("/productitems", items);
			that.buyerlccreateModel = new JSONModel();
			that.getView().setModel(that.buyerlccreateModel, "buyerlccreateModel");
			that.buyerlccreateModel.setProperty("/obuyercreate", createmodel);

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
			that.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			that.oRouter.getRoute("buyerlcCreate").attachPatternMatched(this.onHandleRouter, this);

		},
		fnNonNegative: function (evt) {
			var _oInput = evt.getSource();
			var val = _oInput.getValue();
			val = val.replace(/[^\d]/g, '');
			_oInput.setValue(val);
			if (parseInt(val) < 0) {
				evt.getSource().setValue("0");
				new sap.m.MessageToast.show('Value can not be Negative');
				this.getView().byId("totalid").setValue("");
				return;
			}

			var priceunit = this.getView().byId("idPricePerUnit").getValue();
			var quantityunit = this.getView().byId("idQuantity").getValue();
			if (priceunit !== "" && quantityunit !== "") {

				var totalvalue = parseInt(priceunit) * parseInt(quantityunit);
				// var totalvalue = fieldmultply;

				this.getView().byId("totalid").setValue(totalvalue);

			} else {
				this.getView().byId("totalid").setValue("");
			}
		},
		onHandleRouter: function () {

			var oView = this.getView();
			oView.byId("idProductType").setSelectedKey("");
			oView.byId("idPricePerUnit").setValue("");
			oView.byId("idQuantity").setValue("");
			oView.byId("totalid").setValue("");
			oView.byId("Maturitydate").setValue("");
			oView.byId("Maturitydate").setMinDate(new Date());
			// oView.byId("idIntersetRate").setValue("");

		},

		onpresscreatebutton: function () {

			/*for createlc model*/
			var ocreatemodel = this.getView().getModel("buyerlccreateModel"),
				createmodel1 = ocreatemodel.getProperty("/obuyercreate");

			/*for prodcuttype item model details*/

			var oproductmodel = this.getView().getModel("productModel"),
				oprductmodel = oproductmodel.getProperty("/productitems");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// var sUrl = "/blockchainLC/api/createLC";
			var sUrl = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/createLC";

			var oPayload = {
				"ProductMetadata": [{
					"PROD_TYPE": this.byId("idProductType").getSelectedItem().getText(),
					"PROD_QTY": this.byId("idQuantity").getValue(),
					"PROD_PRICE": this.byId("idPricePerUnit").getValue(),
					"TOTAL_VAL": this.byId("totalid").getValue(),
					"END_DATE": this.byId("Maturitydate").getValue().split("-").join(""),
					// "INTEREST_RATE": this.byId("idIntersetRate").getValue()
				}],
				"BuyerMetadata": [{
					"BUY_NAME": "Eion Morgan",
					"BUY_COMPANY": "Alpha Ltd US",
					"BUY_IBAN": "EY6552611718",
					"BUY_BANK": "Bank of UK",
					"BUY_SWIFT": "SW7372819199",
					"COM_ADDR": "ZXY Street, Test City",
					"CURRENCY": "USD",
					"PLACE_EXP": "Mumbai",
					"COUNTRY": "IN",
					"PARTNER": "0017300081",
					"COCODE": "1710",
					"VAL_CLASS": "0002"
				}],
				"SellerMetadata": [{
					"SEL_NAME": "Jeo Root",
					"SEL_COMPANY": "Mnon Ltd US",
					"SEL_IBAN": "EY6552611718",
					"SEL_BANK": "Bank of US",
					"SEL_SWIFT": "SW7372819199",
					"COM_ADDR": "AXY Street, ABC City"
				}]

			};
			//var temp= [];
			//temp.push(oPayload.ProductMetadata);

			sap.ui.core.BusyIndicator.show();
			jQuery.ajax({

				type: "POST",
				url: sUrl,
				data: JSON.stringify(oPayload),
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"auth-token": that.getOwnerComponent().oMyStorage.get("data").token,
					address: that.getOwnerComponent().oMyStorage.get("data").address

				},

				success: function (odata) {

					sap.m.MessageToast.show(odata.message);
					oRouter.navTo("Dashboard");
					sap.ui.core.BusyIndicator.hide();

				},
				error: function (oError) {
					sap.m.MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).message : oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});
		},

		onPresscancel: function () {
			that.oRouter.navTo("Dashboard");
		},
		buyerLCButtonCreateNav: function () {

			that.oRouter.navTo("Dashboard");
		},
		/* create service will call here */
		closeyessubmitpopup: function () {

		},
		/* no button will stay in ceate page */
		closenosubmitpopup: function () {

		},
		getformmatedDateString: function (date) {
			var d = date.getDate();
			if (d < 10) {
				d = '0' + d.toString();
			} else {
				d = d.toString();
			}
			var m = date.getMonth() + 1;
			if (m < 10) {
				m = '0' + m.toString();
			} else {
				m = m.toString();
			}

			var y = date.getFullYear();
			return (y.toString() + m + d);
		},

		onpresscreateClose: function () {
			this.oCreateDialog.close();
		},
		/*	onpriceChange: function () {
				// var ocreatemodel = this.getView().getModel("buyerlccreateModel");
				// var priceunit = ocreatemodel.getProperty("/obuyercreate/productprice");
				var priceunit = this.getView().byId("idPricePerUnit").getValue();
				var quantityunit = this.getView().byId("idQuantity").getValue();
				if (priceunit !== "" && quantityunit !== "") {

					var fieldmultply = priceunit * quantityunit;
					var totalvalue = fieldmultply;

					this.getView().byId("totalid").setValue(totalvalue);

				}
			},*/
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
			// },

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Trade_Finance.Trade_Finance.view.buyerlcCreate
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Trade_Finance.Trade_Finance.view.buyerlcCreate
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Trade_Finance.Trade_Finance.view.buyerlcCreate
		 */
		//	onExit: function() {
		//
		//	}

	});

});