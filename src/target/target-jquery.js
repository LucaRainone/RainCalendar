define('target-jquery',['RainCalendar'], function(rainCalendarExport) {
    jQuery && (
        jQuery.fn.rainCalendar = function(options) {
            return rainCalendarExport.calenderize(this, options)
        }
    );
});
