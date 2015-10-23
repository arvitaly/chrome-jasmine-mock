import {Tabs} from './../lib/Tabs';
import {Tab} from './../lib/Tab';
import {Runtime} from './../lib/Runtime';
describe("Chrome.tabs object", () => {
    var tabs: Tabs;
    var url = 'test';
    var tab: Tab;
    var runtime: Runtime;
    beforeEach((done) => {
        runtime = new Runtime;
        tabs = new Tabs(runtime);
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
        expect(runtime.lastError).toBeUndefined();
    });
    it("remove", (done) => {
        tabs.remove(tab.id, () => {
            expect(tabs['tabs'].length).toBe(0);
            expect(runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("get", (done) => {
        tabs.get(tab.id, (tab) => {
            expect(tab instanceof Tab).toBeTruthy();
            expect(runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("executeScript", (done) => {
        tabs.executeScript(tab.id, { code: "window.test=function(){ return 'test1'; }; window.test();" }, (results) => {
            expect(results[0]).toBe('test1');
            expect(runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("executeScript with function before", (done) => {
        tab.window['func1'] = (a) => {
            return a + 1;
        };
        tabs.executeScript(tab.id, { code: "window.func1(1)" }, (results) => {
            expect(results[0]).toBe(2);
            expect(runtime.lastError).toBeUndefined();
            done();
        });
    });
    it("execute with error", (done) => {
        tabs.executeScript(tab.id, { code: "window.xxx()" }, (results) => {
            expect(results).toBeUndefined();
            expect(runtime.lastError).toBeDefined();
            done();
        });
    });
});