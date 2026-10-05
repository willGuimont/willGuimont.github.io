(() => {
  const demo = document.currentScript.previousElementSibling;
  if (!demo?.classList.contains("pyodide-demo")) return;

  demo.querySelector(".pyodide-demo-controls").innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div class="control-row">
        <label for="se2-x" style="width: 150px; flex-shrink: 0;">Position x:</label>
        <span id="se2-x-val" class="num-val">+0.500</span>
        <input id="se2-x" type="range" min="-1.5" max="1.5" step="0.005" value="0.5" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="se2-y" style="width: 150px; flex-shrink: 0;">Position y:</label>
        <span id="se2-y-val" class="num-val">+0.800</span>
        <input id="se2-y" type="range" min="-1.5" max="1.5" step="0.005" value="0.8" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="se2-theta" style="width: 150px; flex-shrink: 0;">Heading &theta;:</label>
        <span id="se2-theta-val" class="num-val">+0.524 rad</span>
        <input id="se2-theta" type="range" min="-3.14159" max="3.14159" step="0.005" value="0.523598" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="se2-px" style="width: 150px; flex-shrink: 0;">Sensor Point p<sub>x</sub>:</label>
        <span id="se2-px-val" class="num-val">+1.000</span>
        <input id="se2-px" type="range" min="0.2" max="1.4" step="0.005" value="1.0" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="se2-py" style="width: 150px; flex-shrink: 0;">Sensor Point p<sub>y</sub>:</label>
        <span id="se2-py-val" class="num-val">+0.400</span>
        <input id="se2-py" type="range" min="-1.0" max="1.0" step="0.005" value="0.4" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="se2-yx" style="width: 150px; flex-shrink: 0;">Target Landmark y<sub>x</sub>:</label>
        <span id="se2-yx-val" class="num-val">+1.800</span>
        <input id="se2-yx" type="range" min="-2.2" max="2.2" step="0.005" value="1.8" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="se2-yy" style="width: 150px; flex-shrink: 0;">Target Landmark y<sub>y</sub>:</label>
        <span id="se2-yy-val" class="num-val">+1.500</span>
        <input id="se2-yy" type="range" min="-2.2" max="2.2" step="0.005" value="1.5" disabled style="flex-grow: 1;">
      </div>
      <div class="lie-rotation-actions" style="margin-top: 4px;">
        <button id="se2-play" type="button" disabled>Play</button>
        <button id="se2-reset" type="button" disabled>Reset</button>
      </div>
      <div id="se2-readout" class="matrix-readout"></div>
    </div>`;

  const posX = demo.querySelector("#se2-x");
  const posY = demo.querySelector("#se2-y");
  const theta = demo.querySelector("#se2-theta");
  const px = demo.querySelector("#se2-px");
  const py = demo.querySelector("#se2-py");
  const yx = demo.querySelector("#se2-yx");
  const yy = demo.querySelector("#se2-yy");

  const xVal = demo.querySelector("#se2-x-val");
  const yVal = demo.querySelector("#se2-y-val");
  const thetaVal = demo.querySelector("#se2-theta-val");
  const pxVal = demo.querySelector("#se2-px-val");
  const pyVal = demo.querySelector("#se2-py-val");
  const yxVal = demo.querySelector("#se2-yx-val");
  const yyVal = demo.querySelector("#se2-yy-val");

  const play = demo.querySelector("#se2-play");
  const reset = demo.querySelector("#se2-reset");
  const readout = demo.querySelector("#se2-readout");

  let renderFunc;
  let frame = 0;
  let previousTime = 0;

  function fmt(num, width = 6, dec = 2) {
    const s = (num >= 0 ? "+" : "") + num.toFixed(dec);
    return s.padStart(width, " ");
  }

  function draw() {
    const x = Number(posX.value);
    const y = Number(posY.value);
    const th = Number(theta.value);
    const p_x = Number(px.value);
    const p_y = Number(py.value);
    const y_x = Number(yx.value);
    const y_y = Number(yy.value);

    xVal.textContent = `${x >= 0 ? "+" : ""}${x.toFixed(3)}`;
    yVal.textContent = `${y >= 0 ? "+" : ""}${y.toFixed(3)}`;
    thetaVal.textContent = `${th >= 0 ? "+" : ""}${th.toFixed(3)} rad`;
    pxVal.textContent = `${p_x >= 0 ? "+" : ""}${p_x.toFixed(3)}`;
    pyVal.textContent = `${p_y >= 0 ? "+" : ""}${p_y.toFixed(3)}`;
    yxVal.textContent = `${y_x >= 0 ? "+" : ""}${y_x.toFixed(3)}`;
    yyVal.textContent = `${y_y >= 0 ? "+" : ""}${y_y.toFixed(3)}`;

    const c = Math.cos(th), s = Math.sin(th);
    const qx = c * p_x - s * p_y + x;
    const qy = s * p_x + c * p_y + y;
    const rx = qx - y_x;
    const ry = qy - y_y;
    const error = 0.5 * (rx * rx + ry * ry);

    readout.innerHTML = `
      <strong>SE(2) Landmark Alignment:</strong><br>
      Robot Pose: t=(${fmt(x, 5, 2)}, ${fmt(y, 5, 2)})<sup>T</sup>, &theta;=${fmt(th, 5, 2)} rad<br>
      Predicted Point q = R(&theta;)p<sub>s</sub> + t = (${fmt(qx, 5, 2)}, ${fmt(qy, 5, 2)})<sup>T</sup> &nbsp;|&nbsp; Target y = (${fmt(y_x, 5, 2)}, ${fmt(y_y, 5, 2)})<sup>T</sup><br>
      <strong style="color: #d90429;">Residual r = q - y = (${fmt(rx, 5, 2)}, ${fmt(ry, 5, 2)})<sup>T</sup> &nbsp;|&nbsp; Error E = &frac12;||r||&sup2; = ${error.toFixed(4)}</strong>
    `;

    if (renderFunc) {
      PyodideDemo.render(demo, renderFunc(x, y, th, p_x, p_y, y_x, y_y)).catch(pause);
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
      let th = Number(theta.value) + dt * 0.8;
      if (th > Math.PI) th -= 2 * Math.PI;
      theta.value = th;
      draw();
    }
    previousTime = now;
    frame = requestAnimationFrame(animate);
  }

  [posX, posY, theta, px, py, yx, yy].forEach(ctrl => ctrl.addEventListener("input", draw));

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
    theta.value = 0.523598;
    px.value = 1.0;
    py.value = 0.4;
    yx.value = 1.8;
    yy.value = 1.5;
    draw();
  });

  PyodideDemo.load(demo, {
    packages: ["numpy", "drawsvg"],
    functionName: "se2_figure",
    readyMessage: "SE(2) figure ready.",
  }).then((render) => {
    renderFunc = render;
    for (const ctrl of [posX, posY, theta, px, py, yx, yy, play, reset]) ctrl.disabled = false;
    draw();
  }).catch(() => {});
})();
