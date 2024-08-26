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

        findMostPurchasedProduct: function (transactions) {
            // Create an object to store total purchased quantities for each product
            const productPurchaseMap = {};

            // Loop through each transaction
            transactions.forEach((transaction) => {
                // Only consider 'IN' (purchased) transactions
                if (transaction.transaction_type === "IN") {
                    const productId = transaction.product_id;
                    const quantity = transaction.quantity;

                    // Sum up the quantity for each product
                    if (productPurchaseMap[productId]) {
                        productPurchaseMap[productId] += quantity;
                    } else {
                        productPurchaseMap[productId] = quantity;
                    }
                }
            });

            // Find the product with the highest purchased quantity
            let mostPurchasedProduct = null;
            let maxQuantity = 0;

            // Loop through the productPurchaseMap to find the product with the highest quantity
            for (const productId in productPurchaseMap) {
                if (productPurchaseMap[productId] > maxQuantity) {
                    maxQuantity = productPurchaseMap[productId];
                    mostPurchasedProduct = productId;
                }
            }

            return { mostPurchasedProduct, maxQuantity }
        },
        onPieChartSelect: function (oEvent) {

            var oData = oEvent.getParameter("data");
            console.log(oData[0].data.Category)

            var oCircletext = this.byId("circletext")
            oCircletext.setVisible(true)
            var oCircle = this.byId("circle")
            oCircle.setVisible(true)
            var otext = this.byId("valuecircle")


            var orecttext = this.byId("recttext")
            orecttext.setVisible(true)
            var orect = this.byId("rect")
            orect.setVisible(true)
            var otextrect = this.byId("rectvalue")


            var oProductsModel = this.getOwnerComponent().getModel("productsModel");
            var aProducts = oProductsModel.getProperty("/Products");
            var oInventoryModel = this.getView().getModel("inventory");
            var omod = this.getOwnerComponent().getModel("inventory");
            var transactions = omod.getData()
            transactions = transactions.InventoryTransactions
            console.log(transactions)
            const productPurchaseMap = {};

            // Loop through each transaction
            transactions.forEach((transaction) => {
                // Only consider 'IN' (purchased) transactions
                if (transaction.transaction_type === "OUT") {
                    const productId = transaction.product_id;
                    const quantity = transaction.quantity;

                    // Sum up the quantity for each product
                    if (productPurchaseMap[productId]) {
                        productPurchaseMap[productId] += parseInt(quantity);
                    } else {
                        productPurchaseMap[productId] = parseInt(quantity);
                    }
                }
            });
            const maxValue = Math.max(...Object.values(productPurchaseMap));

            console.log("Max Value:", maxValue);
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
            otextrect.setText(maxValue)
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
