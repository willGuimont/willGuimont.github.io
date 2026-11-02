import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js";

function numericValues(value, output) {
  if (Array.isArray(value)) {
    for (const item of value) numericValues(item, output);
  } else if (Number.isFinite(value)) {
    output.push(value);
  }
}

function axisRanges(figure) {
  return ["x", "y", "z"].map((axis) => {
    const specified = figure.axes[axis]?.range;
    if (specified) return specified;
    const values = [];
    for (const object of figure.objects) {
      if (object.points) {
        for (const point of object.points) numericValues(point["xyz".indexOf(axis)], values);
      } else numericValues(object[axis], values);
    }
    if (!values.length) return [-1, 1];
    let minimum = 0;
    let maximum = 0;
    for (const value of values) { minimum = Math.min(minimum, value); maximum = Math.max(maximum, value); }
    const padding = Math.max((maximum - minimum) * 0.1, 0.1);
    return [minimum - padding, maximum + padding];
  });
}

function disposeGroup(group) {
  const disposed = new Set();
  for (const child of [...group.children]) {
    group.remove(child);
    child.traverse((object) => {
      if (object.geometry && !disposed.has(object.geometry)) {
        disposed.add(object.geometry);
        object.geometry.dispose();
      }
      if (object.material) {
        for (const material of [object.material].flat()) {
          if (!disposed.has(material)) {
            disposed.add(material);
            material.map?.dispose();
            material.dispose();
          }
        }
      }
    });
  }
}

function axisTicks([minimum, maximum]) {
  const rawStep = (maximum - minimum) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const fraction = rawStep / magnitude;
  const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * magnitude;
  const ticks = [];
  for (let index = Math.ceil(minimum / step); index <= Math.floor(maximum / step); index++) {
    const value = Number((index * step).toPrecision(12));
    ticks.push({ value, text: String(value === 0 ? 0 : value) });
  }
  return ticks;
}

function label(text, color, fontSize) {
  const canvas = document.createElement("canvas");
  const measuringContext = canvas.getContext("2d");
  measuringContext.font = "36px sans-serif";
  canvas.width = Math.ceil(measuringContext.measureText(text).width) + 24;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  context.font = "36px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, 32);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas), transparent: true, depthTest: false, sizeAttenuation: false,
  }));
  sprite.userData.fontSize = fontSize;
  sprite.userData.aspect = canvas.width / canvas.height;
  return sprite;
}

