# Usage Example

```python
from pathlib import Path

import cv_model as cv

# validation

with open(DATA_FOLDER / "valid_resume.json", "r", encoding="utf-8") as f:
    content = f.read()

cv.Resume.model_validate_json(content)
loaded = cv.Resume.load(cv.get_default_resume().model_dump_json(indent=2, by_alias=True))

# generation

TYP_PATH = Path(__file__).parent / "example.typ"
cv.generate(cv.get_default_resume(), TYP_PATH, "fantastic-cv")
print(f"Generated example.typ at {TYP_PATH}")
PDF_PATH = Path(__file__).parent / "example.pdf"
cv.generate(cv.get_default_resume(), PDF_PATH, "fantastic-cv")
print(f"Generated example.pdf at {PDF_PATH}")
```
