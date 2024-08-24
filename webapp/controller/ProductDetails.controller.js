
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover", "sap/m/MessageToast",
    "sap/m/Dialog",
    '../model/formatter',
], function (Controller, JSONModel, Popover, MessageToast, Dialog, formatter) {
    "use strict";
    return Controller.extend("project1.controller.ProductDetails", {
        formatter: formatter,
        onInit: function () {
            this.getOwnerComponent().getModel("inventory");
            let oRouter = this.getOwnerComponent().getRouter();
            console.log("each time")
            oRouter.getRoute("productDetails").attachMatched(this.onRouteMatched, this);

        },
        onRouteMatched: function (oEvent) {
            // this.onInit()
            let productId = oEvent.getParameter("arguments").productId;
            this.productId = productId;
            let opanel = this.byId("supplierDetailsPane")
            opanel.setVisible(false)

            this._productId = oEvent.getParameter("arguments").productId;
            let oSplitter = this.byId("splitter");
            oSplitter.setWidth("200%");
            let oProductsModel = this.getView().getModel("productsModel");
            let aProducts = oProductsModel.getProperty("/Products");
            let oSelectedProduct = aProducts.find(function (product) {
                return product.product_id === productId;
            });
            if (oSelectedProduct) {
                let oProductModel = new JSONModel(oSelectedProduct);

                this.getView().setModel(oProductModel, "productDetailsModel");
            }


        },
        onNavBack: function () {
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("products");
        },
        onManageSupplierPress: function (oEvent) {
            let oSplitter = this.byId("splitter");
            let opanel = this.byId("supplierDetailsPane")
            opanel.setVisible(true)
            let oPopover = this.byId("supplierPopover");
            oPopover.setVisible(false)
            let currentWidth = oSplitter.getWidth();
            if (currentWidth === "200%") {
                oSplitter.setWidth("135%");
            }
            let oProductsModel = this.getView().getModel("productDetailsModel");
            let aSupplierIds = oProductsModel.getProperty("/supplier_ids");
            let oSupplierModel = this.getView().getModel("suppliersModel");
            let aSelectedSuppliers = [];
            // Set the filtered suppliers to the Popover's model
            //var oFilteredSupplierModel = new JSONModel({ Suppliers: aSuppliers });
            //oPopover.setModel(oFilteredSupplierModel, "suppliersModel");
            aSupplierIds.forEach(function (supplierId) {
                var oSelectedSupplier = oSupplierModel.getProperty("/Suppliers").find(function (row) {
                    return row.supplier_id === supplierId;
                });
                if (oSelectedSupplier) {
                    aSelectedSuppliers.push(oSelectedSupplier); // Add the supplier details to the array
                }
            });
            console.log("aSelectedSuppliers", aSelectedSuppliers)
            // oPopover.setModel(new JSONModel(aSelectedSuppliers), "supplier");
            oSupplierModel = new JSONModel(aSelectedSuppliers);
            this.getView().setModel(oSupplierModel, "suppliersDetailModel");
            // oPopover.openBy(oButton);
            // Assuming you want to perform some action when the Manage Supplier button is pressed
        },
        onSupplierDetailsPress: function (oEvent) {
            console.log("chekcng")
            let oPopover = this.byId("supplierPopover");
            oPopover.setVisible(true)
            console.log("oEvent", oEvent)
            let oSource = oEvent.getSource();
            let oSplitter = this.byId("splitter");
            let opanel = this.byId("supplierDetailsPane")
            opanel.setVisible(true)

            oPopover.setVisible(false)
            let currentWidth = oSplitter.getWidth();
            if (currentWidth === "200%") {
                oSplitter.setWidth("135%");
            }
            let oBindingContext = oSource.getBindingContext("suppliersDetailModel");
            console.log("oBindingContext", oBindingContext)
            let sSupplierId = oBindingContext.getProperty("supplier_id");
            let sSupplierName = oBindingContext.getProperty("supplier_name");
            let sContactPhone = oBindingContext.getProperty("contact_phone");
            let sContactEmail = oBindingContext.getProperty("contact_email");
            let sSupplierImage = oBindingContext.getProperty("image_url");
            console.log("sSupplierId", sSupplierName)
            let oSupplierDetailsModel = new JSONModel({
                supplier_id: sSupplierId,
                supplier_name: sSupplierName,
                contact_phone: sContactPhone,
                contact_email: sContactEmail,
                image_url: sSupplierImage,
            });
            // Reference the Popover

            // Set the new model to the Popover
            oPopover.setModel(oSupplierDetailsModel, "suppliersDetailModel");
            // Open the Popover
            oPopover.openBy(oSource);
            ///var oProductsModel = this.getView().getModel("productsModel");
            /// var aSupplierIds = oProductsModel.getProperty("/supplier_ids");
            ///var oSupplierModel = this.getView().getModel("suppliersModel");
            ///var aSuppliers = oSupplierModel.getProperty("/Suppliers");
            // Filter suppliers based on the supplier_ids of the selected product
            ///var aSelectedSuppliers = [];
            // Set the filtered suppliers to the Popover's model
            //var oFilteredSupplierModel = new JSONModel({ Suppliers: aSuppliers });
            //oPopover.setModel(oFilteredSupplierModel, "suppliersModel");
            /// aSupplierIds.forEach(function (supplierId) {
            ///var oSelectedSupplier = oSupplierModel.getProperty("/Suppliers").find(function (row) {
            ///return row.supplier_id === supplierId;
            /// });
            /// if (oSelectedSupplier) {
            ///  aSelectedSuppliers.push(oSelectedSupplier); // Add the supplier details to the array
            ///}
            ///});
            /// console.log("aSelectedSuppliers", aSelectedSuppliers)
            /// oPopover.setModel(new JSONModel(aSelectedSuppliers), "suppliersModel");
            /// oPopover.openBy(oButton);
        },
        delete: function () {
            let oProductsModel = this.getView().getModel("productsModel");
            let aProducts = oProductsModel.getProperty("/Products");
            let oSelectedProduct = aProducts.find(function (product) {
                return product.product_id === productId;
            });
            if (oSelectedProduct) {
                let oProductModel = new JSONModel(oSelectedProduct);
                console.log(oProductModel)
                this.getView().setModel(oProductModel, "productsModel");
            }
        },
        onDelete: function (oEvent) {
            var that = this; // Store reference to `this`
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var productId = this._productId;

            if (!productId) {
                MessageToast.show("No product ID found.");
                return;
            }

            // Create a confirmation dialog
            var oDialog = new sap.m.Dialog({
                title: 'Confirm Deletion',
                type: 'Message',
                content: new sap.m.Text({ text: 'Are you sure you want to delete this product?' }),
                beginButton: new sap.m.Button({
                    text: 'Yes',
                    press: function () {
                        // Get the model and products array
                        var oModel = that.getOwnerComponent().getModel("productsModel");
                        var aProducts = oModel.getData().Products;

                        // Filter out the product to be deleted
                        var updatedProducts = aProducts.filter(function (product) {
                            return product.product_id !== productId;
                        });

                        // Update the model with the new products list
                        oModel.setProperty("/Products", updatedProducts);

                        // Show success message
                        MessageToast.show("Product deleted successfully!");

                        // Navigate back to the products list
                        oRouter.navTo("products");

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

        _navigateBack: function () {
            var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                // The history stack has a previous entry
                window.history.go(-1);
            } else {
                // Otherwise, navigate back to the products page
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("productsPage", {}, true);
            }
        },

        onEdit: function (oEvent) {
            var oDialog = this.byId("editProductDialogDetails");

            let oProductsModel = this.getView().getModel("productDetailsModel").getData()
            this.byId("inputEditProductNameDetails").setValue(oProductsModel.product_name);

            this.byId("inputEditQuantityDetails").setValue(oProductsModel.quantity_in_stock);
            this.byId("inputEditPriceDetails").setValue(oProductsModel.price_per_unit);
            this.byId("comboAddCategoryEditDetails").setSelectedKey(oProductsModel.category);
            this.iOldQuantity = oProductsModel.price_per_unit
            oDialog.open();

            // Open the dialog

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
        onSaveEditProduct: function () {
            var oDialog = this.byId("editProductDialogDetails");
            //var oModel = this.getView().getModel("productsModel");
            // Get the current context and the data bound to it
            //  var oContext = oDialog.getBindingContext("productsModel");
            //  var oData = oContext.getObject();
            // Assuming your productsModel is set to update the backend automatically on changes
            // If the model is set to manual update, you may need to call submitChanges
            // Close the dialog
            var oProductsModel = this.getView().getModel("productDetailsModel").getData();
            //var oInventoryModel = this.getView().getModel("inventory");
            //var sProductPath = oDialog.getBindingContext("productDetailsModel").getPath();
            // var oProductData = oProductsModel.getProperty(sProductPath);
            var sProductName = this.byId("inputEditProductNameDetails").getValue();
            var sCategory = this.byId("comboAddCategoryEditDetails").getValue();
            var iNewQuantity = this.byId("inputEditQuantityDetails").getValue();
            var fPricePerUnit = this.byId("inputEditPriceDetails").getValue();

            oProductsModel.product_name = sProductName
            oProductsModel.product_name = sProductName;
            oProductsModel.category = sCategory;
            oProductsModel.quantity_in_stock = iNewQuantity;
            oProductsModel.price_per_unit = fPricePerUnit;
            if (this.iOldQuantity > iNewQuantity)
                var sType = "OUT"
            else
                var sType = "IN"
            if (this.validate(sProductName, sCategory, iNewQuantity, fPricePerUnit, "inputEditProductNameDetails", "comboAddCategoryEditDetails", "inputEditQuantityDetails", "inputEditPriceDetails")) {
                // Create a new transaction entry
                var oNewTransaction = {
                    product_id: oProductsModel.product_id,
                    transaction_id: this._generateTransactionId(),
                    transaction_type: sType,
                    quantity: iNewQuantity,
                    transaction_date: new Date().toISOString()
                };
                var oInventoryModel = this.getView().getModel("inventory");
                var omod = this.getOwnerComponent().getModel("inventory");
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
            oDialog.close();
            console.log(oProductsModel)

            this.getView().getModel("productDetailsModel").updateBindings(true)
            sap.m.MessageToast.show("Product updated successfully!");

        },
        _generateTransactionId: function () {
            return Math.random().toString(36).substr(2, 9).toUpperCase();
        },
        onCancelEditProduct: function (oEvent) {
            // Simply close the dialog without saving
            var oDialog = this.byId("editProductDialogDetails");

            // Close the dialog
            oDialog.close();
        },

    });

});
