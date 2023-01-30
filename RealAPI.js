"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.users = exports.default = exports.dates = void 0;
function RealAPI(value) {
  return `HELLO ${value}`;
}
const dates = ["Feb", "Mar"];
exports.dates = dates;
const users = ["DANIEL", "ALIEN"];
exports.users = users;
var _default = RealAPI;
exports.default = _default;