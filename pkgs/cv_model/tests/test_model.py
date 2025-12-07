from pathlib import Path

import pytest

import cv_model as cv

DATA_FOLDER = Path(__file__).parent / "data_files"


def test_valid_resume_model():
    """Test the Resume model with valid data."""
    cv.Resume.model_validate_json(
        (DATA_FOLDER / "valid_resume.json").read_text(encoding="utf-8")
    )


def test_render_file_from_json(tmp_path: Path):
    """Test the rendering of a JSON resume."""
    cv.generate(
        src=DATA_FOLDER / "example_resume.json",
        output_path=tmp_path / "json_output.pdf",
        output_format="pdf",
        template_name="fantastic-cv",
    )
    assert (tmp_path / "json_output.pdf").exists()


def test_render_bytes_from_json():
    """Test the rendering of a JSON resume."""
    rendered_content = cv.generate(
        src=DATA_FOLDER / "example_resume.json",
        output_path=None,
        output_format="pdf",
        template_name="fantastic-cv",
    )
    assert rendered_content is not None
    assert isinstance(rendered_content, bytes)


def test_load_json():
    """Test loading a json resume."""
    loaded = cv.Resume.load(cv.get_default_resume().model_dump_json(indent=2, by_alias=True))
    assert loaded == cv.get_default_resume()


@pytest.mark.parametrize(
    "ext", ["typ", "pdf"]
)  # svg and png does not support multi-page yet ...
def test_render_file_from_model(tmp_path: Path, ext: cv.OutputFormat) -> None:
    cv.generate(
        cv.get_default_resume(),
        output_path=tmp_path / f"test.{ext}",
        output_format=ext,
        template_name="fantastic-cv",
    )


def test_render_bytes_from_model():
    """Test the rendering of a JSON resume."""
    rendered_content = cv.generate(
        cv.get_default_resume(),
        output_path=None,
        output_format="pdf",
        template_name="fantastic-cv",
    )
    assert rendered_content is not None
    assert isinstance(rendered_content, bytes)
