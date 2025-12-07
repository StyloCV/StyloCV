
sync:
	uv sync --all-groups --all-extras --frozen

upgrade:
	uv sync --upgrade --all-groups --all-extras

# Build application
build:
	uv build

test:
	uv run pytest

# http://127.0.0.1:8000/docs
run:
	uv run uvicorn api.main:app --reload

test:
	uv run pytest
