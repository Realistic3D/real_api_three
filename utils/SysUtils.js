"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleSceneSize = ConsoleSceneSize;
exports.ConsoleSize = ConsoleSize;
exports.GetBin = GetBin;
function GetBin(buffer) {
  return new Blob([buffer], {
    type: 'application/octet-stream'
  });
}
async function blob2uint(blob) {
  return new Response(blob).arrayBuffer().then(buffer => {
    return [...new Uint8Array(buffer)];
  });
}
function save(blob, filename) {
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
function ConsoleSize(length) {
  const kbs = (length / 1024).toFixed(2);
  const size = `${kbs} KB`;
  console.log(size);
}
function ConsoleSceneSize(realScene) {
  ConsoleSize(realScene.byteLength);
}