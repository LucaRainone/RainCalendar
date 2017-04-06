describe("utils", function () {

    var requirejs = require('requirejs');
    requirejs.config({
                         nodeRequire : require,
                         baseUrl     : 'src/core',
                         paths : {
                             domEngine : '../domEngine/jquasi'
                         }
                     });


    var utils = requirejs('helpers/utils');
    var calendar = requirejs('ui/calendar');
console.log(calendar);
    it("utils should be an object", function () {
        //demonstrates use of custom matcher
        expect(utils).toBeDefined()
    });

    describe("check arrays", function () {
        it("should check right array", function () {
            expect(utils.isArray([1, 2, 3])).toBeTruthy();
            expect(utils.isArray([])).toBeTruthy();
            expect(utils.isArray({})).toBeFalsy();
            expect(utils.isArray(null)).toBeFalsy();
            expect(utils.isArray(new Date())).toBeFalsy();
            expect(utils.isArray({a:1, b:2})).toBeFalsy();
            expect(utils.isArray({a:1, length:function() {}})).toBeFalsy();
        });
    });

    // demonstrates use of spies to intercept and test method calls
    // it("tells the current song if the user has made it a favorite", function() {
    //     spyOn(song, 'persistFavoriteStatus');
    //
    //     player.play(song);
    //     player.makeFavorite();
    //
    //     expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
    // });
    //
    // //demonstrates use of expected exceptions
    // describe("#resume", function() {
    //     it("should throw an exception if song is already playing", function() {
    //         player.play(song);
    //
    //         expect(function() {
    //             player.resume();
    //         }).toThrowError("song is already playing");
    //     });
    // });
});
