"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RealUpdater = RealUpdater;
var _RealDecoder = require("../tools/RealDecoder.js");
var _RealResponse = _interopRequireDefault(require("../tools/RealResponse.js"));
var _SysUtils = require("./SysUtils.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function RealUpdater(that, inData) {
  const userResponse = UserResponse(inData);
  const msg = userResponse.msg;
  const userData = userResponse.data;
  const type = userResponse.type;
  switch (type) {
    case _RealDecoder.Status.None:
      return;
    case _RealDecoder.Status.Login:
      that.realAPI.jobInfo = userData;
      that.waitForConnection();
      return;
    case _RealDecoder.Status.Upload:
      // if(msg !== "Success") {
      //     userResponse.type = Status.JobFailed;
      //     await that.invoke(userResponse);
      //     return;
      // }
      // const scene = that.realAPI.jobInfo.scene;
      // if(!scene) {
      //     userResponse.type = Status.SceneFailed;
      //     await that.invoke(userResponse);
      //     return;
      // }
      // that.realAPI.waiting = true;
      // that.socket.send(scene);
      // console.log("Sending bin");
      return;
    case _RealDecoder.Status.Echo:
      that.connectionEstablished();
      userResponse.type = _RealDecoder.Status.Login;
      userResponse.msg = "SUCCESS";
      break;
  }
  await that.invoke(userResponse);
}
function UserResponse(inData) {
  const resType = (0, _RealDecoder.CheckType)(inData);
  const userResponse = new _RealResponse.default();
  switch (resType) {
    case _RealDecoder.ResponseType.Code:
      const code = parseInt(inData);
      userResponse.type = (0, _RealDecoder.RealDecoder)(code);
      userResponse.msg = code;
      return userResponse;
    case _RealDecoder.ResponseType.Binary:
      // TODO: download
      userResponse.type = _RealDecoder.Status.Download;
      userResponse.msg = "SUCCESS";
      userResponse.data = (0, _SysUtils.GetBin)(inData);
      return userResponse;
    default:
      const jsonData = JSON.parse(inData);
      userResponse.msg = jsonData.msg;
      userResponse.type = ToStatus(jsonData.type);
      userResponse.data = jsonData.data;
      return userResponse;
  }
}
function ToStatus(type) {
  const resType = (0, _RealDecoder.CheckResponseType)(type);
  switch (resType) {
    case _RealDecoder.ResponseType.Code:
      return (0, _RealDecoder.RealDecoder)(parseInt(type));
    default:
      return (0, _RealDecoder.RealDeType)(type);
  }
}