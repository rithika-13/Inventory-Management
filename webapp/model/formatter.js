sap.ui.define([], function () {
    "use strict";

    return {
        formatCurrency: function (value) {
            if (!value) {
                return "";
            }
            // Assuming your currency is USD. Change "USD" to your desired currency if different.
            var oCurrencyFormatter = new sap.ui.model.type.Currency({ showMeasure: true });
            return oCurrencyFormatter.formatValue([value, "INR"], "string");
        },
        quantityClass: function (iQuantity) {
            if (iQuantity > 10) {
                return "Success";
            } else {
                return "Error";
            }
        },

        imageVisibility: function (sImageUrl) {
            return !!sImageUrl;
        },
        validateEmail: function (sValue) {
            var sMessage = "";
            var bValid = true;

            // Check if the input is empty
            if (!sValue || sValue.trim().length === 0) {
                bValid = false;
                sMessage = "Email cannot be empty.";
            }
            // Check if the input is a valid email format
            else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(sValue)) {
                bValid = false;
                sMessage = "Invalid email format.";
            }
            // Check if the input contains special characters other than valid email characters
            else if (/[^a-zA-Z0-9@._%+-]/.test(sValue)) {
                bValid = false;
                sMessage = "Email contains invalid characters.";
            }

            return [bValid, sMessage];
        }
        ,
        validatePhoneNumber: function (sValue) {
            var sMessage = "";
            var bValid = true;

            // Check if the input is empty
            if (!sValue || sValue.trim().length === 0) {
                bValid = false;
                sMessage = "Phone number cannot be empty.";
            }
            // Check if the input is a valid phone number format (allowing numbers, optional +, -, and spaces)
            else if (!/^[+\d][\d\s-]{7,15}$/.test(sValue)) {
                bValid = false;
                sMessage = "Invalid phone number format.";
            }
            // Check if the input contains special characters that are not allowed
            else if (/[^+\d\s-]/.test(sValue)) {
                bValid = false;
                sMessage = "Phone number contains invalid characters.";
            }

            return [bValid, sMessage];
        }
        ,
        validateLabel: function (sValue) {
            // Example validation logic
            if (sValue && sValue.length > 0) {
                return true; // Valid
            } else {
                return false; // Invalid
            }
        },
        validatename: function (sValue) {
            var sMessage = "";
            var bValid = true;

            // Check if the input is empty
            if (!sValue || sValue.trim().length === 0) {
                bValid = false;
                sMessage = "Input cannot be empty.";
            }
            // Check if the input starts with a number
            else if (/^\d/.test(sValue)) {
                bValid = false;
                sMessage = "Input cannot start with a number.";
            }
            // Check if the input contains special characters (excluding spaces and numbers)


            return [bValid, sMessage]
        },


        validateQuantity: function (sValue) {
            var sMessage = "";
            var bValid = true;


            // Check if the input is empty
            if (!sValue) {
                bValid = false;
                sMessage = "Quantity cannot be empty.";
            }
            // Check if the input is a valid number

            // Check if the quantity is a positive number
            else if (sValue <= 0) {
                bValid = false;
                sMessage = "Quantity must be a greater than zero.";
            }
            // Optional: Check if the quantity is within a specific range
            else if (sValue > 10000) { // Example: max quantity is 10,000
                bValid = false;
                sMessage = "Quantity exceeds the maximum allowed limit.";
            }

            // Return validation result and message
            return [bValid, sMessage];
        },
        validatePrice: function (sValue) {

            var sMessage = "";
            var bValid = true;
            var fValue = parseFloat(sValue);

            // Check if the input is empty
            if (!sValue || sValue.trim().length === 0) {
                bValid = false;
                sMessage = "Price cannot be empty.";
            }
            // Check if the input is a valid number
            else if (isNaN(fValue)) {
                bValid = false;
                sMessage = "Price must be a number.";
            }
            // Check if the price is a non-negative number
            else if (fValue < 0) {
                bValid = false;
                sMessage = "Price must be a non-negative number.";
            }
            // Optional: Check if the price is within a specific range
            else if (fValue > 100000) { // Example: max price is 100,000
                bValid = false;
                sMessage = "Price exceeds the maximum allowed limit.";
            }

            // Return validation result and message
            return [bValid, sMessage];
        },


    };

});
