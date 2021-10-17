sap.ui.define([], function () {
	"use strict";

	return {

		statusText: function (sStatus) {
			// var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			switch (sStatus) {
			case "SUB_BUYER":
				return "Submitted";
			case "APP_BUYER_BANK":
				return "Approved by Buyer's Bank";
			case "PENDING":
				return "Pending";
			case "REJ_BUYER_BANK":
				return "Rejected by Buyer's Bank";
			case "APP_SELLER_BANK":
				return "Approved by Seller's Bank";
			case "REJ_SELLER_BANK":
				return "Rejected by Seller's Bank";
			case "GOODS_DIS_PEN":
				return "Goods Dispatched Pending";
			case "PAYMENT_PROGRESS":
				return "Payment in Progress";
			case "COMPLETED":
				return "Completed";

			default:
				return sStatus;
			}
		},
		statusColor: function (sStatus) {
			// var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			switch (sStatus) {
			case "SUB_BUYER":
				return "Success";
			case "PENDING":
				return "Warning";

			default:
				return 'None';
			}
		},
	};
});