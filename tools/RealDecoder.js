"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckResponseType = CheckResponseType;
exports.CheckType = CheckType;
exports.EnumString = EnumString;
exports.RealDeType = RealDeType;
exports.RealDecoder = RealDecoder;
exports.Status = exports.ResponseType = void 0;
const Status = {
  None: 0,
  Echo: 1,
  Jobs: 2,
  Login: 3,
  Logout: 4,
  NewJob: 5,
  Upload: 6,
  Result: 7,
  Export: 8,
  Occupied: 9,
  Download: 10,
  JobFailed: 11,
  NoRenderer: 12,
  LoginIssue: 13,
  DataFailed: 14,
  LoginFailed: 15,
  SceneFailed: 16
};
exports.Status = Status;
function EnumString(value, stringCase = 0) {
  // stringCase: 0 = lower, 1 = upper, 2 = normal
  for (let k in Status) if (Status[k] === value) {
    if (stringCase === 0) return k.toLowerCase();
    if (stringCase === 1) return k.toUpperCase();
    return k;
  }
  return "";
}
const ResponseType = {
  Code: 0,
  Binary: 1,
  Json: 2
};
exports.ResponseType = ResponseType;
function RealDeType(code) {
  switch (code) {
    case "echo":
      return Status.Echo;
    case "jobs":
      return Status.Jobs;
    case "result":
      return Status.Result;
    case "newjob":
      return Status.NewJob;
    case "upload":
      return Status.Upload;
    case "logged_in":
      return Status.Login;
    case "login_error":
      return Status.LoginIssue;
    case "login_failed":
      return Status.LoginFailed;
    default:
      return Status.None;
  }
}
function RealDecoder(code) {
  switch (code) {
    case 0:
      return Status.LoginIssue;
    case 1:
      return Status.LoginFailed;
    case 2:
      return Status.Login;
    case 3:
      return Status.DataFailed;
    case 4:
      return Status.Echo;
    case 5:
      return Status.NoRenderer;
    case 6:
      return Status.Occupied;
    default:
      return Status.None;
  }
}
function CheckType(response) {
  if (!isNaN(response)) return ResponseType.Code;
  return response.toString().startsWith("{") ? ResponseType.Json : ResponseType.Binary;
}
function CheckResponseType(response) {
  if (!isNaN(response)) return ResponseType.Code;
  return ResponseType.Json;
}