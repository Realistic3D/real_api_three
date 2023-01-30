"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RealProduct = exports.JobResult = void 0;
var _RealSocket = require("./tools/RealSocket.js");
class RealAPI {
  constructor(userName, appKey, appSecret, product, serverParams = {}) {
    this.appKey = appKey;
    this.product = product;
    this.userName = userName;
    this.appSecret = appSecret;
    this.serverParams = serverParams;
    this.jobInfo = {
      jobs: [],
      scene: null
    };
    this.waiting = false;
    this.connecting = false;
    this.isLoggedIn = false;
    this.__socket = null;
  }
  updateJobs(jobs) {
    if (!jobs || !jobs.length) return;
    const curJobs = this.jobInfo.jobs;
    const count = curJobs.length;
    const resultList = [];
    for (const job of jobs) {
      let flag = true;
      for (let i = 0; i < count; i++) {
        const curJob = curJobs[i];
        const jobID = curJob.jobID;
        if (job.jobID === jobID) {
          curJobs[i] = job;
          flag = false;
          break;
        }
      }
      if (flag) resultList.push(job);
    }
    for (const result of resultList) curJobs.push(result);
    this.jobInfo.jobs = curJobs;
  }
  downloadParams(jobID) {
    const prodCred = {
      appKey: this.appKey,
      userName: this.userName,
      appSecret: this.appSecret,
      prodKey: this.product.prodKey,
      insID: this.product.insID
    };
    return {
      data: {
        jobID: jobID,
        prodCred: prodCred
      }
    };
  }
  async login(callback, error) {
    if (this.__socket) {
      await this.__socket.connect();
      return;
    }
    this.__socket = new _RealSocket.RealSocket(callback, error, this);
    await this.__socket.connect();
  }
  async askService(type, data = null) {
    await this.__socket.ask(type, data);
  }
  getURI() {
    const params = this.serverParams;
    const port = params.port ? params.port : 8010;
    const server = params.server ? params.server : "localhost";
    return `${server}:${port}`;
  }
}
exports.default = RealAPI;
class JobResult {
  constructor(jobID) {
    this.jobID = jobID;
    this.status = "";
    this.result = "";
  }
}
exports.JobResult = JobResult;
class RealProduct {
  constructor(prodName, prodKey, insID) {
    this.insID = insID;
    this.prodKey = prodKey;
    this.prodName = prodName;
  }
}
exports.RealProduct = RealProduct;