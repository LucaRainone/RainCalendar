define(["helpers/utils"], function (utils) {

    var getUnavailableForRange = function (d, disabledDates) {
        if (disabledDates.length === 0) return [];

        var min = 0, max = Number.MAX_VALUE, c;
        for (var i = 0, j; i < disabledDates.length; i++) {
            for (j = 0; j < disabledDates[i].length; j++) {
                c = disabledDates[i][j];
                if (c < d && c > min) {
                    min = +c;
                }
                if (c > d && c < max) {
                    max = +c;
                }
            }
        }

        var cStart      = new Date();
        var cEnd        = new Date();
        var unavailable = [];
        var available   = [];
        if (min !== 0) {
            cStart.setTime(min);
            unavailable.push(["--", cStart]);
            if (utils.date2string(utils.getDateAddingDays(cStart, 1)) !== utils.date2string(d)) {
                available.push([utils.getDateAddingDays(cStart, 1), utils.getDateAddingDays(d, -1)]);
            }
        } else {
            available.push(["--", utils.getDateAddingDays(d, -1)]);
        }
        if (max !== Number.MAX_VALUE) {
            cEnd.setTime(max);
            unavailable.push([cEnd, "++"]);
            if (utils.date2string(utils.getDateAddingDays(cEnd, -1)) !== utils.date2string(d)) {
                available.push([utils.getDateAddingDays(d, 1), utils.getDateAddingDays(cEnd, -1)]);
            }
        } else {
            available.push([utils.getDateAddingDays(d, 1), "++"]);
        }

        return {yes : available, no : unavailable};
    };

    var _syncTags = function(ui, currentDisabledForRange,  currentEnabledForRange, currentRangeStart) {
        ui.tagDatesAs(currentDisabledForRange, "disabled-for-range");
        ui.tagDatesAs(currentEnabledForRange, "enable-for-range");
        ui.tagDatesAs(currentRangeStart, "rangestart");
    };

    return function ($el, options, api) {
        var selection = [];
        var ui        = api.ui();
        var currentDisabledForRange = [];
        var currentEnabledForRange = [];
        var currentRangeStart = [];
        ui.onMarkDate(function (d) {

            if (selection.length === 0 || selection.length >= 2) {
                selection = [];
                selection.push(d);
                api.select([]);

                currentRangeStart = d;
                var rangesFlags = getUnavailableForRange(d, api.getDisabledDates())
                currentDisabledForRange = rangesFlags.no;
                currentEnabledForRange = rangesFlags.yes;
                _syncTags(ui, currentDisabledForRange, currentEnabledForRange, currentRangeStart);


            } else if (selection.length === 1) {
                if (selection[0] < d) {
                    selection.push(d);
                } else {
                    selection.unshift(d);
                }
// TODO add class to table and manage one class only
                currentRangeStart = [];
                api.select([selection]);
                currentDisabledForRange  = [];
                currentEnabledForRange  = [];
                _syncTags(ui, currentDisabledForRange, currentEnabledForRange, currentRangeStart);
            }

        });

        var backupSelect = api.select;
        api.select = function (d) {
            if (!utils.isArray(d)) {
                throw "In range mode, the select method accept only array";
            }
            backupSelect(d);
        };
        return api;
    }
});