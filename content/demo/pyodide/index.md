+++
title = "Pyodide Demo Component"
description = "How to embed an interactive Python figure with Pyodide."
+++

## Live example

This example runs Python in your browser with Pyodide. Drag the sliders, use **Play** and **Reset**, then expand **Show Python code** to see the source that generates the SVG figure.

{% <pyodide_demo source="/demo/pyodide/rotation.py" script="/demo/pyodide/rotation.js" stylesheet="/demo/pyodide/rotation.css" title="Unit vector rotated from the positive x-axis"> %}
NumPy computes the position of the blue vector. The controls change its angular velocity and elapsed time.
{% </pyodide_demo> %}

## Add one to an article

For a new figure, put its files in the article's page bundle:

```text
content/blog/my-article/
├── index.md       # Article text and component call
├── rotation.py    # NumPy calculation; returns an SVG string
├── rotation.js    # Sliders/buttons and calls to Python
└── rotation.css   # Figure-specific layout (optional)
```

Use [rotation.py](/demo/pyodide/rotation.py), [rotation.js](/demo/pyodide/rotation.js), and [rotation.css](/demo/pyodide/rotation.css) as the complete example. In this figure, `rotation.py` defines `rotation_svg(omega, time)`. It computes the rotated vector with NumPy, builds the drawing with `drawsvg`, and returns `drawing.as_svg(header="")`. The JavaScript calls the shared loader with `packages: ["numpy", "drawsvg"]` and `functionName: "rotation_svg"`, then passes the slider values to the returned function and puts its SVG result in `.pyodide-demo-plot`.

Add this to `index.md`, using the page bundle's URL for each file:

<pre><code>&#123;% &lt;pyodide_demo source="/blog/my-article/rotation.py" script="/blog/my-article/rotation.js" stylesheet="/blog/my-article/rotation.css" title="Unit vector rotated from the positive x-axis"&gt; %&#125;
Drag the sliders to change angular velocity and time.
&#123;% &lt;/pyodide_demo&gt; %&#125;</code></pre>

`source` and `script` are required. `stylesheet` and `title` are optional. The component provides a place for controls, an SVG plot, a loading status, and a **Show Python code** panel. Markdown between the opening and closing tags appears above the controls. Zola reads the Python file at build time and highlights that same file in the code panel. For a Python file outside `content/`, pass `code_path="static/path/to/file.py"` as well.

The shared [Pyodide loader](/pyodide/demo.js) in `static/pyodide/` fetches and executes the Python source and loads its packages. The figure-specific [rotation.js](/demo/pyodide/rotation.js) defines the controls and calls the Python `rotation_svg` function. The [rotation.py](/demo/pyodide/rotation.py) file uses NumPy for the rotation and [drawsvg](https://cduck.github.io/drawsvg/) for SVG circles, lines, text, and the trajectory. The script requests NumPy and the locally stored `drawsvg` wheel through the shared loader, so the Python code does not need to assemble SVG markup by hand.

The `drawsvg` 2.4.2 wheel is stored at [static/pyodide/drawsvg-2.4.2-py3-none-any.whl](/pyodide/drawsvg-2.4.2-py3-none-any.whl). It includes its MIT license and supports paths, groups, gradients, clip paths, and SVG animation for more complex figures. The loader maps `"drawsvg"` in a figure's `packages` list to this local wheel.

The site's Content Security Policy allows the pinned Pyodide runtime from jsDelivr and WebAssembly execution. A network connection is needed the first time a visitor loads the runtime and its packages.
