"""Draw the SO(2) rotation example with NumPy and drawsvg."""

import numpy as np
import drawsvg as draw


J = np.array([[0.0, -1.0], [1.0, 0.0]])
UNIT_X = np.array([1.0, 0.0])


def rotation_svg(omega: float, time: float) -> str:
    theta = omega * time
    rotation = np.eye(2) * np.cos(theta) + J * np.sin(theta)
    endpoint = rotation @ UNIT_X

    angles = np.linspace(0.0, theta, 121)
    trail = np.column_stack((np.cos(angles), np.sin(angles)))

    drawing = draw.Drawing(2.7, 2.7, origin="center", id_prefix="rotation", aria_hidden="true")
    drawing.set_render_size(400)
    drawing.append(draw.Circle(0, 0, 1, fill="none", class_="unit-circle"))
    drawing.append(draw.Line(-1.2, 0, 1.2, 0, class_="axis"))
    drawing.append(draw.Line(0, -1.2, 0, 1.2, class_="axis"))

    # SVG's y-axis points down, so negate mathematical y coordinates.
    trail[:, 1] *= -1
    drawing.append(draw.Lines(*trail.ravel().tolist(), fill="none", class_="trail"))
    drawing.append(draw.Line(0, 0, 1, 0, class_="reference"))
    drawing.append(draw.Line(0, 0, float(endpoint[0]), -float(endpoint[1]), class_="vector"))
    drawing.append(draw.Circle(float(endpoint[0]), -float(endpoint[1]), 0.045, class_="endpoint"))
    drawing.append(draw.Circle(0, 0, 0.025, class_="origin"))
    drawing.append(draw.Text("x", 0.15, 1.15, 0.16))
    drawing.append(draw.Text("y", 0.15, 0.08, -1.14))

    return drawing.as_svg(header="")
