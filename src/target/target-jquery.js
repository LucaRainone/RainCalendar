define(['RainCalendar'], function(rainCalendarExport) {
    if(jQuery) {
        jQuery.fn.rainCalendar = function(options) {
            rainCalendarExport.calenderize(this, options)
        };
    }
});
