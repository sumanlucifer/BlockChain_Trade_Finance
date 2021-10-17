sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("temp.L_C.controller.newlcsellerviewDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf temp.L_C.view.newlcsellerviewDetails
		 */
		onInit: function () {

		},
		sellerapproveback: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("sellerlanding");
		},
		openapprovefrag1: function () {

			if (!this.oapproveDialog) {
				this.oapproveDialog = new sap.ui.xmlfragment("finalcreatsubmitFrag", "temp.L_C.fragment.approve",
					this);
				this.getView().addDependent(this.oapproveDialog);
			}
			this.oapproveDialog.open();
		},
		
		onpressapproveClose: function(){
			this.oapproveDialog.close();
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf temp.L_C.view.newlcsellerviewDetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf temp.L_C.view.newlcsellerviewDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf temp.L_C.view.newlcsellerviewDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});