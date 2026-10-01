+++
title = "Pyodide Figure Library"
description = "Build interactive 2D and 3D Python figures for articles."
+++

## 2D rotation: SVG

This figure runs Python in your browser with Pyodide. NumPy computes the rotated vector; `Figure2D` creates SVG. Try the sliders, **Play**, and **Reset**, then open **Show Python code**.

{% <pyodide_demo source="/demo/pyodide/rotation.py" script="/demo/pyodide/rotation.js" stylesheet="/demo/pyodide/rotation.css" title="Unit vector rotated from the positive x-axis"> %}
The blue vector rotates in the xy plane. Negative angular velocity reverses its direction.
{% </pyodide_demo> %}

## 3D rotation: movable camera

Here NumPy rotates a unit vector about the `(1, 1, 1)` axis. `Figure3D` describes the geometry in a persistent 3D scene. Drag the figure to turn the camera, scroll to zoom, or focus it and use the arrow keys and `+`/`-`. Camera movement works while the simulation is playing. The orange line shows the vector's trajectory.

{% <pyodide_demo source="/demo/pyodide/rotation3d.py" script="/demo/pyodide/rotation3d.js" stylesheet="/demo/pyodide/rotation3d.css" title="Unit vector rotated around the (1, 1, 1) axis in three dimensions"> %}
Change the angular velocity and time, or press **Play** to animate the rotation.
{% </pyodide_demo> %}

## Add a figure to an article

Put a Python source file and a JavaScript control script in the article's page bundle, then call `pyodide_demo` with their URLs. A figure-specific stylesheet is optional. Zola displays the same Python source under **Show Python code**.

<pre><code>&#123;% &lt;pyodide_demo source="/blog/my-article/figure.py" script="/blog/my-article/figure.js" stylesheet="/blog/my-article/figure.css" title="Figure description"&gt; %&#125;
Instructions for the reader.
&#123;% &lt;/pyodide_demo&gt; %&#125;</code></pre>

The Python source imports `Figure2D` or `Figure3D` from [`figurekit`](/pyodide/figurekit.py). Build the figure and return `figure.to_json()` from a function. The JavaScript script uses `PyodideDemo.load(demo, { packages, functionName })` to get that function, then passes its result to `PyodideDemo.render(demo, result)`. See the complete [2D Python](/demo/pyodide/rotation.py), [2D controls](/demo/pyodide/rotation.js), [3D Python](/demo/pyodide/rotation3d.py), and [3D controls](/demo/pyodide/rotation3d.js) examples.

```python
from figurekit import Figure3D

def make_figure():
    figure = Figure3D(x_range=(-2, 2), y_range=(-2, 2), z_range=(-2, 2), axis_font_size=16)
    figure.line([(0, 0, 0), (1, 1, 1)], color="#3996e6")
    figure.points([(1, 1, 1)])
    return figure.to_json()
```

`Figure2D` offers `line(x1, y1, x2, y2)`, `polyline(points)`, `circle(x, y, radius)`, `points(points)`, and `text(label, x, y)`. Set `x_range=(min, max)` and `y_range=(min, max)` in its constructor to choose the visible bounds; omitted ranges default to a centered view. Coordinates use the usual mathematical y direction; the library handles SVG's inverted y axis. Pass `class_="name"` to style SVG elements with CSS. It uses the locally stored `drawsvg` wheel, so include `"drawsvg"` in the loader's `packages` list.

`Figure3D` offers `line(points)`, `points(points)`, `vector(start, end)`, and `surface(x, y, z)`. Points are `(x, y, z)` triples, and surfaces take matching 2D grids. Set `x_range=(min, max)`, `y_range=(min, max)`, or `z_range=(min, max)` in its constructor to fix individual axis limits; leave one out for automatic limits. Lines and points accept colors and widths or sizes. Surfaces support `colorscale="Viridis"`, `"Plasma"`, or `"Gray"`. The browser updates geometry while preserving the camera and canvas. `Figure3D` needs no Python plotting package.

The site pins the [Pyodide runtime](https://pyodide.org/) and [Three.js](https://threejs.org/), which loads only for a 3D figure. A network connection is needed when a visitor first loads them. If the Python source lives outside `content/`, pass `code_path="static/path/to/file.py"` to the component so Zola can show it.

Set `axis_font_size=16` on `Figure3D` to choose axis text size in pixels (default: 14). Axis names are slightly larger than numeric ticks, and text stays the same size when zooming.
