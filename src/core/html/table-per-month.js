define(["domEngine"], function ($) {

    return function (m, Y, options, locale) {

        options = {
            className         : options.className || "rain_calendar",
            weekStart         : options.weekStart || 0,
            visibleBoundsDays : options.visibleBoundsDays || false,
            interactive : options.interactive
        };

        var $table           = $('<table/>').addClass(options.className),
            $thead           = $('<thead/>'),
            $tbody           = $('<tbody/>'),
            initDay          = new Date(Y, m, 1, 12),
            lastDay          = (new Date(Y, m + 1, 0, 12)).getDate(),
            lastDayPrevMonth = (new Date(Y, m, 0, 12)).getDate(),
            now              = new Date();

        var lang = locale;


        m = initDay.getMonth();
        Y = initDay.getFullYear();
        $table.attr("data-month-year", m + "-" + Y);
        $table.attr('unselectable', 'on');

        if(options.interactive) {
            $table.addClass("interactive");
        }

        var $firstTr = $('<tr/>');


        $firstTr.append(  $('<th/>').append($('<span/>')).addClass('arrow-left'));

        $firstTr.append(
            $('<th/>').html(lang.months[m] + " " + Y)
            .attr("colspan", 5)
        );

        $firstTr.append($('<th/>').append($('<span/>')).addClass('arrow-right'));

        $thead.append($firstTr);

        var $tr, i;

        $tr = $('<tr/>');
        var dayIndex;
        for (i = 0; i < 7; i++) {
            dayIndex = (i + options.weekStart) % 7;
            $tr.append($('<th/>').html((lang.shortDays[dayIndex])).addClass("day-" + dayIndex));
        }


        $thead.append($tr);

        $table.append($thead);

        var firstDay  = initDay.getDay();
        $tr       = $('<tr/>');
        var count     = 0;
        var nPrevDays = (firstDay - options.weekStart + 7) % 7;
        for (i = 0; i < nPrevDays; i++) {
            count++;
            $tr.append($('<td/>').html((options.visibleBoundsDays ? +lastDayPrevMonth - nPrevDays + 1 + i : "")).addClass("prev-month"));
        }

        for (i = 1; i <= lastDay; i++) {
            if (count === 7) {
                $tbody.append($tr);
                $tr   = $tr.clone().empty();
                count = 0;
            }
            $tr.append($('<td/>').append($("<span/>").html(i)).attr("data-day", i).addClass("day-" + ((count + options.weekStart) % 7)));
            count++;
        }


        var daynextmonth = 1;
        for (i = count; i < 7; i++) {
            if (options.visibleBoundsDays) {
                $tr.append($('<td/>').html(daynextmonth++).addClass("next-month"));
            } else {
                $tr.append($('<td/>').addClass("next-month"));
            }
        }

        $tbody.append($tr);

        if (m === now.getMonth() && Y === now.getFullYear()) {
            $tbody.find("td[data-day='"+now.getDate()+"']").each(function () {
                $(this).addClass('today');
            });
        }

        var nrows = $tbody.find("tr").length;

        for (i = 0; i < 6 - nrows; i++) {
            $tr = $('<tr/>').addClass("emptyrow");
            for (var j = 0; j < 7; j++) {
                if (options.visibleBoundsDays) {
                    $tr.append($("<td/>").html(daynextmonth++).addClass("next-month"));
                } else {
                    $tr.append($("<td/>").addClass("next-month"));
                }
            }
            $tbody.append($tr);
        }

        return $table.append($tbody);
    }
});