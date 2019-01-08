const app = getApp();

var util = require('../weichatPb/src/util.js');
var protobuf = require('../weichatPb/protobuf.js');
app.globalData._protobuf = protobuf;

var loginConfig = require('./Login.js');
var loginProtoc = protobuf.Root.fromJSON(loginConfig);

var callBacks = {}

function setCallBack(name, cb) {
    callBacks[name] = cb
}

function createMessage(name) {
    var message = loginProtoc.lookupType(name);
    return message;
};

function receiveMessage(data) {
    console.log(typeof(data));
    var dataView = new DataView(data);
    console.log(dataView.byteLength);
    //消息除了这个字段的总长度
    var length = dataView.getInt32(0, true);
    //从哪里收到的
    var hash = dataView.getInt32(4, true);
    //名字的长度
    var nameLen = dataView.getInt8(8);
    //消息名字不需要最后的\0
    var nameArrer = String.fromCharCode.apply(null, new Uint8Array(data, 9, nameLen - 1));
    //校验和,fixme
    var checkSum = dataView.getInt32(length, true)
    console.log('收到服务器内容：' + ' ' + length + ' ' + hash + ' ' + nameLen + ' ' + nameArrer + ' ' + checkSum);
    var message = createMessage(nameArrer);
    var deMessage = message.decode(new Uint8Array(data, 9 + nameLen))
    console.log(deMessage);
    callBacks[nameArrer](deMessage);
};

function sendMessage(hash, name, message)
{
    var buf = new ArrayBuffer(4 + 4 + 1 + name.length + 1 + message.length + 4);
    var dataView = new DataView(buf);
    dataView.setInt32(4,hash,true);
    dataView.setInt8(8, name.length+1);
    buf.push(new Uint8Array(name))
}

module.exports.setCallBack = setCallBack
module.exports.createMessage = createMessage
module.exports.receiveMessage = receiveMessage
module.exports.sendMessage = sendMessage