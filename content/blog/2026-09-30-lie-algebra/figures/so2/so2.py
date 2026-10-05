"""Draw SO(2) setup: robot with heading theta, sensor point p_s, world target y, and residual r."""

import numpy as np
from figurekit import Figure2D


def so2_figure(theta: float, px: float, py: float, yx: float, yy: float) -> str:
    # Rotation matrix R(theta)
    c_th, s_th = np.cos(theta), np.sin(theta)
    R = np.array([[c_th, -s_th], [s_th, c_th]])
    p_s = np.array([px, py])
    q = R @ p_s
    y_target = np.array([yx, yy])

    # Sensor frame axis directions in world coordinates
    x_s_dir = R @ np.array([0.55, 0.0])
    y_s_dir = R @ np.array([0.0, 0.55])

    # Robot chassis (wedge/triangle shape in local frame)
    chassis_local = np.array([
        [0.45, 0.0],
        [-0.22, 0.22],
        [-0.12, 0.0],
        [-0.22, -0.22],
        [0.45, 0.0]
    ])
    chassis_world = (R @ chassis_local.T).T

    # Trail of predicted point q as theta rotates
    num_pts = max(40, int(abs(theta) * 60))
    angles = np.linspace(0.0, theta, num_pts)
    trail = np.array([(np.array([[np.cos(a), -np.sin(a)], [np.sin(a), np.cos(a)]]) @ p_s) for a in angles])

    # Arc for theta angle (heading from X_w to X_s)
    r_arc = 0.4
    arc_angles = np.linspace(0.0, theta, max(30, int(abs(theta) * 40)))
    arc_pts = np.column_stack((r_arc * np.cos(arc_angles), r_arc * np.sin(arc_angles)))

    figure = Figure2D(x_range=(-2.2, 2.2), y_range=(-2.2, 2.2), id_prefix="so2")

    # World axes
    figure.line(-2.0, 0, 2.0, 0, class_="axis-world")
    figure.line(0, -2.0, 0, 2.0, class_="axis-world")
    figure.text("X_w", 2.05, -0.15, size=0.14, class_="label-world")
    figure.text("Y_w", 0.08, 2.05, size=0.14, class_="label-world")

    # Trail arc of predicted point q
    if len(trail) > 1:
        figure.polyline(trail, class_="trail-so2")

    # Angle theta arc
    if len(arc_pts) > 1:
        figure.polyline(arc_pts, class_="arc-theta")

    # Robot chassis
    figure.polyline(chassis_world, class_="robot-chassis")

    # Sensor frame axes (X_s, Y_s)
    figure.line(0, 0, x_s_dir[0], x_s_dir[1], class_="axis-xs")
    figure.line(0, 0, y_s_dir[0], y_s_dir[1], class_="axis-ys")
    figure.text("X_s", x_s_dir[0] + 0.08, x_s_dir[1] + 0.05, size=0.13, class_="label-xs")
    figure.text("Y_s", y_s_dir[0] - 0.05, y_s_dir[1] + 0.08, size=0.13, class_="label-ys")

    # Fixed Target Landmark y in world frame (Red)
    figure.circle(y_target[0], y_target[1], 0.065, class_="landmark-y", fill="#dc2626")
    figure.text("y", y_target[0] + 0.08, y_target[1] + 0.08, size=0.15, class_="label-y")

    # Vector to predicted world point q = R(theta)*p_s (Orange)
    figure.line(0, 0, q[0], q[1], class_="vector-q")
    figure.circle(q[0], q[1], 0.06, class_="point-q", fill="#f97316")
    figure.text("q", q[0] + 0.08, q[1] + 0.08, size=0.14, class_="label-q")

    # Residual vector r connecting predicted q to fixed target y (Magenta)
    figure.line(q[0], q[1], y_target[0], y_target[1], class_="vector-residual")

    # Origin point
    figure.circle(0, 0, 0.04, class_="origin", fill="currentColor")

    return figure.to_json()
