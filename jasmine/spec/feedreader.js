/* eslint-env jasmine */

/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We"re placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don"t run until the DOM is ready.
 */
$(function() {
    /* tests the RSS feed definitions defined in the allFeeds variable. */
    describe("RSS Feeds", function() {
        /* tests that the allFeeds variable has been defined and contains valid input */
        it("are defined", function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* tests that all feed entries have an url property that is a non-empty string */
        it("have urls", function () {
            for (const feed of allFeeds) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
            }
        });

        /* tests that all feed entries have a name property that is a non-empty string */
        it("have names", function () {
            for (const feed of allFeeds) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
            }
        });
    });

    /* tests the slide menu */
    describe("The menu", function () {
        //establish reference to used elements. There is no need for any resets between tests
        //as we are simply reading contents
        const bodyElement = document.querySelector("body");
        const slideMenuElement = document.querySelector(".slide-menu");
        const menuIconLink = document.querySelector(".menu-icon-link");

        /* tests whether the slide menu is hidden by default, i.e. on initialization */
        it("is hidden by default", function () {
            //when the slide menu is hidden the body element contains the class value "menu-hidden"
            expect(bodyElement.classList).toContain("menu-hidden");
            //this is simply a demonstration of another approach to more rigourously test whether the
            //css works and the menu is indeed hidden (outside the viewport)
            expect(slideMenuElement.getBoundingClientRect().right).toBeLessThanOrEqual(0);
        });

        /* tests whether clicking the slide menu burger button toggles the slide menu */
        it("is toggled when it should", function () {
            //simulate click
            menuIconLink.click();
            //check if "menu-hidden" class has been removed from the body element by the click
            expect(bodyElement.classList).not.toContain("menu-hidden");
            
            //checking the element position will only work if transition is set to 0s - or a delay 
            //is introduced in some manner, hence not usedin this project
            //expect(slideMenuElement.getBoundingClientRect().right).not.toBeLessThanOrEqual(0);
            
            //simulate click
            menuIconLink.click();
            //check if "menu-hidden" class has been added to the body element by the click
            expect(bodyElement.classList).toContain("menu-hidden");

            //checking the element position will only work if transition is set to 0s - or a delay 
            //is introduced in some manner, hence not usedin this project
            //expect(slideMenuElement.getBoundingClientRect().right).toBeLessThanOrEqual(0);
        });         
    });

    /* tests that the feed loading code works as intended */
    describe("Intial Entries", function () {
        /* executes loadfeed with the first feed as argument and waits for it to complete before 
         * running tests
         */
        beforeEach(function (done) {
            loadFeed(0, function () {
                done();
            });
        }); 

        /* tests whether at least one entry element has been loaded to the feed container */
        it("exist after load", function (done) {
            expect(document.querySelectorAll(".feed .entry").length).not.toBe(0);
            done();
        });
    });

    /* tests that feed entries are correctly updated in the browser after a load  */
    describe("New Feed Selection", function () {
    
        const feedElement = document.querySelector(".feed");
        let initialFeedHtml;

        /* executes asynchronous calls and waits for them it to complete before
        * running tests
        */
        beforeEach(function (done) {
            //differentiate the test based on feed count.
            //We assume at least one feed, as we have tested for that in the RSS Feeds suite
            if(allFeeds.length > 1){
                //load first feed 
                loadFeed(0, function () {
                    //store contents
                    initialFeedHtml = feedElement.innerHTML;
                    //then load seconds feed
                    loadFeed(1, function() {
                        done();
                    });
                });
            }
            else{
                //clear first feed contents from the DOM
                while (feedElement.firstChild){
                    feedElement.removeChild(feedElement.firstChild);
                }
                initialFeedHtml = feedElement.innerHTML;
                //then load the first and only defined feed
                loadFeed(0, function () {
                    done();
                });
            }
        });

        /* tests whether executing a load results in correct population of entry elements in 
         * the feed of the DOM
         */
        it("loads new entries", function (done) {
            const currentFeedHtml = document.querySelector(".feed").innerHTML;
            expect(currentFeedHtml).not.toBe(initialFeedHtml);
            done();
        });
    });
}());
