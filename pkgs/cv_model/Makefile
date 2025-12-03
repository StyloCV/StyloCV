
sync:
	uv sync --all-groups --all-extras --frozen

upgrade:
	uv sync --upgrade --all-groups --all-extras

# Build application
build:
	uv build

generate:
	uv run scripts/generate_schema_and_tests.py

test:
	uv run pytest

example:
	uv run examples/main.py

# Format code
format:
	uvx ruff format
