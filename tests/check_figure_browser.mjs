// Run against a Chromium tab displaying /demo/pyodide/ with remote debugging
// enabled: node tests/check_figure_browser.mjs http://127.0.0.1:19223
import assert from "node:assert/strict";

const endpoint = process.argv[2] || "http://127.0.0.1:19223";
const pages = await (await fetch(`${endpoint}/json`)).json();
const page = pages.find((candidate) => candidate.type === "page" && candidate.url.includes("/demo/pyodide/"));
assert.ok(page, "Open the Pyodide guide in the browser first");
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  pending.get(message.id)?.(message);
});
function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 15000);
    pending.set(id, (message) => {
      clearTimeout(timeout);
      pending.delete(id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const distance = (a, b) => Math.hypot(...a.map((value, index) => value - b[index]));

try {
  await call("Page.reload", { ignoreCache: true });
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    await wait(1000);
    ready = await evaluate("document.querySelector('.pyodide-demo-3d .pyodide-demo-plot')?.dataset.renderer === 'three'");
    if (ready) break;
    const error = await evaluate("[...document.querySelectorAll('.pyodide-demo-status')].map(e => e.textContent).find(text => text.includes('could not'))");
    if (error) throw new Error(error);
  }
  assert.ok(ready, "The 3D renderer must load");
  const position = await evaluate(`(async () => {
    const demo = document.querySelector('.pyodide-demo-3d');
    const plot = demo.querySelector('.pyodide-demo-plot');
    if (plot.dataset.renderer !== 'three') throw new Error('Wait for the 3D figure to load');
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js');
    const originalLookAt = THREE.PerspectiveCamera.prototype.lookAt;
    const originalRender = PyodideDemo.render;
    window.__figureCheck = { frames: 0, canvas: plot.querySelector('canvas') };
    THREE.PerspectiveCamera.prototype.lookAt = function(...args) {
      __figureCheck.camera = this.position.toArray();
      return originalLookAt.apply(this, args);
    };
    PyodideDemo.render = function(element, output) {
      if (element === demo) {
        __figureCheck.endpoint = JSON.parse(output).objects.at(-1).points[0];
        __figureCheck.frames++;
      }
      return originalRender.call(this, element, output);
    };
    __figureCheck.restore = () => {
      THREE.PerspectiveCamera.prototype.lookAt = originalLookAt;
      PyodideDemo.render = originalRender;
    };
    demo.scrollIntoView({block:'center'});
    demo.querySelector('.rotation3d-reset').click();
    demo.querySelector('.rotation3d-play').click();
    const bounds = plot.getBoundingClientRect();
    return {x:bounds.x+bounds.width/2, y:bounds.y+bounds.height/2};
  })()`);
  await wait(200);
  const state = () => evaluate(`({camera:__figureCheck.camera, endpoint:__figureCheck.endpoint, frames:__figureCheck.frames})`);
  const before = await state();
  await call("Input.dispatchMouseEvent", { type: "mousePressed", ...position, button: "left", buttons: 1, clickCount: 1 });
  const during = [];
  for (let step = 1; step <= 10; step++) {
    await call("Input.dispatchMouseEvent", {
      type: "mouseMoved", x: position.x + step * 9, y: position.y + step * 4,
      button: "left", buttons: 1,
    });
    await wait(90);
    during.push(await state());
  }
  await call("Input.dispatchMouseEvent", {
    type: "mouseReleased", x: position.x + 90, y: position.y + 40,
    button: "left", buttons: 0, clickCount: 1,
  });
  const released = await state();
  await wait(500);
  const after = await state();
  assert.ok(distance(before.camera, during.at(-1).camera) > 0.1, "The camera must move during Play");
  assert.ok(distance(during[0].endpoint, during.at(-1).endpoint) > 0.1, "Geometry must animate throughout the drag");
  assert.ok(during.at(-1).frames - during[0].frames >= 5, "Rendering must continue during the drag");
  assert.ok(distance(released.camera, after.camera) < 1e-6, "The camera must not snap after release");
  assert.ok(distance(released.endpoint, after.endpoint) > 0.1, "Animation must continue after release");
  await call("Input.dispatchMouseEvent", {
    type: "mouseWheel", ...position, deltaX: 0, deltaY: -100,
  });
  await wait(150);
  const zoomed = await state();
  assert.ok(distance(after.camera, zoomed.camera) > 0.05, "Zoom must work during Play");
  await wait(250);
  assert.ok(distance(zoomed.camera, (await state()).camera) < 1e-6, "Zoom must persist through animation frames");
  const final = await evaluate(`(() => {
    const demo = document.querySelector('.pyodide-demo-3d');
    demo.querySelector('.rotation3d-play').click();
    return {sameCanvas:__figureCheck.canvas === demo.querySelector('canvas'), status:demo.querySelector('.pyodide-demo-status').textContent};
  })()`);
  assert.equal(final.sameCanvas, true, "The canvas must persist across animation frames");
  assert.ok(!final.status.includes("could not"), final.status);
  const surfaceWorks = await evaluate(`(async () => {
    const {createScene3D} = await import('/pyodide/scene3d.js');
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-1000px;width:300px;height:300px';
    document.body.append(container);
    const controller = createScene3D(container);
    try {
      const figure = {axes:{x:{range:[0,1]},y:{range:[0,1]},z:{range:[0,2]}},objects:[{
        type:'surface',x:[[0,1],[0,1]],y:[[0,0],[1,1]],z:[[0,1],[1,2]],colorscale:'Plasma'
      }]};
      controller.update(figure);
      const canvas = container.querySelector('canvas');
      figure.objects[0].z = [[1,0],[0,1]];
      controller.update(figure);
      return canvas === container.querySelector('canvas');
    } finally { controller.dispose(); container.remove(); }
  })()`);
  assert.ok(surfaceWorks, "Surface geometry must update within the persistent renderer");
  console.log("Passed: real drag and zoom during continuous animation; no camera snap; persistent canvas; surface updates.");
} finally {
  await evaluate(`(() => {
    const play = document.querySelector('.rotation3d-play');
    if (play?.textContent === 'Pause') play.click();
    window.__figureCheck?.restore();
  })()`).catch(() => {});
  socket.close();
}
