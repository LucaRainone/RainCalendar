define(
    'RainCalendar', [
        "api/api",
        "helpers/utils",
        "ui/datestring",
        "ui/calendar",
        "selection-type/single",
        "selection-type/range",
        "selection-type/multiple",
        "domEngine",
        "locale/it",
        "locale/en",
        "locale/de"
    ],
    function (
              apiFactory,
              utils,
              UIDatestring,
              UICalendar,
              typeSingle,
              typeRange,
              typeMultiple,
              $,
              langIt,
              langEn,
              langDe) {

        var locale = {
            it : langIt,
            en : langEn,
            de : langDe
        };

        var id        = 0;
        var instances = [];

        var UI = {
            STATIC_CALENDAR : 'static-calendar',
            DATE_STRING : 'date-string'
        };

        var SELECTION_TYPE = {
            SINGLE   : 'single',
            RANGE    : 'range',
            MULTIPLE : 'multiple'
        };

        var additionalUis = {}, additionalSelectionTypes = {};
        var rainCalendarExport =  {
            calenderize    : function (element, options) {
                options = utils.extend(
                    {
                        lang          : "en",
                        interactive   : true,
                        ui            : UI.STATIC_CALENDAR,
                        selectionType : SELECTION_TYPE.SINGLE,
                        disabledDates : []
                    }
                    , options
                );

                var $el = $(element);
                var subApi;
                var api = apiFactory($el, options);

                switch (options.ui) {
                    case UI.STATIC_CALENDAR :
                        api.setUI(UICalendar.build(element, options, locale[options.lang], api));
                        break;
                    case UI.DATE_STRING :
                        api.setUI(UIDatestring.build(element, options, locale[options.lang], api));
                        break;
                    default :
                        if(additionalUis[options.ui]) {
                            api.setUI(additionalUis[options.ui].build(element, options, locale[options.lang], api));
                        }else {
                            throw "no UI registered as '"+options.ui+"'";
                        }
                }

                switch (options.selectionType) {
                    case SELECTION_TYPE.SINGLE :
                        subApi = typeSingle($el, options, api);
                        break;
                    case SELECTION_TYPE.RANGE :
                        subApi = typeRange($el, options, api);
                        break;
                    case SELECTION_TYPE.MULTIPLE :
                        subApi = typeMultiple($el, options, api);
                        break;
                    default :

                }
                api.disable(options.disabledDates);

                $el.attr("data-raincalendar-id", ++id);
                instances.push(subApi);
                return subApi;
            },
            registerLocale     : function (code, obj) {
                locale[code] = obj;
            },
            registerUI: function(name, ui) {
                additionalUis[name] = ui;
            },
            registerSelectionType: function(name, selectionType) {
                additionalSelectionTypes[name] = selectionType;
            },
            getApi         : function (id) {
                return instances[id + 1];
            },
            UI             : UI,
            SELECTION_TYPE : SELECTION_TYPE
        };
        // if(jQuery && $ === jQuery) {
        //     $.fn.RainCalendar = function(options) {
        //         rainCalendarExport.calenderize(this, options)
        //     };
        // }
        return rainCalendarExport;
    }
);