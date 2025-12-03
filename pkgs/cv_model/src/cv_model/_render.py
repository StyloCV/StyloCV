import json
from pathlib import Path
from typing import overload

from jinja2 import Environment, FileSystemLoader

import typst

from . import _consts, _models

__all__ = ["generate"]


def _model2typ(
    model: _models.Resume,
    template_name: _consts.TemplateName,
    output_path: Path | str,
    render_ctx: _models.RenderCtx = _models.RenderCtx(),
) -> None:
    _output_path = Path(output_path)
    jinja_env = Environment(
        loader=FileSystemLoader(_consts.TEMPLATES_FOLDER), trim_blocks=True
    )
    template = jinja_env.get_template(_consts.TEMPLATE_NAME_MAIN[template_name])
    with open(_output_path, "w", encoding="utf-8") as f:
        f.write(template.render({"resume": model, "ctx": render_ctx}))


def _model2output(
    model: _models.Resume,
    output_path: str | Path,
    template_name: _consts.TemplateName,
    render_ctx,
) -> None:
    custom_section_titles = [section.title for section in model.custom_sections]
    for section_name in render_ctx.section_order:
        if section_name in _models.DEFAULT_SECTIONS:
            continue
        if section_name not in custom_section_titles:
            raise ValueError(
                f"Section '{section_name}' not found in the resume model. "
                + "Please check the section order."
            )

    _output_path = Path(output_path)
    suffix = _output_path.name.split(".")[-1]
    _output_path.parent.mkdir(parents=True, exist_ok=True)
    if suffix == "typ":
        _model2typ(model, template_name, _output_path, render_ctx)
    elif suffix in ["pdf", "svg", "png", "html"]:
        temp_path = _output_path.with_suffix(".typ")
        _model2typ(model, template_name, temp_path, render_ctx)
        try:
            # File is already closed from the with block
            typst.compile(str(temp_path), str(output_path), format=suffix)  # type: ignore
        finally:
            temp_path.unlink()
    else:
        raise ValueError(
            "output_path must end with typ, pdf, svg, png, or html. "
            + f"Got: {_output_path.name}"
        )


@overload
def generate(
    src: _models.Resume,
    output_path: Path | str,
    template_name: _consts.TemplateName,
    render_ctx: _models.RenderCtx = _models.RenderCtx(),
) -> None: ...


@overload
def generate(
    src: str,
    output_path: Path | str,
    template_name: _consts.TemplateName,
    render_ctx: _models.RenderCtx = _models.RenderCtx(),
) -> None: ...


@overload
def generate(
    src: Path,
    output_path: Path | str,
    template_name: _consts.TemplateName,
    render_ctx: _models.RenderCtx = _models.RenderCtx(),
) -> None: ...


def generate(src, output_path, template_name, render_ctx=_models.RenderCtx()) -> None:
    """Generate a CV from a JSON string or file path.
    Args:
        src: The source JSON string or file path.
        output_path: The output file path. Could be one of the following formats:
            - typ: Typst file
            - pdf: PDF file
            - svg: SVG file
            - png: PNG file
            - html: HTML file
        template_name: The name of the template to use.
        render_ctx: The render context to use.
    """
    if not isinstance(src, _models.Resume):
        path_maybe = Path(src)
        if not (set(str(src)) & set(["{", "["])) and path_maybe.exists():
            return generate(
                path_maybe.read_text(encoding="utf-8"), output_path, template_name, render_ctx
            )
        parsed_content = json.loads(src)
        model = _models.Resume.model_validate(parsed_content)
    else:
        model = src

    custom_section_titles = [section.title for section in model.custom_sections]
    for section_name in render_ctx.section_order:
        if section_name in _models.DEFAULT_SECTIONS:
            continue
        if section_name not in custom_section_titles:
            raise ValueError(
                f"Section '{section_name}' not found in the resume model. "
                + "Please check the section order."
            )

    _model2output(
        model=model,
        output_path=output_path,
        template_name=template_name,
        render_ctx=render_ctx,
    )
