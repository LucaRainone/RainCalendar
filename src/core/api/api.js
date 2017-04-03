define(['helpers/utils'], function(utils) {


    return function() {
        var selectedDates = [];
        var disabledDates = [];

        var _listeners = {
            clickDate : [],
            setSelectedDates: [],
            setDisabledDates: []
        };

        var _trigger = function(listeners, args, context) {
            for(var i = 0; i < listeners.length; i++) {
                listeners[i].apply(context, args);
            }
        };

        var _check = function(s1, s2) {
            if(utils.overlaps(s1, s2)) {
                throw "overlap detected";
            }
        };

        return {
            select : function (dateOrRanges) {
                var selection = utils.normalizeDates(dateOrRanges);
                _check(selection, disabledDates);
                selectedDates = selection;
                _trigger(_listeners.setSelectedDates,[selectedDates], this);
            },
            disable: function (dateOrRanges) {
                disabledDates = utils.normalizeDates(dateOrRanges);
                _trigger(_listeners.setDisabledDates,[disabledDates], this);
            },
            getSelectedDates: function() {
                return selectedDates;
            },
            getDisabledDates: function() {
                return disabledDates;
            },


            onSetSelectedDates : function(cbk) {
                _listeners.setSelectedDates.push(cbk);
            },
            onSetDisabledDates : function(cbk) {
                _listeners.setDisabledDates.push(cbk);
            },
            ui: function() {
                return this._ui;
            },
            setUI: function(ui) {
                this._ui = ui
            }
        }
    }

});