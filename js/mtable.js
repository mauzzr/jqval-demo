/*
 * File: mtable.js, created by Peter Welby 18 Oct. 2015
 * This script implements the single-page application functionality
 * which reads form input and synchronizes it with the location hash
 * to facilitate back/forward functionality, bookmarking and sharing
 * created tables, etc.
 */

"use strict";



/** Generate the table -- to be added as the submit handler for the form */
var generateTable = function(objInput) {
    var i, j,
        strContent = "",
        rStart, rEnd,
        cStart, cEnd;

    rStart = objInput.rStart;
    rEnd = objInput.rEnd;
    cStart = objInput.cStart;
    cEnd = objInput.cEnd;


    strContent += "<table>";


    // start at one less than the row and column start values to make a spot for the labels
    for (i = rStart - 1; i <= rEnd; i++) {
        strContent += "<tr>";

        // j goes between the cStart and cEnd values
        for (j = cStart - 1; j <= cEnd; j++) {
            // handle the printing of labels, and put nothing in the top-left corner
            if (i === rStart - 1) {
                if (j === cStart - 1) {
                    // top-left corner, so we need an empty cell
                    strContent += "<td class='indexLabel'>" + " " + "</td>";
                } else {
                    // first row, need to print column labels
                    strContent += "<td class='indexLabel'>" + j + "</td>";
                }
            } else if (j === cStart - 1) {
                strContent += "<td class='indexLabel'>" + i + "</td>";
            } else if (i === j) {
                // we're calculating a square, so highlight it
                strContent += "<td class='squareProduct'>" + (i * j) + "</td>";
            } else {
                strContent += "<td>" + (i * j) + "</td>";
            }

        }
        strContent += "</tr>";
    }

    strContent += "</table>";

    $("#tableArea").html(strContent);
};

/** Setup: wait for the document to load, then add the validate listener and run the
 *  search string parsing and table generation logic */
$(document).ready(function() {
    $("#mainForm").validate({
        rules: {
            rStart: { required: true, digits: true },
            rEnd: { required: true, digits: true },
            cStart: { required: true, digits: true },
            cEnd: { required: true, digits: true }
        }
    });
    // If we've got a search string, parse it
    if(location.search) {
        var i, inputVals = [], inputObj = {},
            searchSplit = location.search.substr(1).split("&");

        for (i = 0; i < searchSplit.length; i++) {
            inputVals.push(searchSplit[i].split("="));
        }

        for (i = 0; i < inputVals.length; i++) {
            inputObj[inputVals[i][0]] = parseInt(inputVals[i][1]);
        }

        // Get the current values into their respective input fields
        $("#rStart").val(inputObj.rStart);
        $("#rEnd").val(inputObj.rEnd);
        $("#cStart").val(inputObj.cStart);
        $("#cEnd").val(inputObj.cEnd);

        generateTable(inputObj);
    }
});






/** Validation function -- checks to make sure inputs are filled in and ordered correctly,
 *  i.e. "start" is smaller than "end". If all the inputs are valid, they end up in the
 *  inputVals array for the purposes of generating the multiplication table.*/
/*
var validate = function() {
    console.log("I got called!");
    var i,
        bFormIsValid = true;

    for (i = 0; i < 4; i++) {
        // check for blank fields
        if ($("#in" + (i + 1)).val() == "") {
            bFormIsValid = false;
            $("#in" + (i + 1)).css("background-color", "rgba(255, 0, 0, 0.5)");
            $("#message").text("Please fill out all fields before generating a table.");
        // check to make sure the Start of the range is not bigger than the End
        } else if ($("#in" + (i + 1)).attr("class") === "startInput" &&
                   $("#in" + (i + 2)).val() < $("#in" + (i + 1)).val()) {
            bFormIsValid = false;
            console.log(i + 1);
            console.log(i + 2);
            $("#in" + (i + 1)).css("background-color", "rgba(255, 0, 0, 0.5)");
            //$("#in" + (i + 2)).css("background-color", "rgba(255, 0, 0, 0.5)");
            $("#message").text("Cannot generate table -- Start cannot be greater than End");
        } else {
            $("#in" + (i + 1)).css("background-color", "#ffffff");
        }
    }
    if (bFormIsValid) {
        $("#message").text("");
    }
    return bFormIsValid;
};
*/
