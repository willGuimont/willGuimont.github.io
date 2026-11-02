(() => {
  const demo = document.currentScript.previousElementSibling;
  if (!demo?.classList.contains("pyodide-demo")) return;

  demo.querySelector(".pyodide-demo-controls").innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div class="control-row">
        <label for="so2-theta" style="width: 150px; flex-shrink: 0;">Heading &theta;:</label>
        <span id="so2-theta-val" class="num-val">+0.785 rad</span>
        <input id="so2-theta" type="range" min="-3.14159" max="3.14159" step="0.005" value="0.785398" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so2-px" style="width: 150px; flex-shrink: 0;">Sensor Point p<sub>x</sub>:</label>
        <span id="so2-px-val" class="num-val">+1.200</span>
        <input id="so2-px" type="range" min="0.2" max="1.6" step="0.005" value="1.2" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so2-py" style="width: 150px; flex-shrink: 0;">Sensor Point p<sub>y</sub>:</label>
        <span id="so2-py-val" class="num-val">+0.500</span>
        <input id="so2-py" type="range" min="-1.2" max="1.2" step="0.005" value="0.5" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so2-yx" style="width: 150px; flex-shrink: 0;">Target Landmark y<sub>x</sub>:</label>
        <span id="so2-yx-val" class="num-val">+0.500</span>
        <input id="so2-yx" type="range" min="-1.8" max="1.8" step="0.005" value="0.5" disabled style="flex-grow: 1;">
      </div>
      <div class="control-row">
        <label for="so2-yy" style="width: 150px; flex-shrink: 0;">Target Landmark y<sub>y</sub>:</label>
        <span id="so2-yy-val" class="num-val">+1.200</span>
        <input id="so2-yy" type="range" min="-1.8" max="1.8" step="0.005" value="1.2" disabled style="flex-grow: 1;">
      </div>
      <div class="lie-rotation-actions" style="margin-top: 4px;">
        <button id="so2-play" type="button" disabled>Play</button>
        <button id="so2-reset" type="button" disabled>Reset</button>
      </div>
      <div id="so2-readout" class="matrix-readout"></div>
    </div>`;

  const theta = demo.querySelector("#so2-theta");
  const px = demo.querySelector("#so2-px");
  const py = demo.querySelector("#so2-py");
  const yx = demo.querySelector("#so2-yx");
  const yy = demo.querySelector("#so2-yy");

  const thetaVal = demo.querySelector("#so2-theta-val");
  const pxVal = demo.querySelector("#so2-px-val");
  const pyVal = demo.querySelector("#so2-py-val");
  const yxVal = demo.querySelector("#so2-yx-val");
  const yyVal = demo.querySelector("#so2-yy-val");

  const play = demo.querySelector("#so2-play");
  const reset = demo.querySelector("#so2-reset");
  const readout = demo.querySelector("#so2-readout");

  let renderFunc;
  let frame = 0;
  let previousTime = 0;

  function fmt(num, width = 6, dec = 2) {
    const s = (num >= 0 ? "+" : "") + num.toFixed(dec);
    return s.padStart(width, " ");
  }

  function draw() {
    const th = Number(theta.value);
    const p_x = Number(px.value);
    const p_y = Number(py.value);
    const y_x = Number(yx.value);
    const y_y = Number(yy.value);

    thetaVal.textContent = `${th >= 0 ? "+" : ""}${th.toFixed(3)} rad`;
    pxVal.textContent = `${p_x >= 0 ? "+" : ""}${p_x.toFixed(3)}`;
    pyVal.textContent = `${p_y >= 0 ? "+" : ""}${p_y.toFixed(3)}`;
    yxVal.textContent = `${y_x >= 0 ? "+" : ""}${y_x.toFixed(3)}`;
    yyVal.textContent = `${y_y >= 0 ? "+" : ""}${y_y.toFixed(3)}`;

    const c = Math.cos(th), s = Math.sin(th);
    const qx = c * p_x - s * p_y;
    const qy = s * p_x + c * p_y;
    const rx = qx - y_x;
    const ry = qy - y_y;
    const error = 0.5 * (rx * rx + ry * ry);

    readout.innerHTML = `
      <strong>SO(2) Landmark Alignment:</strong><br>
      Heading &theta; = ${fmt(th, 6, 3)} rad &nbsp;|&nbsp; Fixed Target y = (${fmt(y_x, 5, 2)}, ${fmt(y_y, 5, 2)})<sup>T</sup><br>
      Predicted Point q(&theta;) = R(&theta;)p<sub>s</sub> = (${fmt(qx, 5, 2)}, ${fmt(qy, 5, 2)})<sup>T</sup><br>
      <strong style="color: #d90429;">Residual r(&theta;) = q - y = (${fmt(rx, 5, 2)}, ${fmt(ry, 5, 2)})<sup>T</sup> &nbsp;|&nbsp; Error E = &frac12;||r||&sup2; = ${error.toFixed(4)}</strong>
    `;

    if (renderFunc) {
      PyodideDemo.render(demo, renderFunc(th, p_x, p_y, y_x, y_y)).catch(pause);
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
      let nextTh = Number(theta.value) + dt * 0.8;
      if (nextTh > Math.PI) nextTh -= 2 * Math.PI;
      theta.value = nextTh;
      draw();
    }
    previousTime = now;
    frame = requestAnimationFrame(animate);
  }

  [theta, px, py, yx, yy].forEach(ctrl => ctrl.addEventListener("input", draw));

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
    theta.value = 0.785398;
    px.value = 1.2;
    py.value = 0.5;
    yx.value = 0.5;
    yy.value = 1.2;
    draw();
  });

  PyodideDemo.load(demo, {
    packages: ["numpy", "drawsvg"],
    functionName: "so2_figure",
    readyMessage: "SO(2) figure ready.",
  }).then((render) => {
    renderFunc = render;
    for (const ctrl of [theta, px, py, yx, yy, play, reset]) ctrl.disabled = false;
    draw();
  }).catch(() => {});
})();