export function createScene3D(plot) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.up.set(0, 0, 1);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.localClippingEnabled = true;
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none";
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute("aria-label", "3D figure. Drag to rotate; scroll to zoom.");
  plot.append(renderer.domElement);

  const axes = new THREE.Group();
  const contents = new THREE.Group();
  scene.add(axes, contents);
  let azimuth = Math.PI / 4;
  let elevation = Math.atan(1 / Math.sqrt(2));
  let distance = 4.2;
  let pointer = null;
  let rangesKey;
  const clippingPlanes = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), 1),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1),
    new THREE.Plane(new THREE.Vector3(0, 1, 0), 1),
    new THREE.Plane(new THREE.Vector3(0, -1, 0), 1),
    new THREE.Plane(new THREE.Vector3(0, 0, 1), 1),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), 1),
  ];
  const transform = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0);
  let objectsKey;

  function draw() {
    for (const object of axes.children) {
      if (!object.isSprite) continue;
      const height = object.userData.fontSize * (64 / 36) * 2 * Math.tan(camera.fov * Math.PI / 360) / Math.max(1, plot.clientHeight);
      object.scale.set(height * object.userData.aspect, height, 1);
    }
    camera.position.set(
      distance * Math.cos(elevation) * Math.cos(azimuth),
      distance * Math.cos(elevation) * Math.sin(azimuth),
      distance * Math.sin(elevation),
    );
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  function resize() {
    const width = Math.max(1, plot.clientWidth);
    const height = Math.max(1, plot.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw();
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    renderer.domElement.setPointerCapture(event.pointerId);
    renderer.domElement.style.cursor = "grabbing";
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    azimuth -= (event.clientX - pointer.x) * 0.008;
    elevation = Math.max(-1.48, Math.min(1.48, elevation + (event.clientY - pointer.y) * 0.008));
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    draw();
  }

  function onPointerUp(event) {
    if (pointer?.id === event.pointerId) {
      pointer = null;
      renderer.domElement.style.cursor = "grab";
    }
  }

  function onWheel(event) {
    event.preventDefault();
    distance = Math.max(2.2, Math.min(12, distance * Math.exp(event.deltaY * 0.001)));
    draw();
  }

  function onKeyDown(event) {
    const step = 0.12;
    if (event.key === "ArrowLeft") azimuth += step;
    else if (event.key === "ArrowRight") azimuth -= step;
    else if (event.key === "ArrowUp") elevation = Math.min(1.48, elevation + step);
    else if (event.key === "ArrowDown") elevation = Math.max(-1.48, elevation - step);
    else if (event.key === "+" || event.key === "=") distance = Math.max(2.2, distance * 0.9);
    else if (event.key === "-") distance = Math.min(12, distance * 1.1);
    else return;
    event.preventDefault();
    draw();
  }

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointercancel", onPointerUp);
  renderer.domElement.addEventListener("lostpointercapture", onPointerUp);
  renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
  renderer.domElement.addEventListener("keydown", onKeyDown);
  const observer = new ResizeObserver(resize);
  observer.observe(plot);
  renderer.domElement.style.cursor = "grab";

  function update(figure) {
    const ranges = axisRanges(figure);
    const toWorld = (x, y, z) => new THREE.Vector3(
      2 * (x - ranges[0][0]) / (ranges[0][1] - ranges[0][0]) - 1,
      2 * (y - ranges[1][0]) / (ranges[1][1] - ranges[1][0]) - 1,
      2 * (z - ranges[2][0]) / (ranges[2][1] - ranges[2][0]) - 1,
    );
    const fontSize = figure.axis_font_size || 14;
    const nextRangesKey = JSON.stringify([ranges, figure.axes, fontSize]) + getComputedStyle(plot).color;
    if (nextRangesKey !== rangesKey) {
      rangesKey = nextRangesKey;
      disposeGroup(axes);
      const foreground = getComputedStyle(plot).color;
      const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
      const edges = new THREE.EdgesGeometry(boxGeometry);
      boxGeometry.dispose();
      const box = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: foreground, transparent: true, opacity: 0.25 }),
      );
      axes.add(box);
      const directions = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
      // Put graduations on the box edges, clear of the data and the origin.
      const offsets = [new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0)];
      for (let axis = 0; axis < 3; axis++) {
        const direction = directions[axis];
        const start = new THREE.Vector3(-1, -1, -1);
        const end = start.clone().addScaledVector(direction, 2);
        axes.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([start, end]),
          new THREE.LineBasicMaterial({ color: foreground, transparent: true, opacity: 0.5 }),
        ));
        const tickSegments = [];
        for (const tick of axisTicks(ranges[axis])) {
          const position = start.clone().addScaledVector(direction, 2 * (tick.value - ranges[axis][0]) / (ranges[axis][1] - ranges[axis][0]));
          tickSegments.push(position, position.clone().addScaledVector(offsets[axis], 0.045));
          const number = label(tick.text, foreground, fontSize);
          number.position.copy(position).addScaledVector(offsets[axis], 0.13);
          axes.add(number);
        }
        axes.add(new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(tickSegments),
          new THREE.LineBasicMaterial({ color: foreground, transparent: true, opacity: 0.5 }),
        ));
        const caption = label(figure.axes["xyz"[axis]]?.label || "xyz"[axis], foreground, fontSize * 1.2);
        caption.position.copy(end).addScaledVector(direction, 0.15).addScaledVector(offsets[axis], 0.1);
        axes.add(caption);
      }
    }

    const nextObjectsKey = JSON.stringify(figure.objects.map((object) => (
      [object.type, object.points?.length, object.z?.length, object.z?.[0]?.length]
    )));
    if (nextObjectsKey !== objectsKey) {
      objectsKey = nextObjectsKey;
      disposeGroup(contents);
      for (const object of figure.objects) {
        const material = new THREE.MeshBasicMaterial({
          color: object.color || "#3996e6", clippingPlanes,
        });
        if (object.type === "line" || object.type === "points") {
          const count = object.type === "line" ? Math.max(0, object.points.length - 1) : object.points.length;
          const geometry = object.type === "line"
            ? new THREE.CylinderGeometry(1, 1, 1, 6)
            : new THREE.SphereGeometry(1, 12, 8);
          contents.add(new THREE.InstancedMesh(geometry, material, count));
        } else if (object.type === "surface") {
          material.vertexColors = true;
          material.side = THREE.DoubleSide;
          material.transparent = true;
          material.opacity = 0.85;
          contents.add(new THREE.Mesh(new THREE.BufferGeometry(), material));
        }
      }
    }
    for (let objectIndex = 0; objectIndex < figure.objects.length; objectIndex++) {
      const trace = figure.objects[objectIndex];
      const mesh = contents.children[objectIndex];
      if (trace.type === "line" || trace.type === "points") {
        const points = trace.points.map((point) => toWorld(...point));
        mesh.material.color.set(trace.color || "#3996e6");
        for (let index = 0; index < mesh.count; index++) {
          transform.quaternion.identity();
          if (trace.type === "line") {
            const direction = points[index + 1].clone().sub(points[index]);
            const length = direction.length();
            transform.position.copy(points[index]).add(points[index + 1]).multiplyScalar(0.5);
            if (length > 0) transform.quaternion.setFromUnitVectors(up, direction.normalize());
            transform.scale.set(trace.width * 0.0024, length, trace.width * 0.0024);
          } else {
            transform.position.copy(points[index]);
            transform.scale.setScalar(trace.size * 0.008);
          }
          transform.updateMatrix();
          mesh.setMatrixAt(index, transform.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();
      } else if (trace.type === "surface") {
        const rows = trace.z.length;
        const columns = trace.z[0]?.length || 0;
        if (rows < 2 || columns < 2) continue;
        const vertices = [];
        const colors = [];
        const indices = [];
        const heights = trace.z.flat();
        let low = Infinity;
        let high = -Infinity;
        for (const height of heights) { low = Math.min(low, height); high = Math.max(high, height); }
        const span = Math.max(high - low, 1e-9);
        const palette = {
          Viridis: ["#440154", "#21918c", "#fde725"],
          Plasma: ["#0d0887", "#cc4778", "#f0f921"],
          Gray: ["#222222", "#888888", "#eeeeee"],
        }[trace.colorscale];
        const [lowColor, midColor, highColor] = palette.map((color) => new THREE.Color(color));
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            const point = toWorld(trace.x[row][column], trace.y[row][column], trace.z[row][column]);
            vertices.push(point.x, point.y, point.z);
            const fraction = (trace.z[row][column] - low) / span;
            const color = fraction < 0.5
              ? lowColor.clone().lerp(midColor, fraction * 2)
              : midColor.clone().lerp(highColor, (fraction - 0.5) * 2);
            colors.push(color.r, color.g, color.b);
            if (row && column) {
              const a = (row - 1) * columns + column - 1;
              const b = a + 1;
              const c = a + columns;
              const d = c + 1;
              indices.push(a, b, c, b, d, c);
            }
          }
        }
        const geometry = mesh.geometry;
        if (!geometry.getAttribute("position")) {
          geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
          geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
          geometry.setIndex(indices);
        } else {
          geometry.getAttribute("position").array.set(vertices);
          geometry.getAttribute("color").array.set(colors);
          geometry.getAttribute("position").needsUpdate = true;
          geometry.getAttribute("color").needsUpdate = true;
        }
        geometry.computeBoundingSphere();
      }
    }
    draw();
  }

  function dispose() {
    observer.disconnect();
    disposeGroup(axes);
    disposeGroup(contents);
    renderer.dispose();
    renderer.domElement.remove();
  }

  resize();
  return { update, dispose };
}
