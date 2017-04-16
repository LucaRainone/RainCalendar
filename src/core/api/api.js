define(['helpers/utils'], function(utils) {


    return function() {
        var selectedDates = [];
        var disabledDates = [];
        var api = {};

        var _trigger = utils.buildEventsListener(['clickDate', 'setSelectedDates', 'setDisabledDates'],api);


        var _check = function(s1, s2) {
            if(utils.overlaps(s1, s2)) {
                throw "overlap detected";
            }
        };

        return utils.extend(api, {
            select : function (dateOrRanges) {
                var selection = utils.normalizeDates(dateOrRanges);
                _check(selection, disabledDates);
                selectedDates = selection;
                _trigger('setSelectedDates', this);
            },
            disable: function (dateOrRanges) {
                disabledDates = utils.normalizeDates(dateOrRanges);
                _trigger('setDisabledDates', this);
            },
            getSelectedDates: function() {
                return selectedDates;
            },
            getDisabledDates: function() {
                return disabledDates;
            },

            ui: function() {
                return this._ui;
            },
            setUI: function(ui) {
                this._ui = ui
            }
        });
    }

});