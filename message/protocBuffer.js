const app = getApp();

var adler = require("../utils/adler32.js")
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
    var checkSum = dataView.getInt32(dataView.byteLength - 4, true)
    //重新计算checksum
    var newCheckSum = adler.sum(new Uint8Array(data, 4, length - 4) /*data.slice(4, dataView.byteLength - 4)*/ , 1);
    console.log('收到服务器内容：' + ' ' + length + ' ' + hash + ' ' + nameLen + ' ' + nameArrer + ' ' + checkSum + ' ' + 　newCheckSum);
    var message = createMessage(nameArrer);
    var deMessage = message.decode(new Uint8Array(data, 9 + nameLen))
    console.log(deMessage);
    callBacks[nameArrer](deMessage);
};

function sendMessage(hash, name, message) {
    //hash 4 byte namelen 1byte name 需要加\0 checksum
    var messageLen = 4 + 1 + name.length + 　1 + message.length + 4;
    var buf = new ArrayBuffer(4 + messageLen);
    var dataView = new DataView(buf);
    //总长度
    dataView.setInt32(0, messageLen, false);
    //目的地
    dataView.setInt32(4, hash, false);
    //消息名长度
    dataView.setInt8(8, name.length + 1);
    //添加消息名字
    for (var i = 0; i < name.length; i++) {
        dataView.setUint8(9 + i, name.charCodeAt(i));
    }
    //消息名字以\0结束
    dataView.setUint8(9 + name.length, 0);
    //设置消息体
    for (var i = 0; i < message.length; i++) {
        dataView.setUint8(10 + name.length + i, message[i]);
    }
    //计算checksum
    var checkSum = adler.sum(new Uint8Array(buf, 4, messageLen - 4) /*data.slice(4, dataView.byteLength - 4)*/ , 1);
    console.log('checksum' + "    " + checkSum)
    dataView.setUint32(messageLen, checkSum, false)
    console.log(new Uint8Array(buf).length)
    wx.sendSocketMessage({
        data: buf,
        success: function (e) {
            console.log(e)
        },
        fail: function (e) {
            console.log(e)
        },
        complete: function (e) {
            console.log(e)
        }
    })
}

module.exports.setCallBack = setCallBack
module.exports.createMessage = createMessage
module.exports.receiveMessage = receiveMessage
module.exports.sendMessage = sendMessage