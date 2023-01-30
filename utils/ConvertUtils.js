"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConvertStatus = void 0;
exports.SetRealScene = SetRealScene;
var _GLTFExporter = require("../../js/GLTFExporter.js");
var _SysUtils = require("./SysUtils.js");
const ConvertStatus = {
  FAILED: 0,
  SUCCESS: 1,
  ALREADY: 2,
  NOT_LOGGED: 3
};
exports.ConvertStatus = ConvertStatus;
async function SetRealScene(realAPI, scene, camera) {
  if (!realAPI.isLoggedIn) return ConvertStatus.NOT_LOGGED;
  if (realAPI.waiting) return ConvertStatus.ALREADY;
  await parseScene(realAPI, scene, camera);
}
async function parseScene(realAPI, scene, camera) {
  realAPI.waiting = true;
  const realName = camera.name;
  const oldParent = camera.parent;
  const isChild = oldParent === scene; // scene.children.includes(camera);

  if (!isChild) {
    scene.add(camera);
    camera.name = "RealEYE";
  }
  const exporter = new _GLTFExporter.GLTFExporter();
  const options = {
    binary: true
  };
  exporter.parse(scene, async realScene => {
    resetScene(oldParent, realName, scene, camera);
    await exportDone(realAPI, realScene);
  }, error => {
    resetScene(oldParent, realName, scene, camera);
    realAPI.waiting = false;
    exportError(error);
  }, options);
}
async function exportDone(realAPI, realScene) {
  const scene = (0, _SysUtils.GetBin)(realScene);
  const compScene = await (0, _SysUtils.Get7z)(scene);
  realAPI.jobInfo.scene = scene;
  // ConsoleSize(realScene);
}

function resetScene(oldParent, realName, scene, camera) {
  if (oldParent) oldParent.add(camera);else scene.remove(camera);
  camera.name = realName;
}
function exportError(error) {
  console.log('An error happened');
  console.error(error);
}