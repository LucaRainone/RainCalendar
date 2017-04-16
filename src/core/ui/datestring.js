define(['domEngine', 'helpers/utils'], function ($, utils) {

    return {
        build: function (element, options, locale, api) {

            var format = options.fromDatesToHTML || function (d) {
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

            var ui        = {};
            var _callback = utils.buildEventsListener(['viewChange', 'markDate'], ui);

            var $el = $(element);
            $el.empty();

            ui.tagDatesAs = function (ranges, className) {

            };

            api.onSetSelectedDates(function(dates) {
                $el.html(format(dates));
            });

            return ui;
        }
    };
});