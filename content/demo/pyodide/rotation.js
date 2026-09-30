(() => {
  const demo = document.currentScript.previousElementSibling;
  if (!demo?.classList.contains("pyodide-demo")) return;

  demo.querySelector(".pyodide-demo-controls").innerHTML = `
    <label for="lie-omega">Angular velocity <span id="lie-omega-value">1.00 rad/s</span></label>
    <input id="lie-omega" type="range" min="-2" max="2" step="0.05" value="1" disabled>
    <label for="lie-time">Time <span id="lie-time-value">0.00 s</span></label>
    <input id="lie-time" type="range" min="0" max="10" step="0.01" value="0" disabled>
    <div class="lie-rotation-actions">
      <button id="lie-play" type="button" disabled>Play</button>
      <button id="lie-reset" type="button" disabled>Reset</button>
      <span id="lie-angle">Angle: 0.00 rad</span>
    </div>`;
  const omega = demo.querySelector("#lie-omega");
  const time = demo.querySelector("#lie-time");
  const omegaValue = demo.querySelector("#lie-omega-value");
  const timeValue = demo.querySelector("#lie-time-value");
  const angleValue = demo.querySelector("#lie-angle");
  const play = demo.querySelector("#lie-play");
  const reset = demo.querySelector("#lie-reset");
  const plot = demo.querySelector(".pyodide-demo-plot");
  let rotationSvg;
  let frame = 0;
  let previousTime = 0;

  function draw() {
    const angularVelocity = Number(omega.value);
    const seconds = Number(time.value);
    omegaValue.textContent = `${angularVelocity.toFixed(2)} rad/s`;
    timeValue.textContent = `${seconds.toFixed(2)} s`;
    angleValue.textContent = `Angle: ${(angularVelocity * seconds).toFixed(2)} rad`;
    if (rotationSvg) plot.innerHTML = rotationSvg(angularVelocity, seconds);
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
      draw();
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
    packages: ["numpy", "drawsvg"],
    functionName: "rotation_svg",
    readyMessage: "Python, NumPy, and drawsvg ready.",
  }).then((render) => {
    rotationSvg = render;
    for (const control of [omega, time, play, reset]) control.disabled = false;
    draw();
  }).catch(() => {});
})();
