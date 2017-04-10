define(["helpers/utils"], function (utils) {

    describe("utils", function () {

        it("utils should be an object", function () {
            //demonstrates use of custom matcher
            expect(utils).toBeDefined()
        });


        describe("check if utils.isArray is working properly", function () {
            it("utils.isArray check array",function() {
                expect(utils.isArray([1, 2, 3])).toBeTruthy();
                expect(utils.isArray([])).toBeTruthy();
            });

            it("utils.isArray fails on object",function() {
                expect(utils.isArray({})).toBeFalsy();
                expect(utils.isArray({a : 1, b : 2})).toBeFalsy();

            });

            it("utils.isArray fails on object with length property", function() {
                expect(utils.isArray({ a : 1, length : function () {}})).toBeFalsy();
            });

            it("utils.isArray fails on variuos other thing", function() {
                expect(utils.isArray(null)).toBeFalsy();
                expect(utils.isArray(new Date())).toBeFalsy();
            });


        });

        describe("utils.date2string is working properly", function () {
            it("check simple date", function() {
                expect(utils.date2string(new Date(2016, 3, 10))).toEqual("2016-04-10");
            });
            it("check first and last date of the year", function() {
                expect(utils.date2string(new Date(2017, 0, 1))).toEqual("2017-01-01");
                expect(utils.date2string(new Date(2017, 11, 31))).toEqual("2017-12-31");
            });


        });

        it("utils.extend is working properly", function () {
            var obj        = {
                a : 3,
                c : false,
                d : 1
            };
            var mainObject = utils.extend(
                {
                    a : 1,
                    b : 2,
                    c : null,
                    d : false
                }, obj);

            expect(mainObject.b).toEqual(2);
            expect(mainObject.a).toEqual(3);
            expect(mainObject.c).toEqual(false);
            expect(mainObject.d).toEqual(1);
            expect(obj.a).toEqual(3);
        });

        describe("utils.getDateAddingDay is working properly", function () {
            var refDate    = new Date(2018, 0, 1);

            afterEach(function() {
                // original date is not toucher
                expect(refDate.getDate()).toEqual(1);
                expect(refDate.getMonth()).toEqual(0);
                expect(refDate.getFullYear()).toEqual(2018);
            });


            it("add one day", function() {
                var resultDate = utils.getDateAddingDays(refDate, 1);
                expect(resultDate.getDate()).toEqual(2);
                expect(resultDate.getMonth()).toEqual(0);
                expect(resultDate.getFullYear()).toEqual(2018);
            });
            it("add one day", function() {
                var resultDate = utils.getDateAddingDays(refDate, 1);
                expect(resultDate.getDate()).toEqual(2);
                expect(resultDate.getMonth()).toEqual(0);
                expect(resultDate.getFullYear()).toEqual(2018);

            });
            it("subtract one day", function() {

                var resultDate = utils.getDateAddingDays(refDate, -1);
                expect(resultDate.getDate()).toEqual(31);
                expect(resultDate.getMonth()).toEqual(11);
                expect(resultDate.getFullYear()).toEqual(2017);
            });
        });

        describe("utils.splitRange is working properly", function () {
            var range         = [new Date(2018, 0, 1), new Date(2018, 4, 14)];


            // range must not change
            afterEach(function() {
                expect(JSON.stringify(range)).toEqual(JSON.stringify([new Date(2018, 0, 1), new Date(2018, 4, 14)]));
            });
            var splittedRange;
            it("split simple range", function() {
                splittedRange = utils.splitRange(range, new Date(2018, 1, 28));
                expect(splittedRange.length).toEqual(2);
                expect(utils.date2string(splittedRange[0][0])).toEqual("2018-01-01");
                expect(utils.date2string(splittedRange[0][1])).toEqual("2018-02-27");
                expect(utils.date2string(splittedRange[1][0])).toEqual("2018-03-01");
                expect(utils.date2string(splittedRange[1][1])).toEqual("2018-05-14");
            });

            it("left split",function() {
                splittedRange = utils.splitRange(range, new Date(2018, 0, 1));

                expect(utils.date2string(splittedRange[1][0])).toEqual("2018-01-02");
                expect(utils.date2string(splittedRange[1][1])).toEqual("2018-05-14");
                expect(splittedRange[0]).toBeNull();
            });

            it("right split", function() {
                splittedRange = utils.splitRange(range, new Date(2018, 4, 14));

                expect(utils.date2string(splittedRange[0][0])).toEqual("2018-01-01");
                expect(utils.date2string(splittedRange[0][1])).toEqual("2018-05-13");
                expect(splittedRange[1]).toBeNull();
            });


            it("external split", function() {
                splittedRange = utils.splitRange(range, new Date(2018, 8, 14));

                expect(splittedRange[0]).toBeNull();
                expect(splittedRange[1]).toBeNull();
            });


        });

        describe("utils.overlaps is working properly", function () {
            var d1 = new Date(2018, 3, 10);
            var d2 = new Date(2018, 3, 20);
            var r1 = new Date(2018, 3, 15);
            var r2 = new Date(2018, 3, 25);

            afterEach(function() {
                expect(d1.getDate()).toEqual(10);
                expect(d2.getDate()).toEqual(20);
                expect(r1.getDate()).toEqual(15);
                expect(r2.getDate()).toEqual(25);
            });

            it("Simple overlap with date objects", function() {
                expect(utils.overlaps([[d1, d2]], [[r1, r2]])).toBeTruthy();
            });

            it("Simple overlap with date strings", function() {
                expect(utils.overlaps([['2018-04-10', '2018-04-20']], [['2018-04-15', '2018-04-25']])).toBeTruthy();
            });
            it("Simple overlap with mixed type ", function() {
                expect(utils.overlaps([['2018-04-10', d2]], [['2018-04-15', '2018-04-25']])).toBeTruthy();
            });
            it("Extreme right overlap ", function() {
                expect(utils.overlaps([['2018-04-10', '2018-04-20']], [['2018-04-20', '2018-04-25']])).toBeTruthy();
            });
            it("not overlapping", function() {
                expect(utils.overlaps([['2018-04-10', '2018-04-20']], [['2018-04-21', '2018-04-25']])).toBeFalsy();
                expect(utils.overlaps([['2018-04-10', '2018-04-20']], [['2018-04-25', '2018-04-25']])).toBeFalsy();
            });

            it("not overlapping simple dates", function() {
                expect(utils.overlaps(['2018-04-10', '2018-04-20'], ['2018-04-25', '2018-04-25'])).toBeFalsy();
            });
            it("overlapping simple dates", function() {
                expect(utils.overlaps(['2018-04-10', '2018-04-20'], ['2018-04-20', '2018-04-25'])).toBeTruthy();
            });

            it("overlapping simple dates 2", function() {
                expect(utils.overlaps(['2018-04-10', '2018-04-20'], ['2018-04-10', '2018-04-30'])).toBeTruthy();
            });

        });

        describe("utils.functionize is working properly", function() {
            it("scalar value", function() {
                var func = utils.functionize(3);
                expect(func()).toBe(3);
            });

            it("object value", function() {
                var obj = {a:1, b:2}
                var func = utils.functionize(obj);
                expect(func()).toBe(obj);
            });

        });


    });

});
