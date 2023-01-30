"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _RealDecoder = require("./RealDecoder.js");
class RealResponse {
  constructor(type = _RealDecoder.Status.None, msg = "", data = null) {
    this.msg = msg;
    this.data = data;
    this.type = type;
  }
}
exports.default = RealResponse;