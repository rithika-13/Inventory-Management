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

            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(this.onRouteMatched, this);

        },
        onRouteMatched: function (oEvent) {
            let sRouteName = oEvent.getParameter("name");
            let oNavigationList = this.getView().byId("navigationList");
            let oProductsModel = this.getOwnerComponent().getModel("productsModel");
            let aProducts = oProductsModel.getProperty("/Products");
            let oToolPage = this.getView().byId("reports");
            let bSideExpanded = oToolPage.getSideExpanded();// gives a boolean value, true or false and then sets to neagtion
            //console.log("expland",bSideExpanded)// true or false value
            oToolPage.setSideExpanded(!bSideExpanded);
            let oVizFrame = this.byId("idPieChart");
            // Set the VizFrame properties
            oVizFrame.setVizProperties({
                title: {
                    visible: false
                },
                tooltip: {
                    visible: true,
                },
                plotArea: {

                    dataLabel: {
                        visible: true,
                        showTotal: false,
                    }
                },
                legend: {
                    visible: true
                }

            });

            let oCategoryStockLevels = {};
            //stock levels
            aProducts.forEach(function (product) {
                let sCategory = product.category; // Assuming each product has a 'category' field
                let iStockLevel = product.quantity_in_stock; // Assuming each product has a 'quantity_in_stock' field
                // If the category is not yet in the dictionary, initialize it
                if (!oCategoryStockLevels[sCategory]) {
                    oCategoryStockLevels[sCategory] = 0;
                }

                // Add the stock level of the product to its category
                oCategoryStockLevels[sCategory] += parseInt(iStockLevel);;
            });
            let aCategoryStockData = Object.keys(oCategoryStockLevels).map(function (sCategory) {
                return {
                    category: sCategory,
                    count: oCategoryStockLevels[sCategory]
                };
            });

            let oPieChartData = {
                Categories: aCategoryStockData
            };
            // Set the pie chart model to the view
            let oPieChartModel = new JSONModel(oPieChartData);
            this.getView().setModel(oPieChartModel, "pieChartModel");
            // Set the products model to the view (if not already set)
            this.getView().setModel(oProductsModel, "productsModel");
            // Set the selected key based on the route name
            this.onPiechartinit()
            oNavigationList.setSelectedKey(sRouteName);
        },
        onPiechartinit: function () {
            var oProductsModel = this.getOwnerComponent().getModel("productsModel");
            var aProducts = oProductsModel.getProperty("/Products");
            var omod = this.getOwnerComponent().getModel("inventory");
            var transactions = omod.getData()
            transactions = transactions.InventoryTransactions
            const productPurchaseMap = {};

            transactions.forEach((transaction) => {
                // Only consider 'IN' (purchased) transactions
                if (transaction.transaction_type === "OUT") {
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
            const maxValue = productPurchaseMap[maxKey][0];
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

            let istock = 0
            aProducts.forEach(function (product) {

                let iStockLevel = product.quantity_in_stock; // Assuming each product has a 'quantity_in_stock' field


                istock += iStockLevel

            });
            var oData = {
                items: [
                    {
                        title: istock,
                        description: "Stock Level"
                    },
                    {
                        title: maxKey + ": " + maxValue,
                        description: "Most sold product"
                    },
                    {
                        title: prod + ": " + formatter.formatCurrency(maxProduct),
                        description: "Most revenue generated"
                    }
                ]
            };

            // Set the data to a JSON model
            var oModel = new sap.ui.model.json.JSONModel(oData);


            this.getView().setModel(oModel, "myModel");
        },
        onNavSelect: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            var oSelectedItem = oEvent.getParameter("item");
            var sKey = oSelectedItem.getKey();
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo(sKey);

        },

        onPieChartSelect: function (oEvent) {

            var oList = this.byId("stats")
            oList.setVisible(true)

            var oData = oEvent.getParameter("data");
            console.log(oData[0].data.Category)
            var oProductsModel = this.getOwnerComponent().getModel("productsModel");
            var aProducts = oProductsModel.getProperty("/Products");
            var omod = this.getOwnerComponent().getModel("inventory");
            var transactions = omod.getData()
            transactions = transactions.InventoryTransactions
            const productPurchaseMap = {};

            //  max sold and revenue generated in terms of admin-OUT  tansaction
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
            const maxValue = productPurchaseMap[maxKey][0];
            var oCategoryStockLevels = {};
            //stock levels
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
            //create model for it
            var oData = {
                items: [
                    {
                        title: oCategoryStockLevels[oData[0].data.Category],
                        description: "Category Stock Level"
                    },
                    {
                        title: maxKey + ": " + maxValue,
                        description: "Most sold product"
                    },
                    {
                        title: prod + ": " + formatter.formatCurrency(maxProduct),
                        description: "Most revenue generated"
                    }
                ]
            };

            // Set the data to a JSON model
            var oModel = new sap.ui.model.json.JSONModel(oData);


            this.getView().setModel(oModel, "myModel");




        },
        onSideNavButtonPress: function () {
            var oToolPage = this.getView().byId("reports");
            var bSideExpanded = oToolPage.getSideExpanded();
            oToolPage.setSideExpanded(!bSideExpanded);
        }
    });
});
