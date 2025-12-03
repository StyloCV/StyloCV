from pathlib import Path

import pytest

import cv_model as cv

DATA_FOLDER = Path(__file__).parent / "data_files"


def test_valid_resume_model():
    """Test the Resume model with valid data."""
    with open(DATA_FOLDER / "valid_resume.json", "r", encoding="utf-8") as f:
        content = f.read()

    cv.Resume.model_validate_json(content)


def test_render_json(tmp_path: Path):
    """Test the rendering of a JSON resume."""
    cv.generate(
        DATA_FOLDER / "example_resume.json", tmp_path / "json_output.pdf", "fantastic-cv"
    )
    assert (tmp_path / "json_output.pdf").exists()


def test_load_json():
    """Test loading a json resume."""
    loaded = cv.Resume.load(cv.get_default_resume().model_dump_json(indent=2, by_alias=True))
    assert loaded == cv.get_default_resume()


@pytest.mark.parametrize(
    "ext", ["typ", "pdf"]
)  # svg and png does not support multi-page yet ...
def test_generate(tmp_path: Path, ext: str) -> None:
    cv.generate(cv.get_default_resume(), tmp_path / f"test.{ext}", "fantastic-cv")
