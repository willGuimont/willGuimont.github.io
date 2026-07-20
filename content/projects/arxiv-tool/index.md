+++
title = "arxiv_tool"
description = "A Python tool for preparing paper source files for arXiv submission"
date = 2025-01-01
weight = 220
[extra]
category = "Libraries"
year = 2025
source_url = "https://github.com/willGuimont/arxiv_tool"
screenshot = "project.svg"
screenshot_alt = "Illustration of a paper source tree being packaged for an arXiv submission"
+++

`arxiv_tool` is a Python command-line utility for preparing paper source trees for upload to arXiv. It packages the required submission files into a clean output directory using `arxiv-collector`.

Install it with pip:

```bash
pip install arxiv_tool
```

Then point it at a directory containing the paper sources and choose an output directory:

```bash
python -m arxiv_tool paper_src paper_out
```

The generated output can then be uploaded directly as an arXiv submission. The project is authored by William Guimont-Martin and Damien LaRocque and distributed under the MIT License.
