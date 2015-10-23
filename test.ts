var Jasmine = require('jasmine');
var jasminec = new Jasmine();
jasminec.loadConfigFile('spec/support/jasmine.json');
jasminec.execute();