(() => {
  const demo = document.currentScript.previousElementSibling;
  if (!demo?.classList.contains("pyodide-demo")) return;

  demo.querySelector(".pyodide-demo-controls").innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div class="control-row">
        <label for="so3-roll" style="width: 150px; flex-shrink: 0;">Roll &phi;:</label>
        <span id="so3-roll-val" class="num-val">+0.349 rad</span>
        <input id="so3-roll" type="range" min="-3.14159" max="3.14159" step="0.005" value="0.349066" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so3-pitch" style="width: 150px; flex-shrink: 0;">Pitch &theta;:</label>
        <span id="so3-pitch-val" class="num-val">+0.524 rad</span>
        <input id="so3-pitch" type="range" min="-1.57" max="1.57" step="0.005" value="0.523598" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so3-yaw" style="width: 150px; flex-shrink: 0;">Yaw &psi;:</label>
        <span id="so3-yaw-val" class="num-val">+0.785 rad</span>
        <input id="so3-yaw" type="range" min="-3.14159" max="3.14159" step="0.005" value="0.785398" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so3-px" style="width: 150px; flex-shrink: 0;">Point p<sub>x</sub>:</label>
        <span id="so3-px-val" class="num-val">+1.000</span>
        <input id="so3-px" type="range" min="-1.5" max="1.5" step="0.005" value="1.0" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so3-py" style="width: 150px; flex-shrink: 0;">Point p<sub>y</sub>:</label>
        <span id="so3-py-val" class="num-val">+0.500</span>
        <input id="so3-py" type="range" min="-1.5" max="1.5" step="0.005" value="0.5" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so3-pz" style="width: 150px; flex-shrink: 0;">Point p<sub>z</sub>:</label>
        <span id="so3-pz-val" class="num-val">+0.800</span>
        <input id="so3-pz" type="range" min="-1.5" max="1.5" step="0.005" value="0.8" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so3-yx" style="width: 150px; flex-shrink: 0;">Target y<sub>x</sub>:</label>
        <span id="so3-yx-val" class="num-val">+0.500</span>
        <input id="so3-yx" type="range" min="-1.8" max="1.8" step="0.005" value="0.5" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so3-yy" style="width: 150px; flex-shrink: 0;">Target y<sub>y</sub>:</label>
        <span id="so3-yy-val" class="num-val">+1.200</span>
        <input id="so3-yy" type="range" min="-1.8" max="1.8" step="0.005" value="1.2" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so3-yz" style="width: 150px; flex-shrink: 0;">Target y<sub>z</sub>:</label>
        <span id="so3-yz-val" class="num-val">+0.800</span>
        <input id="so3-yz" type="range" min="-1.8" max="1.8" step="0.005" value="0.8" disabled style="flex-grow: 1;">
      </div>
      <div class="lie-rotation-actions" style="margin-top: 4px;">
        <button id="so3-play" type="button" disabled>Play</button>
        <button id="so3-reset" type="button" disabled>Reset</button>
      </div>
      <div id="so3-readout" class="matrix-readout"></div>
    </div>`;

  const roll = demo.querySelector("#so3-roll");
  const pitch = demo.querySelector("#so3-pitch");
  const yaw = demo.querySelector("#so3-yaw");
  const px = demo.querySelector("#so3-px");
  const py = demo.querySelector("#so3-py");
  const pz = demo.querySelector("#so3-pz");
  const yx = demo.querySelector("#so3-yx");
  const yy = demo.querySelector("#so3-yy");
  const yz = demo.querySelector("#so3-yz");

  const rollVal = demo.querySelector("#so3-roll-val");
  const pitchVal = demo.querySelector("#so3-pitch-val");
  const yawVal = demo.querySelector("#so3-yaw-val");
  const pxVal = demo.querySelector("#so3-px-val");
  const pyVal = demo.querySelector("#so3-py-val");
  const pzVal = demo.querySelector("#so3-pz-val");
  const yxVal = demo.querySelector("#so3-yx-val");
  const yyVal = demo.querySelector("#so3-yy-val");
  const yzVal = demo.querySelector("#so3-yz-val");

  const play = demo.querySelector("#so3-play");
  const reset = demo.querySelector("#so3-reset");
  const readout = demo.querySelector("#so3-readout");

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
    const r = Number(roll.value);
    const p = Number(pitch.value);
    const y = Number(yaw.value);
    const p_x = Number(px.value);
    const p_y = Number(py.value);
    const p_z = Number(pz.value);
    const y_x = Number(yx.value);
    const y_y = Number(yy.value);
    const y_z = Number(yz.value);

    rollVal.textContent = `${r >= 0 ? "+" : ""}${r.toFixed(3)} rad`;
    pitchVal.textContent = `${p >= 0 ? "+" : ""}${p.toFixed(3)} rad`;
    yawVal.textContent = `${y >= 0 ? "+" : ""}${y.toFixed(3)} rad`;
    pxVal.textContent = `${p_x >= 0 ? "+" : ""}${p_x.toFixed(3)}`;
    pyVal.textContent = `${p_y >= 0 ? "+" : ""}${p_y.toFixed(3)}`;
    pzVal.textContent = `${p_z >= 0 ? "+" : ""}${p_z.toFixed(3)}`;
    yxVal.textContent = `${y_x >= 0 ? "+" : ""}${y_x.toFixed(3)}`;
    yyVal.textContent = `${y_y >= 0 ? "+" : ""}${y_y.toFixed(3)}`;
    yzVal.textContent = `${y_z >= 0 ? "+" : ""}${y_z.toFixed(3)}`;

    const R = eulerToR(r, p, y);
    const qx = R[0][0]*p_x + R[0][1]*p_y + R[0][2]*p_z;
    const qy = R[1][0]*p_x + R[1][1]*p_y + R[1][2]*p_z;
    const qz = R[2][0]*p_x + R[2][1]*p_y + R[2][2]*p_z;

    const rx = qx - y_x;
    const ry = qy - y_y;
    const rz = qz - y_z;
    const error = 0.5 * (rx * rx + ry * ry + rz * rz);

    readout.innerHTML = `
      <strong>SO(3) Landmark Alignment:</strong><br>
      Euler (&phi;=${fmt(r, 5, 2)}, &theta;=${fmt(p, 5, 2)}, &psi;=${fmt(y, 5, 2)}) rad &nbsp;|&nbsp; Fixed Target y = (${fmt(y_x, 4, 2)}, ${fmt(y_y, 4, 2)}, ${fmt(y_z, 4, 2)})<sup>T</sup><br>
      Predicted Point q = R &middot; p<sub>s</sub> = (${fmt(qx, 4, 2)}, ${fmt(qy, 4, 2)}, ${fmt(qz, 4, 2)})<sup>T</sup><br>
      <strong style="color: #d90429;">Residual r = q - y = (${fmt(rx, 4, 2)}, ${fmt(ry, 4, 2)}, ${fmt(rz, 4, 2)})<sup>T</sup> &nbsp;|&nbsp; Error E = &frac12;||r||&sup2; = ${error.toFixed(4)}</strong>
    `;

    if (renderFunc) {
      PyodideDemo.render(demo, renderFunc(r, p, y, p_x, p_y, p_z, y_x, y_y, y_z)).catch(pause);
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
      let dt = (now - previousTime) / 1000;
      let nextYaw = Number(yaw.value) + dt * 0.8;
      if (nextYaw > Math.PI) nextYaw -= 2 * Math.PI;
      yaw.value = nextYaw;
      draw();
    }
    previousTime = now;
    frame = requestAnimationFrame(animate);
  }

  [roll, pitch, yaw, px, py, pz, yx, yy, yz].forEach(ctrl => ctrl.addEventListener("input", draw));

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
    roll.value = 0.349066;
    pitch.value = 0.523598;
    yaw.value = 0.785398;
    px.value = 1.0;
    py.value = 0.5;
    pz.value = 0.8;
    yx.value = 0.5;
    yy.value = 1.2;
    yz.value = 0.8;
    draw();
  });

  PyodideDemo.load(demo, {
    packages: ["numpy"],
    functionName: "so3_figure",
    readyMessage: "SO(3) figure ready.",
  }).then((render) => {
    renderFunc = render;
    for (const ctrl of [roll, pitch, yaw, px, py, pz, yx, yy, yz, play, reset]) ctrl.disabled = false;
    draw();
  }).catch(() => {});
})();
