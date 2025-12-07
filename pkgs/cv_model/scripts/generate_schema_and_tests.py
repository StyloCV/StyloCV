import json
from pathlib import Path

import cv_model
import cv_model._consts

ROOT = Path(__file__).parent.parent
SCHEMA_ROOT = ROOT / "schemas"
RESUME_SCHEMA_PATH = SCHEMA_ROOT / cv_model._consts.RESUME_SCHEMA_NAME
CTX_SCHEMA_PATH = SCHEMA_ROOT / cv_model._consts.CTX_SCHEMA_NAME
TEST_FOLDER = ROOT / "tests"
DATA_FILES_FOLDER = TEST_FOLDER / "data_files"


def generate_resume_schema():
    """Generate the schema for the Resume model."""
    schema = cv_model._models.Resume.model_json_schema()
    with open(RESUME_SCHEMA_PATH, "w", encoding="utf-8") as f:
        f.write(json.dumps(schema, indent=2))


def generate_ctx_schema():
    """Generate the schema for the RenderCtx model."""
    schema = cv_model._models.RenderCtx.model_json_schema()
    with open(CTX_SCHEMA_PATH, "w", encoding="utf-8") as f:
        f.write(json.dumps(schema, indent=2))


def generate_test_files():
    """Generate test files for the Resume model."""
    # Generate valid resume
    with open(DATA_FILES_FOLDER / "example_resume.json", "w", encoding="utf-8") as f:
        f.write(cv_model._models.get_default_resume().model_dump_json(by_alias=True, indent=2))


if __name__ == "__main__":
    generate_resume_schema()
    print(f"Resume schema generated at {RESUME_SCHEMA_PATH}")
    generate_ctx_schema()
    print(f"Render context schema generated at {CTX_SCHEMA_PATH}")
    generate_test_files()
    print(f"Test files generated in {DATA_FILES_FOLDER}")
