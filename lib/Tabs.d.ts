export interface TabsCreate extends jasmine.Spy {
    (props: chrome.tabs.CreateProperties): void;
}
export declare class Tabs {
    create: TabsCreate;
}
