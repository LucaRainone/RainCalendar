define(['domEngine', 'helpers/utils'], function ($, utils) {

    var _listeners = {
        viewChange: [],
        markDate : []
    };

    var _callback = function(c, ui, args) {
        if(args === undefined) args = [];
        for(var i = 0; i < _listeners[c].length; i++) {
            _listeners[c][i].apply(ui,args);
        }
    };
    return {
        build: function (element, options, locale, api) {
            var format = options.fromDatesToHTML || function(d) {
                var datesString = [];
                for(var i = 0; i < d.length; i++) {
                    if(d[i].length === 1) {
                        datesString.push(utils.date2string(d[i][0]))
                    } else {
                        datesString.push(utils.date2string(d[i][0]) + " - " +utils.date2string(d[i][1]) )
                    }
                }
                return datesString.join("<br/>");
            };
            var ui = {};
            var $el = $(element);
            $el.empty();

            ui.onMarkDate = function(cbk) {
                _listeners.markDate.push(cbk);
            };

            ui.tagDatesAs = function (ranges, className) {

            };

            ui.onViewChange = function(cbk) {
                _listeners.viewChange.push(cbk);
            };

            api.onSetSelectedDates(function(dates) {
                $el.html(format(dates));
            });

            return ui;
        }
    }
});