const app = getApp();

var util = require('../weichatPb/src/util.js');
var protobuf = require('../weichatPb/protobuf.js');
app.globalData._protobuf = protobuf;

var loginConfig = require('./Login.js');

var loginProtoc = protobuf.Root.fromJSON(loginConfig);

var clientNeedLogin_MSG = loginProtoc.lookupType('Login.ClientNeedLogin_LC');
