define(function() {

    return function($el, options, api) {
        api.ui().onMarkDate(function(d, withShift, withCtrl) {
            api.select(d);
        });
        return api;
    }
});