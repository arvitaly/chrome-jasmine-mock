import {Tabs} from './../lib/Tabs';
import {Tab} from './../lib/Tab';
import {Chrome} from './../lib/Chrome';
describe("Chrome.tabs object", () => {
    var tabs: Tabs;
    var url = 'test';
    var tab: Tab;
    var chrome: Chrome;
    beforeEach((done) => {
        chrome = new Chrome;
        tabs = chrome.tabs;
        tabs.create({ url: url }, (tab_) => {
            tab = tab_;
            done();
        });
    });
    it("create", () => {
        expect(tabs.create.calls.count()).toBe(1);
        expect(tabs.create.calls.argsFor(0)[0].url).toBe(url);
        expect(tab instanceof Tab).toBeTruthy();
        expect(tabs['tabs'].length).toBe(1);
        expect(chrome.runtime.lastError).toBeUndefined();
    });
    
    it("setContentScript", (done) => {
        tabs.setContentScript((window) => {
            window['func1'] = function () {
                return 13;
            };
        });
        tabs.create({ url: url }, (tab) => {
            expect(tab.window['func1']()).toBe(13);
            done();
        });
    });
    it("create with error", (done) => {
        tabs.setContentScript(() => {
            console.log(window['asd']());
        });
        tabs.create({ url: url }, (tab) => {
            expect(tab).toBeUndefined();
            expect(chrome.runtime.lastError).toBeDefined();
            done();
        });
    });
    it("remove", (done) => {
        tabs.remove(tab.id, () => {
            expect(tabs['tabs'].length).toBe(0);
            expect(chrome.runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("get", (done) => {
        tabs.get(tab.id, (tab) => {
            expect(tab instanceof Tab).toBeTruthy();
            expect(chrome.runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("executeScript", (done) => {
        tabs.executeScript(tab.id, { code: "window.test=function(){ return 'test1'; }; window.test();" }, (results) => {
            expect(results[0]).toBe('test1');
            expect(chrome.runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("executeScript with function before", (done) => {
        tab.window['func1'] = (a) => {
            return a + 1;
        };
        tabs.executeScript(tab.id, { code: "window.func1(1)" }, (results) => {
            expect(results[0]).toBe(2);
            expect(chrome.runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("execute with error", (done) => {
        tabs.executeScript(tab.id, { code: "window.xxx()" }, (results) => {
            expect(results).toBeUndefined();
            expect(chrome.runtime.lastError).toBeDefined();
            done();
        });
    });
});