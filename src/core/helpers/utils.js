define(function() {

    var pad0 = function(n) {
        return n < 10 ? "0"+n : n+"";
    };

    var _overlapRange = function(r1,r2) {
        var d1,d2,d3,d4;
        d1 = this.date2string(r1[0]);
        d2 = this.date2string(r1[1]);
        d3 = this.date2string(r2[0]);
        d4 = this.date2string(r2[1]);
        return (d1 <= d4 && d3 <= d2);
    };

    return {
        isArray: function(a) {
            return Object.prototype.toString.call( a ) === '[object Array]'
        },
        date2string : function(d) {
            return d.getFullYear()+"-"+pad0((d.getMonth()+1)) + "-" + pad0(d.getDate());
        },
        extend : function(obj1, obj2) {
            for(var i in obj2) {
                obj1[i]= obj2[i];
            }
            return obj1;
        },
        getDateAddingDays: function(d, days) {
            var n = new Date(d);
            n.setDate(n.getDate()+ (+days));
            return n;
        },
        splitRange: function(range, d) {
            var begin = new Date(range[0]);
            var end   = new Date(range[1]);
            var point = this.date2string(d);
            if (point > this.date2string(end) || point < this.date2string(begin)) {
                return [null,null];
            }
            var mid1 = this.getDateAddingDays(d, -1);
            var mid2 = this.getDateAddingDays(d, 1);

            return [+mid1 > +begin ? [begin, mid1] : null, mid2 < end ? [mid2, end] : null];

        },

        overlaps : function(dateOrRange1, dateOrRange2) {
            var i,j, c1, c2;
            dateOrRange1 = this.normalizeDates(dateOrRange1);
            dateOrRange2 = this.normalizeDates(dateOrRange2);
            for( i = 0; i < dateOrRange1.length; i++) {
                if(dateOrRange1[i] instanceof Date) {
                    c1 = [dateOrRange1[i], dateOrRange1[i]];
                }else {
                    c1 = dateOrRange1[i].length === 1 ? [dateOrRange1[i][0], dateOrRange1[i][0]] : dateOrRange1[i];
                }
                for(j=0; j < dateOrRange2.length; j++) {
                    if(dateOrRange2[j] instanceof Date) {
                        c2 = [dateOrRange2[j],dateOrRange2[j]];
                    }else {
                        c2 = dateOrRange2[j].length === 1 ? [dateOrRange2[j][0], dateOrRange2[j][0]] : dateOrRange2[j];
                    }
                    if(_overlapRange.apply(this, [c1,c2])) {
                        return true;
                    }
                }
            }
            return false;
        },
        normalizeDate  : function (inpt) {
            var returnDate, d;
            if(arguments.length === 3) {
                returnDate = new Date(arguments[0], arguments[1], arguments[2]);
            }else if (inpt instanceof Date) {

                returnDate = new Date(+inpt);

            } else if (typeof inpt === "string") {

                switch (inpt) {
                    case "now":
                    case "today" :
                        returnDate = new Date();
                        break;
                    case "yesterday" :
                        d = new Date();
                        d.setDate(d.getDate() - 1);
                        returnDate = d;
                        break;
                    case "tomorrow" :
                        d = new Date();
                        d.setDate(d.getDate() + 1);
                        returnDate = d;
                        break;
                    case "--" :
                    case "a long time ago" :
                        returnDate = new Date(0, 0, 1);
                        break;
                    case "++" :
                    case "future" :
                        returnDate = new Date((new Date()).getFullYear() + 4000, 11, 31);
                        break;
                    default :
                        var parts = inpt.split("-");
                        if(parts.length === 3) {
                            returnDate = new Date();
                            returnDate.setDate(parts[2]);
                            returnDate.setMonth(+parts[1]-1);
                            returnDate.setFullYear(parts[0]);
                        }

                }
            }

            returnDate.setHours(15);
            returnDate.setMinutes(0);
            returnDate.setSeconds(0);
            return returnDate;
        },
        normalizeDates : function (dates) {
            var i,j;
            var ret = [];
            if (this.isArray(dates)) {
                for (i = 0; i < dates.length; i++) {
                    if (!this.isArray(dates[i])) {
                        ret[i] =  [this.normalizeDate(dates[i])];
                    }else {
                        ret[i] = [];
                        for (j = 0; j < dates[i].length; j++) {
                            ret[i][j] = this.normalizeDate(dates[i][j]);
                            if(j === 1 && this.date2string(ret[i][0]) > this.date2string(ret[i][j])) {
                                throw "inverted ranges";
                            }
                        }
                    }

                }
            } else {
                ret = [[this.normalizeDate(dates)]];
            }
            return ret;
        },
        functionize : function(value) {
            if(typeof value !== "function") {
                var scalar = value;
                value = function() {
                    return scalar;
                }
            }
            return value;
        },
        ucfirst: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        buildEventsListener: function(eventsName, object) {
            var _listeners = {};
            var method;

            for(var i = 0; i < eventsName.length; i++) {
                _listeners[eventsName[i]] = [];
                method = "on"+this.ucfirst(eventsName[i]);

                object[method] = (function(eventName) {
                    return function(cbk) {
                        _listeners[eventName].push(cbk);
                    }
                })(eventsName[i]);
            }

            var _callback = function (c, ui, args) {
                if (args === undefined) args = [];
                for (var i = 0; i < _listeners[c].length; i++) {
                    _listeners[c][i].apply(ui, args);
                }
            };


            return function(name, context, args) {
                if (args === undefined) args = [];
                for (var i = 0; i < _listeners[name].length; i++) {
                    _listeners[name][i].apply(context, args);
                }
            }

        }
    }
});