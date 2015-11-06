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
    // Add a rule to check for end values being greater than or equal to the start values
    $.validator.addMethod("greaterEqual", function(value, element, param) {
        return !value || parseInt(value) >= parseInt($("#" + param).val());
    }, "The end value cannot be less than the start value.");

    // Add a rule to check for start and end values that are too far apart
    $.validator.addMethod("deltaRange", function(value, element, params) {
        var other = $("#" + params[0]),
            threshold = params[1];
        return !other.val() || Math.abs(parseInt(value) - parseInt(other.val())) <= threshold;
    }, "The start and end values cannot differ by more than {1}.");

    $("#mainForm").validate({
        rules: {
            rStart: { required: true, digits: true, deltaRange: ["rEnd", 25] },
            rEnd: { required: true, digits: true, greaterEqual: "rStart", deltaRange: ["rStart", 25] },
            cStart: { required: true, digits: true, deltaRange:  ["cEnd", 25] },
            cEnd: { required: true, digits: true, greaterEqual: "cStart", deltaRange: ["cStart", 25] }
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
