sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent"
], function (Controller, JSONModel, UIComponent) {
    "use strict";

    return Controller.extend("project1.controller.Reports", {
        onInit: function () {
            // Get the products model
            var oProductsModel = this.getOwnerComponent().getModel("productsModel");
            var aProducts = oProductsModel.getProperty("/Products");
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(this.onRouteMatched, this);
            // Initialize category counts
            var oCategoryCount = {
                "ERP Software": 0,
                "Cloud Platform": 0
            };

            // Count the number of products in each category
            aProducts.forEach(function (product) {
                if (product.category === "ERP Software") {
                    oCategoryCount["ERP Software"]++;
                } else if (product.category === "Cloud Platform") {
                    oCategoryCount["Cloud Platform"]++;
                }
            });

            // Create a model for the pie chart data
            var oPieChartData = {
                Categories: [
                    { category: "ERP Software", count: oCategoryCount["ERP Software"] },
                    { category: "Cloud Platform", count: oCategoryCount["Cloud Platform"] }
                ]
            };

            // Set the pie chart model to the view
            var oPieChartModel = new JSONModel(oPieChartData);
            this.getView().setModel(oPieChartModel, "pieChartModel");

            // Set the products model to the view (if not already set)
            this.getView().setModel(oProductsModel, "productsModel");
        },
        onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            var oNavigationList = this.getView().byId("navigationList");

            // Set the selected key based on the route name
            oNavigationList.setSelectedKey(sRouteName);
        },
        onNavSelect: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            var oSelectedItem = oEvent.getParameter("item");

            var sKey = oSelectedItem.getKey();
            //  var oNavigationList = this.getView().byId("navigationList");
            //  oNavigationList.setSelectedKey("products");
            // Now you can use the key as needed
            // console.log("Selected key:", oNavigationList);
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo(sKey);

        },
        onSideNavButtonPress: function () {
            var oToolPage = this.getView().byId("suppliers");
            var bSideExpanded = oToolPage.getSideExpanded();
            oToolPage.setSideExpanded(!bSideExpanded);
        }
    });
});
