sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
  "use strict";

  return Controller.extend("project1.controller.App", {
    onNavToProducts: function () {
      UIComponent.getRouterFor(this).navTo("products");//ui component is a class in sap core ui, it acts as a central class for congif routing and insilaizting the model,routes etc, like the brain of the application
      //this refers to the view the conroller is associaed with, and nav to product
    },
    onNavToSuppliers: function () {
      UIComponent.getRouterFor(this).navTo("suppliers");
    },
    onNavToInventory: function () {
      UIComponent.getRouterFor(this).navTo("inventory");
    }

  });
});
