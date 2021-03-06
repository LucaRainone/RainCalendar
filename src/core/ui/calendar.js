define([ 'helpers/utils', 'html/table-per-month', 'domEngine'],
       function (utils, tableMonth, $) {

           var _see = function ($el, startDate, locale, options) {
               $el.empty();

               var cdate   = utils.normalizeDate(startDate);
               var nMonths = options.numberOfMonths();
               for (var i = 0; i < nMonths; i++) {
                   $el.append(tableMonth(cdate.getMonth(), cdate.getFullYear(), options, locale, i === 0, i === nMonths - 1));
                   cdate.setMonth(cdate.getMonth() + 1);
               }


               var $arrows = $el.find('.arrow-right');
               var len     = $arrows.length;
               var c       = 0;
               $el.find('.arrow-right').each(function () {
                   c++;
                   if (c !== len) {
                       $(this).removeClass("arrow-right");
                   }
               });
               c = 0;
               $el.find('.arrow-left').each(function () {
                   if (c !== 0) {
                       $(this).removeClass("arrow-left");
                   }
                   c++;
               });
           };

           var _addClassToDate = function ($el, d, className) {
               var $calendar = $el.find("[data-month-year='" + d.getMonth() + "-" + d.getFullYear() + "']");
               $calendar.find("td[data-day='" + d.getDate() + "']").addClass(className)
           };

           var _syncMonth    = function ($el, selectedDates, callbackDay, callbackMonth) {
                if(typeof selectedDates === "function") {
                    $el.find("[data-month-year]").each(function () {
                        var monthYear = $(this).attr("data-month-year").split("-");
                        $(this).find("td[data-day]").each(function () {
                            var cday = new Date(monthYear[1], monthYear[0], $(this).attr("data-day"));
                            if(selectedDates(cday)) {
                                callbackDay(cday);
                            }
                        })
                    });
                }else {
                    $el.find("table[data-month-year]").each(function () {

                        var monthYear = $(this).attr("data-month-year").split("-");
                        monthYear     = [+monthYear[0], +monthYear[1]];
                        for (var i = 0; i < selectedDates.length; i++) {
                            if (selectedDates[i].length === 1) {
                                if (selectedDates[i][0].getMonth() === monthYear[0] && selectedDates[i][0].getFullYear() === monthYear[1]) {

                                    callbackDay(selectedDates[i][0]);
                                }
                            } else if (selectedDates[i].length === 2) {
                                // range
                                var startDate = utils.date2string(selectedDates[i][0]);
                                var endDate   = utils.date2string(selectedDates[i][1]);

                                var firstDate = utils.date2string(utils.normalizeDate(monthYear[1], monthYear[0], 1));
                                var lastDate  = utils.normalizeDate(monthYear[1], monthYear[0], 1);
                                lastDate.setMonth(lastDate.getMonth() + 1);
                                lastDate.setDate(0);
                                lastDate = utils.date2string(lastDate);

                                if (lastDate >= startDate && firstDate <= endDate) {
                                    var currentDate = utils.normalizeDate(monthYear[1], monthYear[0], 1);
                                    if (callbackMonth && firstDate >= startDate && lastDate <= endDate) {
                                        // whole month
                                        callbackMonth(currentDate);
                                    } else {
                                        while (+monthYear[0] === +currentDate.getMonth()) {

                                            var cdate = utils.date2string(currentDate);
                                            if (cdate >= startDate && cdate <= endDate) {
                                                callbackDay(currentDate);
                                            }
                                            currentDate.setDate(currentDate.getDate() + 1);
                                        }
                                    }
                                }
                            }
                        }


                    });
                }
           };
           var _addClassToMonth = function($el, d, className) {

               var monthYear = d.getMonth()+"-"+d.getFullYear();
               $el.find("table[data-month-year='"+monthYear+"']").find("td[data-day]").each(function() {
                   $(this).addClass(className);
               })
           };

           var _syncSelected = function ($el, api) {
               var selectedDates = api.getSelectedDates();
               $el.find(".selected").removeClass("selected");
               $el.find(".selected-range-start").removeClass("selected-range-start");
               $el.find(".selected-range-end").removeClass("selected-range-end");

               _syncMonth($el, selectedDates, function (d) {
                   _addClassToDate($el, d, "selected");
               },function(d) {
                   _addClassToMonth($el, d, "selected");
               });
               for(var i = 0; i < selectedDates.length; i++) {
                   if(selectedDates[i].length === 2) {
                       _addClassToDate($el, selectedDates[i][0], "selected-range-start");
                       _addClassToDate($el, selectedDates[i][1], "selected-range-end");
                   }
               }

           };
           var _syncDisabled = function ($el, api) {
               var disabledDates = api.getDisabledDates();
               $el.find(".disabled").removeClass("disabled");
               _syncMonth($el, disabledDates, function (d) {
                   _addClassToDate($el, d, "disabled");
               },function(d) {
                   _addClassToMonth($el, d, "disabled");
               });
           };

           var _sync = function ($el, api) {
               _syncDisabled($el, api);
               _syncSelected($el, api);
           };

            var _setOption = function(options, option, value) {
                if(option === "numberOfMonths") {
                    value = utils.functionize(value);
                }
                options[option] = value;

            };


           return {
               build : function (element, options, locale, api) {
                   var ui =  {

                   };

                   options = utils.extend(
                       {
                           numberOfMonths : 1,
                           startDate      : new Date()
                       }
                       , options
                   );


                   var _callbacks  = utils.buildEventsListener(['viewChange', 'markDate'], ui);

                   var _redraw = function() {
                       _see($el, currentDate, locale, options);
                       _sync($el, api);

                       for(var className in taggedDays) {
                           $el.find("." + className).removeClass(className);
                           _syncMonth($el, taggedDays[className], function (d) {
                               _addClassToDate($el, d, className);
                           }, function (d) {
                               _addClassToMonth($el, d, className);
                           });
                       }
                       _callbacks('viewChange', ui);
                   };

                   var taggedDays = {};

                    _setOption(options, "numberOfMonths", options.numberOfMonths);

                   var $el = $(element);


                   var currentDate = utils.normalizeDate(options.startDate);
                   _see($el, currentDate, locale, options);


                   $el.on('click', '.arrow-right', function () {
                       currentDate.setMonth(currentDate.getMonth() + 1);
                       _redraw();

                   });

                   $el.on('click', '.arrow-left', function () {
                       currentDate.setMonth(currentDate.getMonth() - 1);
                       _redraw();
                   });

                   $el.on('click', 'td[data-day]:not(.disabled)', function (ev) {
                       ev.stopPropagation();
                       ev.preventDefault();
                       var $td       = $(this);
                       if($td.attr("class").split("disabled").length > 1) {
                           return false;
                       }
                       var day       = $td.attr("data-day");
                       var $table    = $td.parent().parent().parent();
                       var dataMonth = $table.attr("data-month-year").split("-");
                       var d         = utils.normalizeDate(dataMonth[1], dataMonth[0], day);
                       _callbacks('markDate', ui, [d, ev.shiftKey, ev.altKey]);
                   });

                   api.onSetSelectedDates(function () {
                       _syncSelected($el, api);
                   });

                   api.onSetDisabledDates(function () {
                       _syncDisabled($el, api);
                   });

                   ui.tagDatesAs = function (ranges, className) {
                       if(typeof ranges !== "function") {
                           ranges = utils.normalizeDates(ranges);
                       }
                       taggedDays[className] = ranges;
                       $el.find("." + className).removeClass(className);
                       _syncMonth($el, ranges, function (d) {
                           _addClassToDate($el, d, className);
                       },function(d) {
                           _addClassToMonth($el, d, className);
                       });
                   };


                   ui.redraw = function() {
                       _redraw();
                   };

                   ui.setOption = function(option, value) {
                       _setOption(options, option, value);
                   };

                   ui.showDate = function(date) {
                       currentDate = utils.normalizeDate(date);
                       _redraw();
                   };

                   ui.getViewRange = function() {
                       // clone it
                       var startDate = utils.normalizeDate(currentDate);
                       startDate.setDate(1);
                       var endDate = utils.normalizeDate(startDate);
                       var nMonth = options.numberOfMonths();
                       endDate.setMonth(endDate.getMonth()+nMonth);
                       return [startDate, endDate];
                   };

                   return ui;
               }
           };

       }
);