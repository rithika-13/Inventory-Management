sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    '../model/formatter',

], function (Controller, MessageToast, Filter, FilterOperator, formatter) {
    "use strict";

    return Controller.extend("project1.controller.Suppliers", {
        formatter: formatter,
        onInit: function () {

            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(this.onRouteMatched, this);
        },
        onRouteMatched: function (oEvent) {

            let sRouteName = oEvent.getParameter("name");
            let oNavigationList = this.getView().byId("navigationList");
            console.log(sRouteName)
            // Set the selected key based on the route name
            oNavigationList.setSelectedKey(sRouteName);
        },
        onSideNavButtonPress: function () {
            var oToolPage = this.getView().byId("suppliers");//get section of ui that has 'prod'
            var bSideExpanded = oToolPage.getSideExpanded();// gives a boolean value, true or false and then sets to neagtion
            //console.log("expland",bSideExpanded)// true or false value
            oToolPage.setSideExpanded(!bSideExpanded);
        },
        onSearch: function (oEvent) {
            var oTable = this.byId("supplierTable");
            var oBinding = oTable.getBinding("items");
            var sQuery = oEvent.getParameter("query");
            var oFilter = [];

            if (sQuery && sQuery.length > 0) {
                // Create an array of filters
                oFilter = [
                    new Filter("supplier_name", FilterOperator.Contains, sQuery),
                    new Filter("supplier_id", FilterOperator.Contains, sQuery),
                    new Filter("contact_name", FilterOperator.Contains, sQuery),
                    new Filter("contact_email", FilterOperator.Contains, sQuery),
                    new Filter("contact_phone", FilterOperator.Contains, sQuery),
                    new Filter("product_ids", FilterOperator.Contains, sQuery)
                ];

                // Combine filters into one using "or" operator
                var oCombinedFilter = new Filter({
                    filters: oFilter,
                    and: false // Use "or" to match any of the filters
                });

                // Apply the filter
                oBinding.filter(oCombinedFilter);
            } else {
                // Clear the filter if no search query is present
                oBinding.filter([]);
            }
        },
        onFilterChange: function (oEvent) {
            var oComboBox = oEvent.getSource();
            var oTable = this.byId("supplierTable");
            var oBinding = oTable.getBinding("items");
            var sSelectedKey = oComboBox.getSelectedKey();
            var oFilter = [];

            if (sSelectedKey && sSelectedKey !== "All") {
                oFilter.push(new Filter("category", FilterOperator.Contains, sSelectedKey));
            }

            oBinding.filter(oFilter);
        },
        onSelectionChange: function (oEvent) {
            let aSelectedItems = oEvent.getSource().getSelectedItems();
            this.byId("deleteSelectedButton").setEnabled(aSelectedItems.length > 0);
            //  this.byId("addSelectedSupplierButton").setEnabled(aSelectedItems.length < 1);
        },
        onDeleteSelectedSuppliers: function () {
            var that = this; // Store reference to `this`
            var oTable = this.byId("supplierTable");
            var aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageToast.show("No suppliers selected for deletion");
                return;
            }

            // Create a confirmation dialog
            var oDialog = new sap.m.Dialog({
                title: 'Confirm Deletion',
                type: 'Message',
                content: new sap.m.Text({ text: 'Are you sure you want to delete the selected supplier(s)?' }),
                beginButton: new sap.m.Button({
                    text: 'Yes',
                    press: function () {
                        // Get the model and suppliers array
                        var oModel = that.getView().getModel("suppliersModel");
                        var aSuppliers = oModel.getProperty("/Suppliers");

                        // Remove selected items from the array
                        aSelectedItems.forEach(function (oItem) {
                            var iIndex = oItem.getBindingContext("suppliersModel").getPath().split("/").pop();
                            aSuppliers.splice(iIndex, 1);
                        });

                        // Update the model with the new suppliers list
                        oModel.setProperty("/Suppliers", aSuppliers);

                        // Clean up UI
                        oTable.removeSelections();
                        that.byId("deleteSelectedButton").setVisible(false);
                        that.byId("addSelectedButton").setVisible(true);

                        MessageToast.show(aSelectedItems.length + " supplier(s) deleted");

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
        onNavBack: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home"); // Adjust "homePage" to the actual route name for your homepage
        },
        onAddSupplier: function () {

            this.byId("inputAddSupplierName").setValue("");
            this.byId("inputAddContactName").setValue("");
            this.byId("inputAddContactEmail").setValue("");
            this.byId("inputAddContactPhone").setValue("");
            this.byId("inputAddContactPhone").setValue("");
            this.byId("inputAddProductId").setValue("");

            this.byId("inputAddSupplierName").setValueState("None")
            this.byId("inputAddContactName").setValueState("None")
            this.byId("inputAddContactEmail").setValueState("None")
            this.byId("inputAddContactPhone").setValueState("None")
            this.byId("inputAddContactPhone").setValueState("None")
            this.byId("inputAddProductId").setValueState("None")

            var oDialog = this.byId("addSupplierDialog");

            // Reset the input fields


            // Open the dialog
            oDialog.open();
        },
        validate: function (sSupplierName, sContactName, sContactEmail, sContactPhone, sProductId, sSupplierNameId, sContactId, sContactEmailId, sContactPhoneId, inputAddProductId) {
            var check = true;
            console.log(sSupplierNameId)
            if (formatter.validatename(sSupplierName)[0]) {

                this.byId(sSupplierNameId).setValueState("None"); // Clear any previous error state
            } else {
                this.byId(sSupplierNameId).setValueState("Error"); // Set error state
                this.byId(sSupplierNameId).setValueStateText(formatter.validatename(sSupplierName)[1]); // Error message
                check = false;
            }
            if (formatter.validatename(sContactName)[0]) {

                this.byId(sContactId).setValueState("None"); // Clear any previous error state
            } else {
                this.byId(sContactId).setValueState("Error"); // Set error state
                this.byId(sContactId).setValueStateText(formatter.validatename(sContactName)[1]); // Error message
                check = false;
            }
            if (formatter.validateEmail(sContactEmail)[0]) {

                this.byId(sContactEmailId).setValueState("None"); // Clear any previous error state
            } else {
                this.byId(sContactEmailId).setValueState("Error"); // Set error state
                this.byId(sContactEmailId).setValueStateText(formatter.validateEmail(sContactEmail)[1]); // Error message
                check = false;
            }

            if (formatter.validatePhoneNumber(sContactPhone)[0]) {

                this.byId(sContactPhoneId).setValueState("None"); // Clear any previous error state
            } else {
                this.byId(sContactPhoneId).setValueState("Error"); // Set error state
                this.byId(sContactPhoneId).setValueStateText(formatter.validatePhoneNumber(sContactPhone)[1]); // Error message
                check = false;
            }
            if (!sProductId) {
                this.byId(inputAddProductId).setValueState("Error");
                this.byId(inputAddProductId).setValueStateText("Please enter the Product Id")
                check = false
            }
            if (sProductId) {
                var bProductExists = false
                var omodal = this.getOwnerComponent().getModel("productsModel");
                var odata = omodal.oData.Products
                bProductExists = odata.some(function (oProduct) {
                    return oProduct.product_id === sProductId; // Replace "ProductID" with the correct field name
                });
                if (bProductExists == false) {
                    this.byId(inputAddProductId).setValueState("Error");
                    this.byId(inputAddProductId).setValueStateText("Please enter the valid Product Id")
                    check = false
                }
                else {
                    this.byId(inputAddProductId).setValueState("None");
                    check = true
                }
            }
            return check
        },
        onConfirmAddSupplier: function () {
            // Get input values
            var sSupplierName = this.byId("inputAddSupplierName").getValue();
            var sContactName = this.byId("inputAddContactName").getValue();
            var sContactEmail = this.byId("inputAddContactEmail").getValue();
            var sContactPhone = this.byId("inputAddContactPhone").getValue();
            var sContactPhone = this.byId("inputAddContactPhone").getValue();
            var sProductId = this.byId("inputAddProductId").getValue()
            // Validate input fields (you would have a validation function like with products)
            // if (this.validate(sSupplierName, sContactName, sContactEmail, sContactPhone, "inputAddSupplierName", "inputAddContactName", "inputAddContactEmail", "inputAddContactPhone")) {
            // Create a new supplier object
            if (this.validate(sSupplierName, sContactName, sContactEmail, sContactPhone, sProductId, "inputAddSupplierName", "inputAddContactName", "inputAddContactEmail", "inputAddContactPhone", "inputAddProductId")) {
                var oNewSupplier = {
                    supplier_id: Date.now().toString(), // or generate a more complex ID
                    supplier_name: sSupplierName,
                    contact_name: sContactName,
                    contact_email: sContactEmail,
                    contact_phone: sContactPhone,
                    product_ids: sProductId
                };

                // Add new supplier to the model
                var oModel = this.getView().getModel("suppliersModel");
                var aSuppliers = oModel.getProperty("/Suppliers");
                aSuppliers.push(oNewSupplier);
                oModel.setProperty("/Suppliers", aSuppliers);

                // Close dialog and show success message
                this.byId("addSupplierDialog").close();
                MessageToast.show("Supplier added successfully.");
                //  }
            }
        },
        onCancelAddSupplier: function () {
            // Close the dialog
            this.byId("addSupplierDialog").close();
        },
        onEditSupplier: function (oEvent) {

            // var oButton = oEvent.getSource();
            //var oContext = oButton.getBindingContext("suppliersModel");
            //var sPath = oContext.getPath();
            // Get the selected item and bind the data to the edit dialog
            //var oItem = oEvent.getSource().getBindingContext("suppliersModel").getObject();
            // var oContext = oEvent.getSource().getBindingContext("suppliersModel");
            var oDialog = this.byId("editSupplierDialog")
            var oContext = oEvent.getSource().getBindingContext("suppliersModel");
            if (oContext) {
                oDialog.setBindingContext(oContext, "suppliersModel");
                oDialog.open();
            } else {
                console.error("Binding context not found!");
            }


            // Open the edit dialog and pre-fill the values

            this.byId("inputEditSupplierName").bindValue(oItem.supplier_name);
            this.byId("inputEditContactName").bindValue(oItem.contact_name);
            this.byId("inputEditContactEmail").bindValue(oItem.contact_email);
            this.byId("inputEditContactPhone").bindValue(oItem.contact_phone);
            this.byId("inputEditProductId").bindValue(oItem.product_ids); // Added Pr
            /*
            this.byId("inputEditSupplierName").setValue(oItem.supplier_name);
            this.byId("inputEditContactName").setValue(oItem.contact_name);
            this.byId("inputEditContactEmail").setValue(oItem.contact_email);
            this.byId("inputEditContactPhone").setValue(oItem.contact_phone);
            this.byId("inputEditProductId").setValue(oItem.product_ids); // Added Product ID
*/
            oDialog.open();

        },
        onSaveEditSupplier: function (oEvent) {
            var oView = this.getView();
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("suppliersModel");
            var sPath = oContext.getPath();
            var oButton = oEvent.getSource();


            var oSupplierModel = this.getView().getModel("suppliersModel").getData();
            // Get the input values from the dialog
            var sSupplierName = this.byId("inputEditSupplierName").getValue();
            var sContactName = this.byId("inputEditContactName").getValue();
            var sContactEmail = this.byId("inputEditContactEmail").getValue();
            var sContactPhone = this.byId("inputEditContactPhone").getValue();
            var sProductId = this.byId("inputEditProductId").getValue();
            // Validate the input fields using your validation logic
            if (this.validate(sSupplierName, sContactName, sContactEmail, sContactPhone, sProductId, "inputEditSupplierName", "inputEditContactName", "inputEditContactEmail", "inputEditContactPhone", "inputEditProductId")) {

                // Update supplier details in the model

                // Close the dialog
                var oTable = this.byId("supplierTable");
                //  oTable.setBinding("items").oList = oSupplierModel.Suppliers
                oSupplierModel.supplier_name = sSupplierName;
                oSupplierModel.contact_phone = sContactPhone;
                oSupplierModel.contact_email = sContactEmail;
                var oView = this.getView();
                var oButton = oEvent.getSource();
                var oContext = oButton.getBindingContext("suppliersModel");
                var sPath = oContext.getPath();

                var oModel = oView.getModel("suppliersModel");


                // var oModel = this.getView().getModel("suppliersModel");
                //  var aSuppliers = oModel.getProperty("/Suppliers");
                //  oModel.setProperty("/Suppliers", oSupplierModel.Suppliers);

                // this.getView().getModel("suppliersModel").updateBindings(true);
                this.byId("editSupplierDialog").close();
                sap.m.MessageToast.show("Supplier details updated successfully.");
            }
        },
        onCancelEditSupplier: function () {
            // Close the dialog without making any changes
            this.byId("editSupplierDialog").close();
        },
        onMoreDetails: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("suppliersModel");
            var sSupplierId = oContext.getProperty("supplier_id");

            this.getOwnerComponent().getRouter().navTo("supplierDetails", {
                supplierId: sSupplierId
            });
        }
    });
});
