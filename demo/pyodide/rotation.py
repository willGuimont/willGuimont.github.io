"""Draw the SO(2) rotation example with NumPy and Figure2D."""

import numpy as np
from figurekit import Figure2D


J = np.array([[0.0, -1.0], [1.0, 0.0]])
UNIT_X = np.array([1.0, 0.0])


def rotation_figure(omega: float, time: float) -> str:
    theta = omega * time
    rotation = np.eye(2) * np.cos(theta) + J * np.sin(theta)
    endpoint = rotation @ UNIT_X

    angles = np.linspace(0.0, theta, 121)
    trail = np.column_stack((np.cos(angles), np.sin(angles)))

    figure = Figure2D(x_range=(-1.35, 1.35), y_range=(-1.35, 1.35), id_prefix="rotation")
    figure.circle(0, 0, 1, class_="unit-circle")
    figure.line(-1.2, 0, 1.2, 0, class_="axis")
    figure.line(0, -1.2, 0, 1.2, class_="axis")
    figure.polyline(trail, class_="trail")
    figure.line(0, 0, 1, 0, class_="reference")
    figure.line(0, 0, endpoint[0], endpoint[1], class_="vector")
    figure.circle(endpoint[0], endpoint[1], 0.045, class_="endpoint", fill="#3996e6")
    figure.circle(0, 0, 0.025, class_="origin", fill="currentColor")
    figure.text("x", 1.15, -0.16)
    figure.text("y", 0.08, 1.14)
    return figure.to_json()
