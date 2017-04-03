define(["helpers/utils"], function(utils) {

    function searchDate(d, selection) {
        var cDate = utils.date2string(d);
        for(var i = 0; i < selection.length; i++) {
            if(utils.date2string(selection[i]) === cDate) {
                return i;
            }
        }
        return -1;
    }

    function toggleDate(d, selection) {
        var index = searchDate(d,selection);
        if(index === -1) {
            selection.push(new Date(+d));
        }else {
            selection.splice(index,1);
        }
        return (index===-1)
    }

    function forceSelection(d, selection) {
        var index = searchDate(d,selection);
        if(index === -1) {
            selection.push(new Date(+d));
        }
        return (index===-1)
    }

    function forceUnselection(d, selection) {
        var index = searchDate(d,selection);
        if(index !== -1) {
            selection.splice(index,1);
        }
        return (index===-1)
    }

    return function($el, options, api) {
        var internalFlow = false;
        var weekStart  = options.weekStart || 0;
        var currentSelect = api.getSelectedDates();
        var lastClicked;

        api.ui().onMarkDate(function(d, withShift, withAlt) {
            var disabledDates = api.getDisabledDates();
            var cDate;
            if(withShift && lastClicked ) {
                var first = lastClicked;
                var range = first < d? [first, d] : [d,first];
                cDate = new Date(+range[0]);
                var isSelection = (searchDate(lastClicked, currentSelect)!==-1);
                var func = isSelection? forceSelection : forceUnselection;
                while(utils.date2string(cDate) <= utils.date2string(range[1])) {
                    if(!utils.overlaps(cDate, disabledDates)) {
                        func(cDate, currentSelect);
                    }
                    cDate.setDate(cDate.getDate() + 1);
                }
            }else if(withAlt && lastClicked ) {
                // TODO to fix considering weekStart
                var day1 = lastClicked;
                var range = day1 < d? [day1, d] : [d,day1];
                var days = (day1+weekStart)%6 < (d+weekStart)%6?  [d,day1] : [day1, d];
                var d1 =Math.min(days[0].getDay(),days[1].getDay());
                var d2 =Math.max(days[0].getDay(),days[1].getDay());

                cDate = new Date(+range[0]);
                var isSelection = (searchDate(lastClicked, currentSelect)!==-1);
                var func = isSelection? forceSelection : forceUnselection;
                while(utils.date2string(cDate) <= utils.date2string(range[1])) {
                    if((cDate.getDay() <= d2 && cDate.getDay() >=d1) && !utils.overlaps(cDate, disabledDates)) {
                        func(cDate, currentSelect);
                    }
                    cDate.setDate(cDate.getDate() + 1);
                }
            }else {
                toggleDate(d, currentSelect);
            }
            lastClicked = new Date(+d);
            try {
                internalFlow = true;
                api.select(currentSelect);
                internalFlow = false;
            }catch(e) {
                currentSelect.pop();
            }


        });
        api.onSetSelectedDates(function(d) {
            if(!internalFlow) {
                for(var i = 0; i < d.length; i++) {
                    if(d[i].length === 1) {
                        currentSelect.push(d[i][0])
                    }else {
                        throw "not valid selection";
                    }
                }
            }
        });
        return api;
    }
});