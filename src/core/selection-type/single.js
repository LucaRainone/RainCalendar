define(function() {

    return function($el, options, api) {
        // simply, select the date choosed.
        api.ui().onMarkDate(function(d) {
            api.select(d);
        });
        return api;
    }
});