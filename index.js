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
    this._hosts = new Set();
    this._exceptions = new Set();
  }

  add(hostname) {
    this._hosts.add(hostname);
  }

  addException(hostname) {
    this._exceptions.add(hostname);
  }

  has(hostname) {
    if (hostname === '')
      return false;

    if (looksLikeIPAddress(hostname)) {
      return this._hosts.has(hostname) &&
             (this._exceptions.size === 0 || !this._exceptions.has(hostname));
    }

    if (this._exceptions.size > 0 && this._exceptions.has('|' + hostname))
      return false;

    if (this._hosts.has('|' + hostname))
      return true;

    do {
      if (this._exceptions.size > 0 && this._exceptions.has(hostname))
        return false;

      if (this._hosts.has(hostname))
        return true;

      let dotIndex = hostname.indexOf('.');
      hostname = dotIndex === -1 ? '' : hostname.substr(dotIndex + 1);
    } while (hostname !== '');

    return false;
  }

  clear() {
    this._hosts.clear();
    this._exceptions.clear();
  }
};
