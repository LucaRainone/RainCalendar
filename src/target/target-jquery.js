define(['RainCalendar'], function(rainCalendarExport) {
    jQuery && (
        jQuery.fn.rainCalendar = function(options) {
            return rainCalendarExport(this, options)
        }
    );
});
