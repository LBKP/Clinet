// var MOD_ADLER = 65521

// function adler32(buf, length) {
//     var adler = 1;
//     var a = adler & 0xffff;
//     var b = (adler >> 16) & 0xffff;

//     var dataView = new DataView(buf)
//     console.log(a + '+'+b)
//     for (var index = 0; index < length; ++index) {
//         a = (a + dataView.getUint8(index)) % MOD_ADLER;
//         b = (b + a) % MOD_ADLER
//     }
//     return (b << 16) + a;
// }

"use strict";

/**
 * Largest prime smaller than 2^16 (65536)
 */

exports.sum = function (buf, seed) {
    var a = 1, b = 0, L = buf.length, M = 0;
    if (typeof seed === 'number') { a = seed & 0xFFFF; b = (seed >>> 16) & 0xFFFF; }
    for (var i = 0; i < L;) {
        M = Math.min(L - i, 3850) + i;
        for (; i < M; i++) {
            a += buf[i] & 0xFF;
            b += a;
        }
        a = (15 * (a >>> 16) + (a & 65535));
        b = (15 * (b >>> 16) + (b & 65535));
    }
    return ((b % 65521) << 16) | (a % 65521);
    // var dataView = buf/*new DataView(buf)*/
    // if (sum == null)
    //     sum = 1;

    // var a = sum & 0xFFFF,
    //     b = (sum >>> 16) & 0xFFFF,
    //     i = 0,
    //     max = dataView.byteLength,
    //     n, value;

    // while (i < max) {
    //     n = Math.min(NMAX, max - i);

    //     do {
    //         console.log(dataView[i]/*.getUint8(i)*/)
    //         a += dataView[i++]/*.getUint8(i++)*/ << 0;
    //         b += a;
    //     }
    //     while (--n);

    //     a %= BASE;
    //     b %= BASE;
    // }

    // return ((b << 16) | a) >>> 0;
};

exports.roll = function (sum, length, oldByte, newByte) {
    var a = sum & 0xFFFF,
        b = (sum >>> 16) & 0xFFFF;

    if (newByte != null) {
        a = (a - oldByte + newByte + BASE) % BASE;
        b = (b - ((length * oldByte) % BASE) + a - 1 + BASE) % BASE;
    }
    else {
        a = (a - oldByte + BASE) % BASE;
        b = (b - ((length * oldByte) % BASE) - 1 + BASE) % BASE;
    }

    return ((b << 16) | a) >>> 0;
};
