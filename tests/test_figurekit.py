"""Contract checks for the article figure API and its rotation examples."""

import json
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [
    str(ROOT / "static/pyodide"),
    str(ROOT / "static/pyodide/drawsvg-2.4.2-py3-none-any.whl"),
    str(ROOT / "content/demo/pyodide"),
]

from figurekit import Figure2D, Figure3D  # noqa: E402
from rotation import rotation_figure  # noqa: E402
from rotation3d import rotation3d_figure  # noqa: E402


class FigureKitTests(unittest.TestCase):
    def test_2d_bounds_and_math_coordinates(self):
        result = json.loads(
            Figure2D(x_range=(-2, 3), y_range=(-1, 4))
            .line(0, 0, 1, 2, class_="sample")
            .to_json()
        )
        self.assertEqual(result["kind"], "svg")
        self.assertIn('viewBox="-2.0 -4.0 5.0 5.0"', result["svg"])
        self.assertIn('d="M0,0 L1,-2"', result["svg"])

    def test_3d_bounds_and_numpy_coordinates(self):
        import numpy as np

        result = json.loads(
            Figure3D(x_range=(-2, 3), z_range=(-4, 5))
            .line(np.array([[0, 1, 2], [3, 4, 5]]))
            .to_json()
        )
        self.assertEqual(result["kind"], "scene3d")
        self.assertEqual(result["objects"][0]["points"], [[0., 1., 2.], [3., 4., 5.]])
        self.assertEqual(result["axes"]["x"]["range"], [-2.0, 3.0])
        self.assertNotIn("range", result["axes"]["y"])
        self.assertEqual(result["axes"]["z"]["range"], [-4.0, 5.0])

    def test_bad_bounds_rejected_in_both_dimensions(self):
        for figure_type, kwargs in [
            (Figure2D, {"x_range": (2, 1)}),
            (Figure3D, {"y_range": (1, 1)}),
            (Figure3D, {"z_range": (0, float("inf"))}),
        ]:
            with self.subTest(figure=figure_type.__name__, bounds=kwargs):
                with self.assertRaises(ValueError):
                    figure_type(**kwargs)

    def test_rotation_examples_return_expected_formats(self):
        self.assertEqual(json.loads(rotation_figure(1, 2))["kind"], "svg")
        figure = json.loads(rotation3d_figure(1, 2))
        self.assertEqual(figure["kind"], "scene3d")
        self.assertEqual(figure["axes"]["x"]["range"], [-1.3, 1.3])
        end = figure["objects"][-1]["points"][0]
        self.assertAlmostEqual(
            sum(value ** 2 for value in end), 1
        )

    def test_surfaces_need_matching_grids(self):
        grid = [[0, 1], [0, 1]]
        figure = Figure3D().surface(grid, grid, grid, colorscale="Plasma")
        self.assertEqual(json.loads(figure.to_json())["objects"][0]["colorscale"], "Plasma")
        with self.assertRaises(ValueError):
            Figure3D().surface(grid, grid, [[0, 1]])
        with self.assertRaises(ValueError):
            Figure3D().points([(0, 0, float("nan"))])


if __name__ == "__main__":
    unittest.main()
