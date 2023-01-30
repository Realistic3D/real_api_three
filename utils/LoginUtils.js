"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginRealAPI = LoginRealAPI;
exports.LoginStatus = void 0;
const LoginStatus = {
  JOB: 0,
  USER: 1,
  SUCCESS: 2,
  ALREADY: 3
};
exports.LoginStatus = LoginStatus;
async function LoginRealAPI(realAPI, callback, error) {
  if (realAPI.isLoggedIn) return LoginStatus.ALREADY;
  if (realAPI.connecting) return LoginStatus.JOB; // Should be after is login condition
  if (realAPI.__socket && realAPI.__socket.waiting) return LoginStatus.USER;
  await realAPI.login(callback, error);
  return LoginStatus.SUCCESS;
}