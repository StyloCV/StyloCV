import tempfile
from pathlib import Path
from typing import Literal, overload

from jinja2 import Environment, FileSystemLoader

try:
    import typst

    TYPST_AVAILABLE = True
except ImportError:
    TYPST_AVAILABLE = False

from . import _consts, _models


def _model2typ(
    model: _models.Resume,
    template_name: _consts.TemplateName,
    render_ctx: _models.RenderCtx = _models.RenderCtx(),
) -> str:
    jinja_env = Environment(
        loader=FileSystemLoader(_consts.TEMPLATES_FOLDER), trim_blocks=True
    )
    template = jinja_env.get_template(_consts.TEMPLATE_NAME_MAIN[template_name])
    return template.render({"resume": model, "ctx": render_ctx})


OutputFormat = Literal["typ", "pdf", "svg", "png", "html"]
"""Supported output formats for CV generation.

- typ: Typst source file
- pdf: Portable Document Format
- svg: Scalable Vector Graphics
- png: Portable Network Graphics
- html: HyperText Markup Language
"""


def generate_typ_fm_model(
    model: _models.Resume | str,
    template_name: _consts.TemplateName = "fantastic-cv",
    render_ctx=_models.RenderCtx(),
) -> str:
    """Generates a Typst script from a Resume model or JSON string.

    Args:
        model: The Resume model or JSON string.
        template_name: The name of the template to use. Defaults to "fantastic-cv".
        render_ctx: The rendering context with additional styling options.
    Returns:
        The generated Typst script as a string.

    """
    if isinstance(model, (str, Path)):
        _model = _models.Resume.model_validate_json(model)
    elif isinstance(model, _models.Resume):
        _model = model
    else:
        raise ValueError("src must be either a Resume model or a json string.")

    custom_section_titles = [section.title for section in _model.custom_sections]
    for section_name in render_ctx.section_order:
        if section_name in _models.DEFAULT_SECTIONS:
            continue
        if section_name not in custom_section_titles:
            raise ValueError(
                f"Section '{section_name}' not found in the resume model. "
                + "Please check the section order."
            )
    jinja_env = Environment(
        loader=FileSystemLoader(_consts.TEMPLATES_FOLDER), trim_blocks=True
    )
    template = jinja_env.get_template(_consts.TEMPLATE_NAME_MAIN[template_name])
    return template.render({"resume": _model, "ctx": render_ctx})


@overload
def generate(
    src: _models.Resume,
    output_path: Path | str,
    output_format: OutputFormat,
    template_name: _consts.TemplateName = "fantastic-cv",
    render_ctx: _models.RenderCtx = _models.RenderCtx(),
) -> None: ...


@overload
def generate(
    src: _models.Resume,
    output_path: None,
    output_format: OutputFormat,
    template_name: _consts.TemplateName = "fantastic-cv",
    render_ctx: _models.RenderCtx = _models.RenderCtx(),
) -> bytes: ...


@overload
def generate(
    src: Path | str,
    output_path: Path | str,
    output_format: OutputFormat,
    template_name: _consts.TemplateName = "fantastic-cv",
    render_ctx: _models.RenderCtx = _models.RenderCtx(),
) -> None: ...


@overload
def generate(
    src: Path | str,
    output_path: None,
    output_format: OutputFormat,
    template_name: _consts.TemplateName = "fantastic-cv",
    render_ctx: _models.RenderCtx = _models.RenderCtx(),
) -> bytes: ...


def generate(
    src,
    output_path,
    output_format,
    template_name: _consts.TemplateName = "fantastic-cv",
    render_ctx=_models.RenderCtx(),
) -> bytes | None:
    """Generates a CV document from a Resume model or JSON file.

    Args:
        src: The content source, either as a Resume model or a path to a JSON file.
        output_path: The path to save the generated document, or None to return bytes.
        output_format: The desired output format (typ, pdf, svg, png, html).
        template_name: The name of the template to use. Defaults to "fantastic-cv".
        render_ctx: The rendering context with additional styling options.

    Returns:
        Bytes of the generated document if output_path is None, otherwise None.
    """
    if isinstance(src, (str, Path)):
        _src = Path(src)
        suffix = _src.suffix.lstrip(".")
        if suffix != "json":
            raise ValueError("src must be a json file.")
        model = _models.Resume.model_validate_json(_src.read_text(encoding="utf-8"))
    elif isinstance(src, _models.Resume):
        model = src
    else:
        raise ValueError("src must be either a Resume model or a path to a json file.")

    custom_section_titles = [section.title for section in model.custom_sections]
    for section_name in render_ctx.section_order:
        if section_name in _models.DEFAULT_SECTIONS:
            continue
        if section_name not in custom_section_titles:
            raise ValueError(
                f"Section '{section_name}' not found in the resume model. "
                + "Please check the section order."
            )

    if output_format == "typ":
        # This case doesn't make sense for in-memory generation
        if output_path is None:
            raise ValueError("output_path must be provided for typ output.")
        typst_script = _model2typ(model, template_name, render_ctx)
        _output_path = Path(output_path)
        if not _output_path.name.endswith(".typ"):
            raise ValueError(f"output_path must end with .typ. Got: {output_path}")
        _output_path.parent.mkdir(parents=True, exist_ok=True)
        _output_path.write_text(typst_script, encoding="utf-8")
        return None

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir) / "resume.typ"

        typst_script = _model2typ(model, template_name, render_ctx)
        temp_path.write_text(typst_script, encoding="utf-8")
        # Compile to memory
        if not TYPST_AVAILABLE:
            raise ImportError(
                "typst package is not available. Please install it to generate non-typ outputs."
            )
        result = typst.compile(str(temp_path), format=output_format)  # type: ignore
        if output_path is not None:
            # If path is provided, write to it
            _output_path = Path(output_path)
            if not _output_path.name.endswith(output_format):
                raise ValueError(
                    f"output_path must end with {output_format}. Got: {output_path}"
                )
            _output_path.parent.mkdir(parents=True, exist_ok=True)
            _output_path.write_bytes(result)
            return None
        # Otherwise, return the bytes
        return result
