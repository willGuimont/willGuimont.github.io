// Shared runtime and source viewer for interactive Python figures.
window.PyodideDemo ??= (() => {
  const runtimeUrl = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";
  const drawsvgWheel = new URL("/pyodide/drawsvg-2.4.2-py3-none-any.whl", document.baseURI).href;
  let runtimePromise;
  let figureKitPromise;
  let sceneModulePromise;
  const scenes = new WeakMap();

  function loadScript(url, name) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load ${name}`));
      document.head.append(script);
    });
  }

  function runtime() {
    runtimePromise ??= (async () => {
      await loadScript(runtimeUrl, "Pyodide");
      return loadPyodide();
    })();
    return runtimePromise;
  }

  function figureKit(pyodide) {
    figureKitPromise ??= (async () => {
      const response = await fetch("/pyodide/figurekit.py");
      if (!response.ok) throw new Error("Could not load the figure library");
      pyodide.FS.writeFile("/home/pyodide/figurekit.py", await response.text());
    })();
    return figureKitPromise;
  }

  function sceneModule() {
    sceneModulePromise ??= import("/pyodide/scene3d.js");
    return sceneModulePromise;
  }

  async function load(demo, { packages = [], functionName, readyMessage = "Python ready." }) {
    const status = demo.querySelector(".pyodide-demo-status");
    try {
      const sourceUrl = new URL(demo.dataset.source, document.baseURI);
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error("Could not load Python source");
      const source = await response.text();

      const pyodide = await runtime();
      if (packages.length) {
        await pyodide.loadPackage(packages.map((name) => name === "drawsvg" ? drawsvgWheel : name));
      }
      await figureKit(pyodide);
      const globals = pyodide.runPython("dict()");
      let render;
      try {
        pyodide.runPython(source, { globals, filename: sourceUrl.pathname });
        render = globals.get(functionName);
      } finally {
        globals.destroy();
      }
      if (!render) throw new Error(`Python function ${functionName} was not found`);
      status.textContent = readyMessage;
      return render;
    } catch (error) {
      status.textContent = `The interactive plot could not load: ${error.message}.`;
      throw error;
    }
  }

  async function render(demo, output) {
    const plot = demo.querySelector(".pyodide-demo-plot");
    const status = demo.querySelector(".pyodide-demo-status");
    try {
      const figure = JSON.parse(output);
      if (figure.kind === "svg" && typeof figure.svg === "string") {
        scenes.get(plot)?.dispose();
        scenes.delete(plot);
        plot.dataset.renderer = "svg";
        plot.setAttribute("role", "img");
        plot.innerHTML = figure.svg;
      } else if (figure.kind === "scene3d" && Array.isArray(figure.objects) && figure.axes) {
        const { createScene3D } = await sceneModule();
        let scene = scenes.get(plot);
        if (!scene) {
          plot.replaceChildren();
          scene = createScene3D(plot);
          scenes.set(plot, scene);
          plot.dataset.renderer = "three";
        }
        plot.setAttribute("role", "group");
        scene.update(figure);
      } else {
        throw new Error("Unknown figure format");
      }
    } catch (error) {
      status.textContent = `The interactive plot could not render: ${error.message}.`;
      throw error;
    }
  }

  return { load, render };
})();
