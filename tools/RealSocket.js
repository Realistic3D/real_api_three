"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetURI = GetURI;
exports.RealSocket = void 0;
var _RealDecoder = require("./RealDecoder.js");
var _UpdateUtils = require("../utils/UpdateUtils.js");
class RealSocket {
  constructor(callback, error, realAPI) {
    this.realAPI = realAPI;
    this.__url = GetURI(realAPI);
    this.__error = error;
    this.__callback = callback;
    // this.__timeOut = null;

    this.socket = null;
    this.instance = null;
    this.waiting = false;
    this.connected = false;
  }
  async connect() {
    if (this.connected || this.waiting) return;
    this.socket = new WebSocket(this.__url);
    this.init();
  }
  init() {
    this.socket.onopen = this.open.bind(this);
    this.socket.onerror = this.error.bind(this);
    this.socket.onclose = this.closed.bind(this);
    this.socket.onmessage = this.receive.bind(this);
  }
  async receive(event) {
    const evtData = event.data;
    await (0, _UpdateUtils.RealUpdater)(this, evtData);
    // await this.realUpdater(evtData)
  }

  async invoke(userResponse) {
    (await this.__callback) && this.__callback(userResponse, this.realAPI);
  }
  connectionEstablished() {
    this.waiting = false;
    this.connected = true;
    this.realAPI.connecting = false;
    this.realAPI.isLoggedIn = true;
    cancelAnimationFrame(this.instance);
  }
  waitForConnection() {
    setTimeout(async () => {
      //TODO: Timeout
      await this.ask(_RealDecoder.Status.Echo);
      // console.log("Connecting");
      this.instance = requestAnimationFrame(this.waitForConnection.bind(this));
    }, 5);
  }
  async ask(type, data = null) {
    const msg = {
      type: (0, _RealDecoder.EnumString)(type),
      data: data
    };
    const json = JSON.stringify(msg);
    this.socket.send(json);
  }
  open(event) {
    const that = this;
    that.waiting = true;
    that.connected = false;
    that.realAPI.isLoggedIn = false;
    // that.waitForConnection();
  }

  error(event) {
    this.__error && this.__error();
  }
  closed() {
    this.waiting = false;
    this.connected = false;
    this.realAPI.isLoggedIn = false;
  }
  close() {
    this.socket.close();
    this.closed();
  }
}
exports.RealSocket = RealSocket;
function GetURI(realApi) {
  const appKey = realApi.appKey;
  const product = realApi.product;
  const userName = realApi.userName;
  const appSecret = realApi.appSecret;
  const params = realApi.serverParams;
  const port = params.port ? params.port : 8001;
  const server = params.server ? params.server : "localhost";
  const serverUri = `wss://${server}:${port}/`;
  const userUri = `userName=${userName}&appKey=${appKey}&appSecret=${appSecret}`;
  const prodUri = `prodName=${product.prodName}&prodKey=${product.prodKey}&insID=${product.insID}`;
  return `${serverUri}login=${userUri}&${prodUri}`;
}