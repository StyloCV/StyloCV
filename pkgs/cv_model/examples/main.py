from pathlib import Path

import cv_model as cv

TYP_PATH = Path(__file__).parent / "example.typ"
cv.generate(cv.get_default_resume(), TYP_PATH, "fantastic-cv")
print(f"Generated example.typ at {TYP_PATH}")
PDF_PATH = Path(__file__).parent / "example.pdf"
cv.generate(cv.get_default_resume(), PDF_PATH, "fantastic-cv")
print(f"Generated example.pdf at {PDF_PATH}")
