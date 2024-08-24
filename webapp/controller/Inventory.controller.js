sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("project1.controller.Inventory", {

        onNavBack: function () {
            UIComponent.getRouterFor(this).navTo("home");
        }

    });
});
