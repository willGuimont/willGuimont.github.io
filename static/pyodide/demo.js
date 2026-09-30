// Shared runtime and source viewer for interactive Python figures.
window.PyodideDemo ??= (() => {
  const runtimeUrl = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";
  const drawsvgWheel = new URL("/pyodide/drawsvg-2.4.2-py3-none-any.whl", document.baseURI).href;
  let runtimePromise;

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Could not load Pyodide"));
      document.head.append(script);
    });
  }

  function runtime() {
    runtimePromise ??= (async () => {
      await loadScript(runtimeUrl);
      return loadPyodide();
    })();
    return runtimePromise;
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
      pyodide.runPython(source);
      const render = pyodide.globals.get(functionName);
      if (!render) throw new Error(`Python function ${functionName} was not found`);
      status.textContent = readyMessage;
      return render;
    } catch (error) {
      status.textContent = `The interactive plot could not load: ${error.message}.`;
      throw error;
    }
  }

  return { load };
})();
