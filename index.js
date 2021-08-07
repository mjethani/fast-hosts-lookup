/* Copyright (c) 2021 Manish Jethani */

'use strict';

function looksLikeIPAddress(hostname) {
  let firstCharCode = hostname.charCodeAt(0);
  return firstCharCode === 91 || // IPv6
         (firstCharCode >= 48 && firstCharCode <= 57 &&
          /^\d+\.\d+\.\d+\.\d+$/.test(hostname)); // IPv4
}

exports.FastHostsLookup = class FastHostsLookup {
  constructor() {
    this._set = new Set();
  }

  add(hostname) {
    this._set.add(hostname);
  }

  has(hostname) {
    if (hostname === '')
      return false;

    if (looksLikeIPAddress(hostname))
      return this._set.has(hostname);

    while (hostname !== '') {
      if (this._set.has(hostname))
        return true;

      let dotIndex = hostname.indexOf('.');
      hostname = dotIndex === -1 ? '' : hostname.substr(dotIndex + 1);
    }

    return false;
  }

  clear() {
    this._set.clear();
  }
};
