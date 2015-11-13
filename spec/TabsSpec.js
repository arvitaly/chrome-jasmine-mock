var Tab_1 = require('./../lib/Tab');
var Chrome_1 = require('./../lib/Chrome');
describe("Chrome.tabs object", function () {
    var tabs;
    var url = 'test';
    var tab;
    var chrome;
    beforeEach(function (done) {
        chrome = new Chrome_1.Chrome;
        tabs = chrome.tabs;
        tabs.create({ url: url }, function (tab_) {
            tab = tab_;
            done();
        });
    });
    it("create", function () {
        expect(tabs.create.calls.count()).toBe(1);
        expect(tabs.create.calls.argsFor(0)[0].url).toBe(url);
        expect(tab instanceof Tab_1.Tab).toBeTruthy();
        expect(tabs['tabs'].length).toBe(1);
        expect(chrome.runtime.lastError).toBeUndefined();
    });
    it("setContentScript", function (done) {
        tabs.setContentScript(function (window) {
            window['func1'] = function () {
                return 13;
            };
        });
        tabs.create({ url: url }, function (tab) {
            expect(tab.window['func1']()).toBe(13);
            done();
        });
    });
    it("create with error", function (done) {
        tabs.setContentScript(function () {
            console.log(window['asd']());
        });
        tabs.create({ url: url }, function (tab) {
            expect(tab).toBeUndefined();
            expect(chrome.runtime.lastError).toBeDefined();
            done();
        });
    });
    it("remove", function (done) {
        tabs.remove(tab.id, function () {
            expect(tabs['tabs'].length).toBe(0);
            expect(chrome.runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("get", function (done) {
        tabs.get(tab.id, function (tab) {
            expect(tab instanceof Tab_1.Tab).toBeTruthy();
            expect(chrome.runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("executeScript", function (done) {
        tabs.executeScript(tab.id, { code: "window.test=function(){ return 'test1'; }; window.test();" }, function (results) {
            expect(results[0]).toBe('test1');
            expect(chrome.runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("executeScript with function before", function (done) {
        tab.window['func1'] = function (a) {
            return a + 1;
        };
        tabs.executeScript(tab.id, { code: "window.func1(1)" }, function (results) {
            expect(results[0]).toBe(2);
            expect(chrome.runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("execute with error", function (done) {
        tabs.executeScript(tab.id, { code: "window.xxx()" }, function (results) {
            expect(results).toBeUndefined();
            expect(chrome.runtime.lastError).toBeDefined();
            done();
        });
    });
});
