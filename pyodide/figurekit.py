"""Small, site-local figure API for Pyodide article demos.

Figure2D uses drawsvg; Figure3D describes a persistent browser scene. Both return a
JSON string understood by the shared /pyodide/demo.js renderer.
"""

import json
import math


def _limits(limits):
    if limits is None:
        return None
    if len(limits) != 2:
        raise ValueError("An axis range must have a minimum and maximum")
    minimum, maximum = (float(value) for value in limits)
    if not (math.isfinite(minimum) and math.isfinite(maximum) and minimum < maximum):
        raise ValueError("An axis range needs finite values with minimum < maximum")
    return [minimum, maximum]


class Figure2D:
    def __init__(
        self, width=2.7, height=2.7, *, render_size=400,
        id_prefix="figure", x_range=None, y_range=None,
    ):
        import drawsvg as draw

        x_min, x_max = _limits(x_range) or (-width / 2, width / 2)
        y_min, y_max = _limits(y_range) or (-height / 2, height / 2)
        self._draw = draw
        self._drawing = draw.Drawing(
            x_max - x_min, y_max - y_min, origin=(x_min, -y_max),
            id_prefix=id_prefix, aria_hidden="true",
        )
        self._drawing.set_render_size(render_size)

    def line(self, x1, y1, x2, y2, *, class_=""):
        self._drawing.append(
            self._draw.Line(x1, -y1, x2, -y2, class_=class_)
        )
        return self

    def polyline(self, coordinates, *, class_=""):
        points = [coordinate for x, y in coordinates for coordinate in (x, -y)]
        if points:
            self._drawing.append(
                self._draw.Lines(*points, fill="none", class_=class_)
            )
        return self

    def circle(self, x, y, radius, *, class_="", fill="none"):
        self._drawing.append(
            self._draw.Circle(x, -y, radius, fill=fill, class_=class_)
        )
        return self

    def points(self, coordinates, *, radius=0.04, class_="", fill="currentColor"):
        for x, y in coordinates:
            self.circle(x, y, radius, class_=class_, fill=fill)
        return self

    def text(self, label, x, y, *, size=0.15, class_=""):
        self._drawing.append(
            self._draw.Text(str(label), size, x, -y, class_=class_)
        )
        return self

    def to_json(self):
        return json.dumps({"kind": "svg", "svg": self._drawing.as_svg(header="")})


def _coordinates(points):
    """Convert iterable 3D points, including NumPy arrays, to JSON numbers."""
    coordinates = []
    for point in points:
        if len(point) != 3:
            raise ValueError("Each 3D point must have three coordinates")
        values = [float(value) for value in point]
        if not all(math.isfinite(value) for value in values):
            raise ValueError("3D coordinates must be finite")
        coordinates.append(values)
    return coordinates


def _axis(title, limits):
    axis = {"label": title}
    bounds = _limits(limits)
    if bounds is not None:
        axis["range"] = bounds
    return axis


class Figure3D:
    def __init__(
        self, *, x_label="x", y_label="y", z_label="z",
        x_range=None, y_range=None, z_range=None, axis_font_size=14,
    ):
        axis_font_size = float(axis_font_size)
        if not math.isfinite(axis_font_size) or axis_font_size <= 0:
            raise ValueError("axis_font_size must be a positive finite number")
        self._axis_font_size = axis_font_size
        self._objects = []
        self._axes = {
            "x": _axis(x_label, x_range),
            "y": _axis(y_label, y_range),
            "z": _axis(z_label, z_range),
        }

    def line(self, coordinates, *, color="#3996e6", width=5, name=""):
        self._objects.append({
            "type": "line", "points": _coordinates(coordinates),
            "color": color, "width": width, "name": name,
        })
        return self

    def points(self, coordinates, *, color="#3996e6", size=5, name=""):
        self._objects.append({
            "type": "points", "points": _coordinates(coordinates),
            "color": color, "size": size, "name": name,
        })
        return self

    def vector(self, start, end, *, color="#3996e6", width=7, name=""):
        self.line((start, end), color=color, width=width, name=name)
        self.points((end,), color=color, size=6, name=name)
        return self

    def surface(self, x, y, z, *, colorscale="Viridis", name=""):
        grids = [[[float(value) for value in row] for row in grid] for grid in (x, y, z)]
        rows = len(grids[2])
        columns = len(grids[2][0]) if rows else 0
        if rows < 2 or columns < 2 or any(
            len(grid) != rows or any(len(row) != columns for row in grid) for grid in grids
        ):
            raise ValueError("A surface needs matching grids with at least two rows and columns")
        if not all(math.isfinite(value) for grid in grids for row in grid for value in row):
            raise ValueError("Surface coordinates must be finite")
        if colorscale not in ("Viridis", "Plasma", "Gray"):
            raise ValueError("Supported colorscales: Viridis, Plasma, Gray")
        self._objects.append({
            "type": "surface",
            "x": grids[0], "y": grids[1], "z": grids[2],
            "colorscale": colorscale,
            "name": name,
        })
        return self

    def to_json(self):
        return json.dumps({
            "kind": "scene3d", "objects": self._objects, "axes": self._axes,
            "axis_font_size": self._axis_font_size
        }, allow_nan=False)
