sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    '../model/formatter',

], function (Controller, JSONModel, UIComponent, formatter) {
    "use strict";

    return Controller.extend("project1.controller.Reports", {
        formatter: formatter,
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
            //var oVizFrame = this.byId("idPieChart");

            // Get the vizProperties
            var vizProperties = oVizFrame.getVizProperties();

            // You need to access the properties related to colors
            //var colorProperties = vizProperties.legend.items;

            // Log the color properties to the console
            console.log("check", vizProperties);
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

            var orecttext = this.byId("sidePanel")
            orecttext.setVisible(true)
            /*
                        var oData = oEvent.getParameter("data");
                        console.log(oData[0].data.Category)
                        this.byId("chart").setWidth("100%")
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
            
            
                        var orecttextleft = this.byId("circletextLeft")
                        orecttextleft.setVisible(true)
                        var orectleft = this.byId("circleLeft")
                        orectleft.setVisible(true)
                        var otextrectleft = this.byId("circlevalueLeft")
            
            
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
                            if (transaction.transaction_type === "OUT" && transaction.category == oData[0].data.Category) {
                                const productId = transaction.product_name;
                                const quantity = transaction.quantity;
                                productPurchaseMap[productId] = []
                                // Sum up the quantity for each product
                                if (!productPurchaseMap[productId]) {
                                    productPurchaseMap[productId] = [];
                                }
                                if (productPurchaseMap[productId][0]) {
                                    productPurchaseMap[productId][0] += parseInt(quantity);
                                } else {
                                    productPurchaseMap[productId][0] = parseInt(quantity);
                                }
                                productPurchaseMap[productId][1] = parseInt(transaction.price_per_unit);
                            }
                        });
            
                        // const maxValue = Math.max(...Object.values(productPurchaseMap));
                        const maxKey = Object.keys(productPurchaseMap).reduce((a, b) =>
                            productPurchaseMap[a][0] > productPurchaseMap[b][0] ? a : b
                        );
                        let maxProduct = -Infinity; // Initialize with a very low value
                        let prod = ""
                        // Iterate over each key-value pair in the dictionary
                        for (let key in productPurchaseMap) {
                            let values = productPurchaseMap[key];
            
                            // Ensure there are exactly two values in the array
            
                            let product = values[0] * values[1]; // Multiply the two values
            
                            // Update maxProduct if the current product is greater
                            if (product > maxProduct) {
                                maxProduct = product;
                                prod = key
                            }
            
                        }
                        console.log(maxProduct, prod)
            
                        const maxValue = productPurchaseMap[maxKey][0];
            
            
            
            
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
                        otextrect.setText(maxKey + ": " + maxValue);
                        otextrectleft.setText(prod + ":  " + formatter.formatCurrency(maxProduct));
                        // Now, oCategoryStockLevels contains the total stock level for each category
                        console.log(oCategoryStockLevels[oData[0].data.Category]);
            */

        },
        onSideNavButtonPress: function () {
            var oToolPage = this.getView().byId("reports");
            var bSideExpanded = oToolPage.getSideExpanded();
            oToolPage.setSideExpanded(!bSideExpanded);
        }
    });
});
