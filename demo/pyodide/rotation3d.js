(() => {
  const demo = document.currentScript.previousElementSibling;
  if (!demo?.classList.contains("pyodide-demo")) return;
  demo.classList.add("pyodide-demo-3d");

  demo.querySelector(".pyodide-demo-controls").innerHTML = `
    <label for="rotation3d-omega">Angular velocity <span id="rotation3d-omega-value">1.00 rad/s</span></label>
    <input id="rotation3d-omega" type="range" min="-2" max="2" step="0.05" value="1" disabled>
    <label for="rotation3d-time">Time <span id="rotation3d-time-value">0.00 s</span></label>
    <input id="rotation3d-time" type="range" min="0" max="10" step="0.01" value="0" disabled>
    <div class="rotation3d-actions">
      <button type="button" class="rotation3d-play" disabled>Play</button>
      <button type="button" class="rotation3d-reset" disabled>Reset</button>
      <span class="rotation3d-angle">Angle: 0.00 rad</span>
    </div>`;

  const omega = demo.querySelector("#rotation3d-omega");
  const time = demo.querySelector("#rotation3d-time");
  const omegaValue = demo.querySelector("#rotation3d-omega-value");
  const timeValue = demo.querySelector("#rotation3d-time-value");
  const angleValue = demo.querySelector(".rotation3d-angle");
  const play = demo.querySelector(".rotation3d-play");
  const reset = demo.querySelector(".rotation3d-reset");
  let rotationFigure;
  let frame = 0;
  let previousTime = 0;
  let lastDrawTime = 0;
  let rendering = false;
  let pending = null;

  async function flush() {
    if (rendering) return;
    rendering = true;
    try {
      while (pending !== null) {
        const output = pending;
        pending = null;
        await PyodideDemo.render(demo, output);
      }
    } catch {
      pending = null;
      pause();
    } finally {
      rendering = false;
    }
  }

  function draw() {
    const angularVelocity = Number(omega.value);
    const seconds = Number(time.value);
    omegaValue.textContent = `${angularVelocity.toFixed(2)} rad/s`;
    timeValue.textContent = `${seconds.toFixed(2)} s`;
    angleValue.textContent = `Angle: ${(angularVelocity * seconds).toFixed(2)} rad`;
    if (rotationFigure) {
      pending = rotationFigure(angularVelocity, seconds);
      flush();
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
      time.value = Math.min(Number(time.max), Number(time.value) + (now - previousTime) / 1000);
      if (now - lastDrawTime >= 50 || Number(time.value) >= Number(time.max)) {
        draw();
        lastDrawTime = now;
      }
    }
    previousTime = now;
    if (Number(time.value) >= Number(time.max)) {
      pause();
    } else {
      frame = requestAnimationFrame(animate);
    }
  }

  omega.addEventListener("input", draw);
  time.addEventListener("input", draw);
  play.addEventListener("click", () => {
    if (frame) {
      pause();
    } else {
      if (Number(time.value) >= Number(time.max)) time.value = 0;
      play.textContent = "Pause";
      frame = requestAnimationFrame(animate);
    }
  });
  reset.addEventListener("click", () => {
    pause();
    time.value = 0;
    draw();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) pause();
  });

  PyodideDemo.load(demo, {
    packages: ["numpy"],
    functionName: "rotation3d_figure",
    readyMessage: "Python figure ready. Drag the plot to rotate the camera.",
  }).then((render) => {
    rotationFigure = render;
    for (const control of [omega, time, play, reset]) control.disabled = false;
    draw();
  }).catch(() => {});
})();
