sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent"
], function (Controller, JSONModel, UIComponent) {
    "use strict";

    return Controller.extend("project1.controller.Reports", {
        onInit: function () {

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(this.onRouteMatched, this);

        },
        onRouteMatched: function (oEvent) {
            console.log("each time 111")
            var sRouteName = oEvent.getParameter("name");
            var oNavigationList = this.getView().byId("navigationList");
            var oProductsModel = this.getOwnerComponent().getModel("productsModel");
            var aProducts = oProductsModel.getProperty("/Products");
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(this.onRouteMatched, this);
            var oVizFrame = this.byId("idPieChart");

            // Set the VizFrame properties
            oVizFrame.setVizProperties({
                title: {
                    visible: false
                },
                tooltip: {
                    visible: true,
                    formatString: "chchc" // This ensures the numbers are displayed in the tooltip
                },
                plotArea: {
                    dataPointSize: {
                        max: 35,
                        min: 30
                    },
                    dataLabel: {
                        visible: true,
                        showTotal: false,
                        hideWhenOverlap: true
                    }
                },
                interaction: {
                    selectability: {
                        mode: "single"
                    }
                },
                legend: {
                    visible: true
                }
            });
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
            console.log(oPieChartModel)
            // Set the products model to the view (if not already set)
            this.getView().setModel(oProductsModel, "productsModel");
            // Set the selected key based on the route name
            oNavigationList.setSelectedKey(sRouteName);
        },
        onNavSelect: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            var oSelectedItem = oEvent.getParameter("item");
            var sKey = oSelectedItem.getKey();
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo(sKey);

        },


        onPieChartSelect: function (oEvent) {

            var oData = oEvent.getParameter("data");
            console.log(oData[0].data.Category)

            var oFrame = this.byId("box")
            oFrame.setVisible(true)
            var otext = this.byId("value")
            otext.setVisible(true)

            var oProductsModel = this.getOwnerComponent().getModel("productsModel");
            var aProducts = oProductsModel.getProperty("/Products");

            var aCategories = oProductsModel.getProperty("/Categories");
            // Initialize an empty dictionary to store stock levels by category
            var oCategoryStockLevels = {};

            aProducts.forEach(function (product) {
                var sCategory = product.category; // Assuming each product has a 'category' field
                var iStockLevel = product.quantity_in_stock; // Assuming each product has a 'quantity_in_stock' field

                // If the category is not yet in the dictionary, initialize it
                if (!oCategoryStockLevels[sCategory]) {
                    oCategoryStockLevels[sCategory] = 0;
                }

                // Add the stock level of the product to its category
                oCategoryStockLevels[sCategory] += parseInt(iStockLevel);;
            });
            otext.setText(oCategoryStockLevels[oData[0].data.Category])
            // Now, oCategoryStockLevels contains the total stock level for each category
            console.log(oCategoryStockLevels[oData[0].data.Category]);


        },
        onSideNavButtonPress: function () {
            var oToolPage = this.getView().byId("reports");
            var bSideExpanded = oToolPage.getSideExpanded();
            oToolPage.setSideExpanded(!bSideExpanded);
        }
    });
});
