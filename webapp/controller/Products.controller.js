sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    '../model/formatter',
    "sap/ui/core/UIComponent"
], function (
    Controller,
    MessageToast,
    formatter,
    UIComponent
) {
    "use strict";
    return Controller.extend("project1.controller.Products", {
        formatter: formatter,//module/file formarter.js and also providing the funciton name formater so we can call this using dot notation

        onInit: function () {
            //this efers to the instance of the controller itself. and view associa
            //In SAPUI5, each view and controller typically belongs to a component. The getOwnerComponent() method 
            //returns the component instance that "owns" the current view(my case compponen.js where my route has been insialied then manifest json and etc). It is used to access the component-level resources and configurations.
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(this.onRouteMatched, this);
            //let oNavigationList = this.getView().byId("navigationList");
            // oNavigationList.setSelectedKey("products");
            // console.log("why", oNavigationList)
            //this.getView().setModel(oProductsModel, "productsModel");
        },
        onRouteMatched: function (oEvent) {
            let oModel = this.getOwnerComponent().getModel("productsModel");
            oModel.setProperty("/Products", oModel.getProperty("/Products"))
            // Set the model to the view (current controller's view)
            this.getView().setModel(oModel, "productsModel");
            console.log("here??", this.getOwnerComponent().getModel("productsModel"))
            let sRouteName = oEvent.getParameter("name");
            let oNavigationList = this.getView().byId("navigationList");
            // Set the selected key based on the route name
            oNavigationList.setSelectedKey(sRouteName);
        },
        onSideNavButtonPress: function () {
            let oToolPage = this.getView().byId("products");//get section of ui that has 'prod'
            let bSideExpanded = oToolPage.getSideExpanded();// gives a boolean value, true or false and then sets to neagtion
            //console.log("expland",bSideExpanded)// true or false value
            oToolPage.setSideExpanded(!bSideExpanded);
        },
        onNavSelect: function (oEvent) {
            let oSelectedItem = oEvent.getParameter("item");
            let sKey = oSelectedItem.getKey();
            let oRouters = UIComponent.getRouterFor(this);
            oRouters.navTo(sKey);
        },
        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home"); // Adjust "homePage" to the actual route name for your homepage
        },
        onSearch: function (oEvent) {
            let oTable = this.byId("productTable");
            let oBinding = oTable.getBinding("items");
            let sQuery = oEvent.getParameter("query");
            let aFilters = [];
            // Search Filters
            if (sQuery && sQuery.length > 0) {
                let sQueryLowerCase = sQuery.toLowerCase();
                var oNameFilter = new sap.ui.model.Filter({
                    path: "product_name",
                    test: function (sValue) {
                        return sValue.toLowerCase().indexOf(sQueryLowerCase) > -1;
                    }
                });
                var oIdFilter = new sap.ui.model.Filter({
                    path: "product_id",
                    test: function (sValue) {
                        return sValue.toString().toLowerCase().indexOf(sQueryLowerCase) > -1;
                    }
                });
                var oQuantityFilter = new sap.ui.model.Filter({
                    path: "quantity_in_stock",
                    test: function (iValue) {
                        return iValue.toString().indexOf(sQueryLowerCase) > -1;
                    }
                });
                var oPriceFilter = new sap.ui.model.Filter({
                    path: "price_per_unit",
                    test: function (fValue) {
                        return fValue.toString().indexOf(sQueryLowerCase) > -1;
                    }
                });
                var oSearchFilter = new sap.ui.model.Filter({
                    filters: [oNameFilter, oIdFilter, oQuantityFilter, oPriceFilter],
                    and: false
                });
                aFilters.push(oSearchFilter);
            }
            // Apply the filters
            this._applyCombinedFilters(aFilters);
        },
        onFilterChange: function (oEvent) {
            let oComboBox = oEvent.getSource();
            let sSelectedKey = oComboBox.getSelectedKey();
            let aFilters = [];
            if (sSelectedKey && sSelectedKey !== "All") {
                var oCategoryFilter = new sap.ui.model.Filter("category", sap.ui.model.FilterOperator.Contains, sSelectedKey);
                aFilters.push(oCategoryFilter);
            }
            // Apply the filters
            this._applyCombinedFilters(aFilters);
        },
        _applyCombinedFilters: function (aFilters) {
            let oTable = this.byId("productTable");
            let oBinding = oTable.getBinding("items");
            // Get any existing search filters applied
            let oSearchInput = this.byId("searchField"); // Assuming there's an ID for the search field
            let sSearchQuery = oSearchInput ? oSearchInput.getValue() : null;
            if (sSearchQuery && sSearchQuery.length > 0) {
                let sSearchQueryLowerCase = sSearchQuery.toLowerCase();
                var oNameFilter = new sap.ui.model.Filter({
                    path: "product_name",
                    test: function (sValue) {
                        return sValue.toLowerCase().indexOf(sSearchQueryLowerCase) > -1;
                    }
                });
                var oIdFilter = new sap.ui.model.Filter({
                    path: "product_id",
                    test: function (sValue) {
                        return sValue.toString().toLowerCase().indexOf(sSearchQueryLowerCase) > -1;
                    }
                });
                var oQuantityFilter = new sap.ui.model.Filter({
                    path: "quantity_in_stock",
                    test: function (iValue) {
                        return iValue.toString().indexOf(sSearchQueryLowerCase) > -1;
                    }
                });
                var oPriceFilter = new sap.ui.model.Filter({
                    path: "price_per_unit",
                    test: function (fValue) {
                        return fValue.toString().indexOf(sSearchQueryLowerCase) > -1;
                    }
                });
                var oSearchFilter = new sap.ui.model.Filter({
                    filters: [oNameFilter, oIdFilter, oQuantityFilter, oPriceFilter],
                    and: false
                });
                aFilters.push(oSearchFilter);
            }
            // Combine all filters with AND logic
            if (aFilters.length > 0) {
                var oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: true
                });
                oBinding.filter(oCombinedFilter);
            } else {
                oBinding.filter([]); // Clear filters if none
            }
        },

        onSelectionChange: function (oEvent) {
            let aSelectedItems = oEvent.getSource().getSelectedItems();
            // this.getView().getModel("productsModel").setProperty("/selectedProducts", aSelectedItems);
            this.byId("deleteSelectedButton").setEnabled(aSelectedItems.length > 0);
            // this.byId("addSelectedButton").setVisible(aSelectedItems.length < 1)
            this.byId("addSelectedButton").setEnabled(aSelectedItems.length < 1)
        },
        onDeleteSelectedProducts: function () {
            let that = this; // Store reference to `this`
            let oTable = this.byId("productTable");
            let aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageToast.show("No products selected for deletion");
                return;
            }

            // Create a confirmation dialog
            let oDialog = new sap.m.Dialog({
                title: 'Confirm Deletion',
                type: 'Message',
                content: new sap.m.Text({ text: 'Are you sure you want to delete the selected product(s)?' }),
                beginButton: new sap.m.Button({
                    text: 'Yes',
                    press: function () {
                        // Get the model and products array
                        let oModel = that.getView().getModel("productsModel");
                        let aProducts = oModel.getProperty("/Products");

                        // Remove selected items from the array
                        aSelectedItems.forEach(function (oItem) {
                            let iIndex = oItem.getBindingContext("productsModel").getPath().split("/").pop();
                            aProducts.splice(iIndex, 1);
                        });

                        // Update the model with the new products list
                        oModel.setProperty("/Products", aProducts);

                        // Clean up UI
                        oTable.removeSelections();
                        that.byId("deleteSelectedButton").setEnabled(false);
                        that.byId("addSelectedButton").setEnabled(true);

                        MessageToast.show(aSelectedItems.length + " product(s) deleted");

                        // Close the dialog
                        oDialog.close();
                    }
                }),
                endButton: new sap.m.Button({
                    text: 'No',
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            // Open the dialog
            oDialog.open();
        },

        onAddProduct: function () {
            let oView = this.getView();
            var oDialog = this.byId("addProductDialog");
            oDialog.open();
            this.byId("inputAddProductName").setValue("");
            this.byId("comboAddCategory").setValue("");
            this.byId("inputAddQuantity").setValue("");
            this.byId("inputAddPrice").setValue("");
            this.byId("inputAddProductName").setValueState("None")
            this.byId("comboAddCategory").setValueState("None")
            this.byId("inputAddQuantity").setValueState("None")
            this.byId("inputAddPrice").setValueState("None")
            // Open the dialog
            oDialog.open();
        },
        validate: function (sProductName, sCategory, iQuantity, fPrice, sProductNameId, sCategoryId, iQuantityId, fPriceId) {
            var check = true;
            console.log(sProductName, sCategory, iQuantity, fPrice, sProductNameId, sCategoryId, iQuantityId, fPriceId)
            // Validate Product Name
            if (formatter.validatename(sProductName)[0]) {
                this.byId(sProductNameId).setValueState("None"); // Clear any previous error state
            } else {
                this.byId(sProductNameId).setValueState("Error"); // Set error state
                this.byId(sProductNameId).setValueStateText(formatter.validatename(sProductName)[1]); // Error message
                check = false;
            }
            // Validate Category
            if (formatter.validateLabel(sCategory)) {
                this.byId(sCategoryId).setValueState("None"); // Clear any previous error state
            } else {
                this.byId(sCategoryId).setValueState("Error"); // Set error state
                this.byId(sCategoryId).setValueStateText("Category is required."); // Error message
                check = false;
            }
            // Validate Quantity
            if (formatter.validateQuantity(iQuantity)[0]) {
                this.byId(iQuantityId).setValueState("None");
            } else {
                this.byId(iQuantityId).setValueState("Error");
                this.byId(iQuantityId).setValueStateText(formatter.validateQuantity(iQuantity)[1]);
                check = false;
            }
            // Validate Price
            if (formatter.validatePrice(fPrice)[0]) {
                this.byId(fPriceId).setValueState("None");
            } else {
                this.byId(fPriceId).setValueState("Error");
                this.byId(fPriceId).setValueStateText(formatter.validatePrice(fPrice)[1]);
                check = false;
            }
            return check;
        },
        onConfirmAddProduct: function () {
            // Get input values
            var sProductName = this.byId("inputAddProductName").getValue();
            var sCategory = this.byId("comboAddCategory").getValue();
            var iQuantity = this.byId("inputAddQuantity").getValue()
            var fPrice = this.byId("inputAddPrice").getValue()
            //  console.log("chck", this.validate(sProductName, sCategory, iQuantity, fPrice))
            // console.log(formatter.validateProductName(sProductName))
            if (this.validate(sProductName, sCategory, iQuantity, fPrice, "inputAddProductName", "comboAddCategory", "inputAddQuantity", "inputAddPrice")) {
                // Create a new product object
                var oNewProduct = {
                    product_id: Date.now().toString(), // or generate a more complex ID
                    product_name: sProductName,
                    category: sCategory,
                    quantity_in_stock: iQuantity,
                    price_per_unit: fPrice
                };
                // Add new product to the model
                var oModel = this.getView().getModel("productsModel");
                var aProducts = oModel.getProperty("/Products");
                aProducts.push(oNewProduct);
                oModel.setProperty("/Products", aProducts);
                // Close dialog and show success message
                this.byId("addProductDialog").close();
                MessageToast.show("Product added successfully.");
            }
        },
        _generateTransactionId: function () {
            return Math.random().toString(36).substr(2, 9).toUpperCase();
        },
        onCancelAddProduct: function () {
            // Close the dialog
            this.byId("addProductDialog").close();
        },
        onEditProduct: function (oEvent) {
            let oView = this.getView();
            var oDialog = this.byId("editProductDialog");
            this.byId("inputEditProductName").setValueState("None")
            this.byId("comboAddCategoryEdit").setValueState("None")
            this.byId("inputEditQuantity").setValueState("None")
            this.byId("inputEditPrice").setValueState("None")
            // Bind the selected product context to the dialog
            var oContext = oEvent.getSource().getBindingContext("productsModel");
            oDialog.setBindingContext(oContext, "productsModel");
            var sCategory = oContext.getProperty("category");
            // Set the selected key for the ComboBox based on the category
            var oComboBox = this.byId("comboAddCategoryEdit");
            oComboBox.setSelectedKey(sCategory);
            // Store original data to reset on cancel
            this._originalData = JSON.parse(JSON.stringify(oContext.getObject()));
            var oProductsModel = this.getView().getModel("productsModel");
            var sProductPath = oDialog.getBindingContext("productsModel").getPath();
            var oProductData = oProductsModel.getProperty(sProductPath);
            console.log("oContext", oProductData)
            this.iOldQuantity = oProductData.quantity_in_stock
            //  iOldQuantity = this.iOldQuantity;
            // Open the dialog
            oDialog.open();


        },
        onSaveEditProduct: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("productsModel");
            var sProductId = oContext.getProperty("product_id");
            var oDialog = this.byId("editProductDialog");
            var oInventoryModel = this.getView().getModel("inventory");
            var sProductName = this.byId("inputEditProductName").getValue();
            var sCategory = this.byId("comboAddCategoryEdit").getValue();
            var iNewQuantity = this.byId("inputEditQuantity").getValue();
            var fPricePerUnit = this.byId("inputEditPrice").getValue();

            var omod = this.getOwnerComponent().getModel("inventory");
            if (this.iOldQuantity > iNewQuantity)
                var sType = "OUT"
            else
                var sType = "IN"
            //oDialog.close();
            if (this.validate(sProductName, sCategory, iNewQuantity, fPricePerUnit, "inputEditProductName", "comboAddCategoryEdit", "inputEditQuantity", "inputEditPrice")) {
                // Create a new transaction entry
                var oNewTransaction = {
                    product_id: sProductId,
                    transaction_id: this._generateTransactionId(),
                    transaction_type: sType,
                    quantity: Math.abs(iNewQuantity - this.iOldQuantity),
                    transaction_date: formatter.formatDate(new Date())
                };
                // Add the new transaction to the model
                omod.oData.InventoryTransactions.push(oNewTransaction);
                oInventoryModel.setProperty("/Inventory", omod.oData.InventoryTransactions);
                console.log("2nd", omod.oData.InventoryTransactions, oInventoryModel)
                // aTransactions.push(oNewTransaction);
                // oTransactionsModel.setProperty("/Inventory", aTransactions);

                // Show a success message
                oDialog.close();
                sap.m.MessageToast.show("Product updated successfully!");
            }
        },
        onCancelEditProduct: function (oEvent) {
            // Simply close the dialog without saving
            var oDialog = this.byId("editProductDialog");
            var oContext = oDialog.getBindingContext("productsModel");
            // Reset the data to original values
            var oModel = this.getView().getModel("productsModel");
            oModel.setProperty(oContext.getPath(), this._originalData);
            // Close the dialog
            oDialog.close();
        },
        onMoreDetails: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("productsModel");
            var sProductId = oContext.getProperty("product_id");
            console.log(oContext)
            // Navigate to ProductDetails view with productId as parameter
            this.getOwnerComponent().getRouter().navTo("productDetails", {
                productId: sProductId
            }, true);
        },
    });
});
