"""Rotate a unit vector around the (1, 1, 1) axis in three dimensions."""

import numpy as np
from figurekit import Figure3D


AXIS = np.ones(3) / np.sqrt(3)
UNIT_X = np.array([1.0, 0.0, 0.0])


def rotate(angle):
    """Rodrigues' formula for rotation around AXIS."""
    return (
        UNIT_X * np.cos(angle)
        + np.cross(AXIS, UNIT_X) * np.sin(angle)
        + AXIS * np.dot(AXIS, UNIT_X) * (1 - np.cos(angle))
    )


def rotation3d_figure(omega: float, time: float) -> str:
    angle = omega * time
    endpoint = rotate(angle)
    trail = [rotate(value) for value in np.linspace(0, angle, 121)]

    figure = Figure3D(x_range=(-1.3, 1.3), y_range=(-1.3, 1.3), z_range=(-1.3, 1.3))
    figure.line((-1.3 * AXIS, 1.3 * AXIS), color="#888888", width=3, name="Rotation axis")
    figure.vector((0, 0, 0), UNIT_X, color="#888888", width=4, name="Initial vector")
    figure.line(trail, color="#dd8540", width=5, name="Trajectory")
    figure.vector((0, 0, 0), endpoint, name="Rotated vector")
    return figure.to_json()
