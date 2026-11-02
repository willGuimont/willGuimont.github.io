"""Draw SO(3) setup: 3D robot orientation R in SO(3), sensor point p_s, world target y, and residual r."""

import numpy as np
from figurekit import Figure3D


def euler_to_R(roll: float, pitch: float, yaw: float) -> np.ndarray:
    """Compute ZYX Euler angle rotation matrix."""
    Rx = np.array([
        [1.0, 0.0, 0.0],
        [0.0, np.cos(roll), -np.sin(roll)],
        [0.0, np.sin(roll), np.cos(roll)]
    ])
    Ry = np.array([
        [np.cos(pitch), 0.0, np.sin(pitch)],
        [0.0, 1.0, 0.0],
        [-np.sin(pitch), 0.0, np.cos(pitch)]
    ])
    Rz = np.array([
        [np.cos(yaw), -np.sin(yaw), 0.0],
        [np.sin(yaw), np.cos(yaw), 0.0],
        [0.0, 0.0, 1.0]
    ])
    return Rz @ Ry @ Rx


def so3_figure(
    roll: float, pitch: float, yaw: float,
    px: float, py: float, pz: float,
    yx: float, yy: float, yz: float
) -> str:
    R = euler_to_R(roll, pitch, yaw)
    p_s = np.array([px, py, pz])
    q = R @ p_s
    y_target = np.array([yx, yy, yz])

    figure = Figure3D(
        x_range=(-2.2, 2.2), y_range=(-2.2, 2.2), z_range=(-2.2, 2.2),
        x_label="X_w", y_label="Y_w", z_label="Z_w"
    )

    # World reference frame axes at origin (gray)
    figure.vector((0, 0, 0), (1.5, 0, 0), color="#888888", width=3, name="World X_w")
    figure.vector((0, 0, 0), (0, 1.5, 0), color="#888888", width=3, name="World Y_w")
    figure.vector((0, 0, 0), (0, 0, 1.5), color="#888888", width=3, name="World Z_w")

    # Robot chassis wireframe in local frame rotated by R (Sky Blue)
    nose = np.array([0.55, 0.0, 0.0])
    rl_top = np.array([-0.3, 0.25, 0.15])
    rr_top = np.array([-0.3, -0.25, 0.15])
    rl_bot = np.array([-0.3, 0.25, -0.15])
    rr_bot = np.array([-0.3, -0.25, -0.15])

    vertices = [R @ v for v in [nose, rl_top, rr_top, rl_bot, rr_bot]]
    n_w, rlt_w, rrt_w, rlb_w, rrb_w = vertices

    edges = [
        (n_w, rlt_w), (n_w, rrt_w), (n_w, rlb_w), (n_w, rrb_w),
        (rlt_w, rrt_w), (rrt_w, rrb_w), (rrb_w, rlb_w), (rlb_w, rlt_w)
    ]
    for start, end in edges:
        figure.line((start, end), color="#0284c7", width=4, name="Robot Chassis")

    # Sensor frame axes rotated by R (Red, Green, Blue)
    x_s = R @ np.array([0.85, 0.0, 0.0])
    y_s = R @ np.array([0.0, 0.85, 0.0])
    z_s = R @ np.array([0.0, 0.0, 0.85])

    figure.vector((0, 0, 0), x_s, color="#ef4444", width=6, name="Sensor X_s")
    figure.vector((0, 0, 0), y_s, color="#22c55e", width=6, name="Sensor Y_s")
    figure.vector((0, 0, 0), z_s, color="#3b82f6", width=6, name="Sensor Z_s")

    # Fixed Target Landmark y in world frame (Crimson Red)
    figure.points([y_target], color="#dc2626", size=10, name=f"Target Landmark y = ({y_target[0]:.2f}, {y_target[1]:.2f}, {y_target[2]:.2f})")

    # Vector to predicted world point q = R * p_s (Orange)
    figure.vector((0, 0, 0), q, color="#f97316", width=6, name=f"Predicted Point q = ({q[0]:.2f}, {q[1]:.2f}, {q[2]:.2f})")
    figure.points([q], color="#f97316", size=8, name="Predicted Point q")

    # Residual line connecting q to target y (Vivid Magenta)
    figure.line((q, y_target), color="#d946ef", width=5, name="Residual Error Vector r")

    return figure.to_json()
