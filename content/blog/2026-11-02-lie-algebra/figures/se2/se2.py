"""Draw SE(2) setup: robot pose T=(x, y, theta), sensor point p_s, world target y, and residual r."""

import numpy as np
from figurekit import Figure2D


def se2_figure(x: float, y: float, theta: float, px: float, py: float, yx: float, yy: float) -> str:
    # Pose: translation t and rotation R
    t = np.array([x, y])
    c_th, s_th = np.cos(theta), np.sin(theta)
    R = np.array([[c_th, -s_th], [s_th, c_th]])
    p_s = np.array([px, py])
    q = R @ p_s + t
    y_target = np.array([yx, yy])

    # Sensor frame axis vectors in world frame
    x_s_dir = t + R @ np.array([0.55, 0.0])
    y_s_dir = t + R @ np.array([0.0, 0.55])

    # Robot chassis (wedge/triangle shape in local frame)
    chassis_local = np.array([
        [0.45, 0.0],
        [-0.22, 0.22],
        [-0.12, 0.0],
        [-0.22, -0.22],
        [0.45, 0.0]
    ])
    chassis_world = (R @ chassis_local.T).T + t

    figure = Figure2D(x_range=(-3.0, 3.0), y_range=(-3.0, 3.0), id_prefix="se2")

    # World axes
    figure.line(-2.7, 0, 2.7, 0, class_="axis-world")
    figure.line(0, -2.7, 0, 2.7, class_="axis-world")
    figure.text("X_w", 2.75, -0.18, size=0.15, class_="label-world")
    figure.text("Y_w", 0.08, 2.75, size=0.15, class_="label-world")

    # Robot chassis
    figure.polyline(chassis_world, class_="robot-chassis")

    # Vector t from world origin to robot position
    if np.linalg.norm(t) > 0.05:
        figure.line(0, 0, t[0], t[1], class_="vector-t")
        figure.text("t", t[0] * 0.5 - 0.15, t[1] * 0.5 + 0.15, size=0.14, class_="label-t")

    # Sensor frame axes (X_s, Y_s)
    figure.line(t[0], t[1], x_s_dir[0], x_s_dir[1], class_="axis-xs")
    figure.line(t[0], t[1], y_s_dir[0], y_s_dir[1], class_="axis-ys")
    figure.text("X_s", x_s_dir[0] + 0.08, x_s_dir[1] + 0.05, size=0.13, class_="label-xs")
    figure.text("Y_s", y_s_dir[0] - 0.05, y_s_dir[1] + 0.08, size=0.13, class_="label-ys")

    # Fixed Target Landmark y in world frame (Red)
    figure.circle(y_target[0], y_target[1], 0.065, class_="landmark-y", fill="#dc2626")
    figure.text("y", y_target[0] + 0.08, y_target[1] + 0.08, size=0.15, class_="label-y")

    # Vector from robot to predicted q (R * p_s)
    figure.line(t[0], t[1], q[0], q[1], class_="vector-local-p")

    # Vector from world origin to q (Orange)
    figure.line(0, 0, q[0], q[1], class_="vector-q")
    figure.circle(q[0], q[1], 0.06, class_="point-q", fill="#f97316")
    figure.text("q", q[0] + 0.08, q[1] + 0.08, size=0.15, class_="label-q")

    # Residual vector r connecting predicted point q to fixed target y (Magenta)
    figure.line(q[0], q[1], y_target[0], y_target[1], class_="vector-residual")

    # World origin & Robot origin points
    figure.circle(0, 0, 0.04, class_="origin", fill="currentColor")
    figure.circle(t[0], t[1], 0.045, class_="robot-origin", fill="#0284c7")

    return figure.to_json()
