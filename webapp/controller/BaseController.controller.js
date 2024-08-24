// controller/BaseController.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("project1.controller.BaseController", {

        onNavSelectBase: function (oEvent) {
            let oSelectedItem = oEvent.getParameter("item"); // get selected item from event
            let sKey = oSelectedItem.getKey(); // get key of the selected item
            let oRouter = UIComponent.getRouterFor(this); // get the router for this component
            oRouter.navTo(sKey); // navigate to the route
        }

    });

});
