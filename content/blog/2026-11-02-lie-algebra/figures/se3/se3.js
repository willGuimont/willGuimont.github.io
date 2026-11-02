(() => {
  const demo = document.currentScript.previousElementSibling;
  if (!demo?.classList.contains("pyodide-demo")) return;

  demo.querySelector(".pyodide-demo-controls").innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <strong>Translation t:</strong>
          <div class="control-row">
            <label for="se3-x" style="width: 80px; flex-shrink: 0;">x:</label>
            <span id="se3-x-val" class="num-val">+0.500</span>
            <input id="se3-x" type="range" min="-1.5" max="1.5" step="0.005" value="0.5" disabled style="flex-grow: 1;">
          </div>
          <div class="control-row">
            <label for="se3-y" style="width: 80px; flex-shrink: 0;">y:</label>
            <span id="se3-y-val" class="num-val">+0.800</span>
            <input id="se3-y" type="range" min="-1.5" max="1.5" step="0.005" value="0.8" disabled style="flex-grow: 1;">
          </div>
          <div class="control-row">
            <label for="se3-z" style="width: 80px; flex-shrink: 0;">z:</label>
            <span id="se3-z-val" class="num-val">+0.400</span>
            <input id="se3-z" type="range" min="-1.5" max="1.5" step="0.005" value="0.4" disabled style="flex-grow: 1;">
          </div>
        </div>
        <div>
          <strong>Rotation R (Euler):</strong>
          <div class="control-row">
            <label for="se3-roll" style="width: 80px; flex-shrink: 0;">Roll &phi;:</label>
            <span id="se3-roll-val" class="num-val">+0.200</span>
            <input id="se3-roll" type="range" min="-3.14" max="3.14" step="0.005" value="0.2" disabled style="flex-grow: 1;">
          </div>
          <div class="control-row">
            <label for="se3-pitch" style="width: 80px; flex-shrink: 0;">Pitch &theta;:</label>
            <span id="se3-pitch-val" class="num-val">+0.300</span>
            <input id="se3-pitch" type="range" min="-1.57" max="1.57" step="0.005" value="0.3" disabled style="flex-grow: 1;">
          </div>
          <div class="control-row">
            <label for="se3-yaw" style="width: 80px; flex-shrink: 0;">Yaw &psi;:</label>
            <span id="se3-yaw-val" class="num-val">+0.500</span>
            <input id="se3-yaw" type="range" min="-3.14" max="3.14" step="0.005" value="0.5" disabled style="flex-grow: 1;">
          </div>
        </div>
      </div>
      <div>
        <strong>Sensor Point p<sub>s</sub>:</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
          <div class="control-row">
            <label for="se3-px" style="width: 45px; flex-shrink: 0;">p<sub>x</sub>:</label>
            <span id="se3-px-val" class="num-val">+1.000</span>
            <input id="se3-px" type="range" min="-1.2" max="1.2" step="0.005" value="1.0" disabled style="flex-grow: 1;">
          </div>
          <div class="control-row">
            <label for="se3-py" style="width: 45px; flex-shrink: 0;">p<sub>y</sub>:</label>
            <span id="se3-py-val" class="num-val">+0.400</span>
            <input id="se3-py" type="range" min="-1.2" max="1.2" step="0.005" value="0.4" disabled style="flex-grow: 1;">
          </div>
          <div class="control-row">
            <label for="se3-pz" style="width: 45px; flex-shrink: 0;">p<sub>z</sub>:</label>
            <span id="se3-pz-val" class="num-val">+0.600</span>
            <input id="se3-pz" type="range" min="-1.2" max="1.2" step="0.005" value="0.6" disabled style="flex-grow: 1;">
          </div>
        </div>
      </div>
      <div>
        <strong>Target Landmark y:</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
          <div class="control-row">
            <label for="se3-yx" style="width: 45px; flex-shrink: 0;">y<sub>x</sub>:</label>
            <span id="se3-yx-val" class="num-val">+1.800</span>
            <input id="se3-yx" type="range" min="-2.2" max="2.2" step="0.005" value="1.8" disabled style="flex-grow: 1;">
          </div>
          <div class="control-row">
            <label for="se3-yy" style="width: 45px; flex-shrink: 0;">y<sub>y</sub>:</label>
            <span id="se3-yy-val" class="num-val">+1.500</span>
            <input id="se3-yy" type="range" min="-2.2" max="2.2" step="0.005" value="1.5" disabled style="flex-grow: 1;">
          </div>
          <div class="control-row">
            <label for="se3-yz" style="width: 45px; flex-shrink: 0;">y<sub>z</sub>:</label>
            <span id="se3-yz-val" class="num-val">+1.000</span>
            <input id="se3-yz" type="range" min="-2.2" max="2.2" step="0.005" value="1.0" disabled style="flex-grow: 1;">
          </div>
        </div>
      </div>
      <div class="lie-rotation-actions" style="margin-top: 4px;">
        <button id="se3-play" type="button" disabled>Play</button>
        <button id="se3-reset" type="button" disabled>Reset</button>
      </div>
      <div id="se3-readout" class="matrix-readout"></div>
    </div>`;

  const posX = demo.querySelector("#se3-x");
  const posY = demo.querySelector("#se3-y");
  const posZ = demo.querySelector("#se3-z");
  const roll = demo.querySelector("#se3-roll");
  const pitch = demo.querySelector("#se3-pitch");
  const yaw = demo.querySelector("#se3-yaw");
  const px = demo.querySelector("#se3-px");
  const py = demo.querySelector("#se3-py");
  const pz = demo.querySelector("#se3-pz");
  const yx = demo.querySelector("#se3-yx");
  const yy = demo.querySelector("#se3-yy");
  const yz = demo.querySelector("#se3-yz");

  const xVal = demo.querySelector("#se3-x-val");
  const yVal = demo.querySelector("#se3-y-val");
  const zVal = demo.querySelector("#se3-z-val");
  const rollVal = demo.querySelector("#se3-roll-val");
  const pitchVal = demo.querySelector("#se3-pitch-val");
  const yawVal = demo.querySelector("#se3-yaw-val");
  const pxVal = demo.querySelector("#se3-px-val");
  const pyVal = demo.querySelector("#se3-py-val");
  const pzVal = demo.querySelector("#se3-pz-val");
  const yxVal = demo.querySelector("#se3-yx-val");
  const yyVal = demo.querySelector("#se3-yy-val");
  const yzVal = demo.querySelector("#se3-yz-val");

  const play = demo.querySelector("#se3-play");
  const reset = demo.querySelector("#se3-reset");
  const readout = demo.querySelector("#se3-readout");

  let renderFunc;
  let frame = 0;
  let previousTime = 0;

  function fmt(num, width = 6, dec = 2) {
    const s = (num >= 0 ? "+" : "") + num.toFixed(dec);
    return s.padStart(width, " ");
  }

  function eulerToR(r, p, y) {
    const cr = Math.cos(r), sr = Math.sin(r);
    const cp = Math.cos(p), sp = Math.sin(p);
    const cy = Math.cos(y), sy = Math.sin(y);
    return [
      [cy*cp, cy*sp*sr - sy*cr, cy*sp*cr + sy*sr],
      [sy*cp, sy*sp*sr + cy*cr, sy*sp*cr - cy*sr],
      [-sp,   cp*sr,           cp*cr]
    ];
  }

  function draw() {
    const x = Number(posX.value);
    const y = Number(posY.value);
    const z = Number(posZ.value);
    const r = Number(roll.value);
    const p = Number(pitch.value);
    const yw = Number(yaw.value);
    const p_x = Number(px.value);
    const p_y = Number(py.value);
    const p_z = Number(pz.value);
    const y_x = Number(yx.value);
    const y_y = Number(yy.value);
    const y_z = Number(yz.value);

    xVal.textContent = `${x >= 0 ? "+" : ""}${x.toFixed(3)}`;
    yVal.textContent = `${y >= 0 ? "+" : ""}${y.toFixed(3)}`;
    zVal.textContent = `${z >= 0 ? "+" : ""}${z.toFixed(3)}`;
    rollVal.textContent = `${r >= 0 ? "+" : ""}${r.toFixed(3)}`;
    pitchVal.textContent = `${p >= 0 ? "+" : ""}${p.toFixed(3)}`;
    yawVal.textContent = `${yw >= 0 ? "+" : ""}${yw.toFixed(3)}`;
    pxVal.textContent = `${p_x >= 0 ? "+" : ""}${p_x.toFixed(3)}`;
    pyVal.textContent = `${p_y >= 0 ? "+" : ""}${p_y.toFixed(3)}`;
    pzVal.textContent = `${p_z >= 0 ? "+" : ""}${p_z.toFixed(3)}`;
    yxVal.textContent = `${y_x >= 0 ? "+" : ""}${y_x.toFixed(3)}`;
    yyVal.textContent = `${y_y >= 0 ? "+" : ""}${y_y.toFixed(3)}`;
    yzVal.textContent = `${y_z >= 0 ? "+" : ""}${y_z.toFixed(3)}`;

    const R = eulerToR(r, p, yw);
    const qx = R[0][0]*p_x + R[0][1]*p_y + R[0][2]*p_z + x;
    const qy = R[1][0]*p_x + R[1][1]*p_y + R[1][2]*p_z + y;
    const qz = R[2][0]*p_x + R[2][1]*p_y + R[2][2]*p_z + z;

    const rx = qx - y_x;
    const ry = qy - y_y;
    const rz = qz - y_z;
    const error = 0.5 * (rx * rx + ry * ry + rz * rz);

    readout.innerHTML = `
      <strong>SE(3) Landmark Alignment:</strong><br>
      Pose: t=(${fmt(x, 4, 2)}, ${fmt(y, 4, 2)}, ${fmt(z, 4, 2)})<sup>T</sup> &nbsp;|&nbsp; Euler (&phi;=${fmt(r, 4, 2)}, &theta;=${fmt(p, 4, 2)}, &psi;=${fmt(yw, 4, 2)}) rad<br>
      Predicted Point q = R &middot; p<sub>s</sub> + t = (${fmt(qx, 4, 2)}, ${fmt(qy, 4, 2)}, ${fmt(qz, 4, 2)})<sup>T</sup> &nbsp;|&nbsp; Target y = (${fmt(y_x, 4, 2)}, ${fmt(y_y, 4, 2)}, ${fmt(y_z, 4, 2)})<sup>T</sup><br>
      <strong style="color: #d90429;">Residual r = q - y = (${fmt(rx, 4, 2)}, ${fmt(ry, 4, 2)}, ${fmt(rz, 4, 2)})<sup>T</sup> &nbsp;|&nbsp; Error E = &frac12;||r||&sup2; = ${error.toFixed(4)}</strong>
    `;

    if (renderFunc) {
      PyodideDemo.render(demo, renderFunc(x, y, z, r, p, yw, p_x, p_y, p_z, y_x, y_y, y_z)).catch(pause);
    }
  }

  function pause() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    play.textContent = "Play";
  }

  function animate(now) {
    if (previousTime) {
      const dt = (now - previousTime) / 1000;
      let yw = Number(yaw.value) + dt * 0.8;
      if (yw > Math.PI) yw -= 2 * Math.PI;
      yaw.value = yw;
      draw();
    }
    previousTime = now;
    frame = requestAnimationFrame(animate);
  }

  [posX, posY, posZ, roll, pitch, yaw, px, py, pz, yx, yy, yz].forEach(ctrl => ctrl.addEventListener("input", draw));

  play.addEventListener("click", () => {
    if (frame) {
      pause();
    } else {
      play.textContent = "Pause";
      frame = requestAnimationFrame(animate);
    }
  });

  reset.addEventListener("click", () => {
    pause();
    posX.value = 0.5;
    posY.value = 0.8;
    posZ.value = 0.4;
    roll.value = 0.2;
    pitch.value = 0.3;
    yaw.value = 0.5;
    px.value = 1.0;
    py.value = 0.4;
    pz.value = 0.6;
    yx.value = 1.8;
    yy.value = 1.5;
    yz.value = 1.0;
    draw();
  });

  PyodideDemo.load(demo, {
    packages: ["numpy"],
    functionName: "se3_figure",
    readyMessage: "SE(3) figure ready.",
  }).then((render) => {
    renderFunc = render;
    for (const ctrl of [posX, posY, posZ, roll, pitch, yaw, px, py, pz, yx, yy, yz, play, reset]) ctrl.disabled = false;
    draw();
  }).catch(() => {});
})();
