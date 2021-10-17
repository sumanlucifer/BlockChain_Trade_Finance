sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";
	var that;
	return Controller.extend("temp.L_C.controller.buyerlcCreate", {

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
					text: "Computer Hardwares"
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

		},

		onpresscreatebutton: function () {

			/*for createlc model*/
			var ocreatemodel = this.getView().getModel("buyerlccreateModel"),
				createmodel1 = ocreatemodel.getProperty("/obuyercreate");

			/*for prodcuttype item model details*/

			var oproductmodel = this.getView().getModel("productModel"),
				oprductmodel = oproductmodel.getProperty("/productitems");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var sUrl = "https://blockchaintradefinance.cfapps.eu10.hana.ondemand.com/api/createLC";

			var oPayload = {
				"ProductMetadata": [{
					"PROD_TYPE": this.byId("idProductType").getSelectedItem().getText(),
					"PROD_QTY": this.byId("idQuantity").getValue(),
					"PROD_PRICE": this.byId("idPricePerUnit").getValue(),
					"TOTAL_VAL": this.byId("totalid").getValue(),
					"END_DATE": this.byId("Maturitydate").getValue().split("-").join(""),
					"INTEREST_RATE": this.byId("idIntersetRate").getValue()
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

					sap.m.MessageToast.show(oError.message);
					sap.ui.core.BusyIndicator.hide();
				}

			});
		},

		buyerLCButtonCreateNav: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Dashboard");
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
		onpriceChange: function () {

			var ocreatemodel = this.getView().getModel("buyerlccreateModel");

			// var priceunit = ocreatemodel.getProperty("/obuyercreate/productprice");

			var priceunit = this.getView().byId("idPricePerUnit").getValue();
			var quantityunit = this.getView().byId("idQuantity").getValue();
			if (priceunit !== "" && quantityunit !== "") {

				var fieldmultply = priceunit * quantityunit;
				var totalvalue = fieldmultply;

				this.getView().byId("totalid").setValue(totalvalue);

			}
		}

		// },

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf temp.L_C.view.buyerlcCreate
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf temp.L_C.view.buyerlcCreate
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf temp.L_C.view.buyerlcCreate
		 */
		//	onExit: function() {
		//
		//	}

	});

});