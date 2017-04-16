define(["helpers/utils"], function (utils) {


    /**
     * compute a range of available and unavailable dates, depending of first date selected
     * and configured disabled dates.
     * @param d
     * @param disabledDates
     * @returns Object
     */
    var getUnavailableForRange = function (d, disabledDates) {

        // compute the vertex containing the date d
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

    /**
     * sync view
     * @param ui
     * @param currentDisabledForRange
     * @param currentEnabledForRange
     * @param currentRangeStart
     * @private
     */
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

        /*
         on markdate build the range. If it's the first mark, is the first vertex of the range.
         Find and disable temporarly all dates not selectable.
         */
        ui.onMarkDate(function (d) {

            if (selection.length === 0 || selection.length >= 2) {
                selection = [];
                selection.push(d);
                api.select([]);

                currentRangeStart = d;
                var rangesFlags = getUnavailableForRange(d, api.getDisabledDates());
                currentDisabledForRange = rangesFlags.no;
                currentEnabledForRange = rangesFlags.yes;
                _syncTags(ui, currentDisabledForRange, currentEnabledForRange, currentRangeStart);


            } else if (selection.length === 1) {
                if (selection[0] < d) {
                    selection.push(d);
                } else {
                    selection.unshift(d);
                }

                currentRangeStart = [];
                api.select([selection]);
                currentDisabledForRange  = [];
                currentEnabledForRange  = [];
                _syncTags(ui, currentDisabledForRange, currentEnabledForRange, currentRangeStart);
            }

        });

        // override the api.select method, preventing not allowed selection
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