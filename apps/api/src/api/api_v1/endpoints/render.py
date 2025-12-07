# Force re-lint

from cv_model import RenderCtx, Resume, generate
from fastapi import APIRouter, HTTPException, Response

router = APIRouter()


@router.post("/")
def render_resume(resume: Resume) -> Response:
    """Accepts a resume JSON, generates a PDF using the cv_model package, and returns the
    PDF as a response.
    """
    pdf_bytes = generate(
        src=resume,
        output_path=None,
        output_format="pdf",
        template_name="fantastic-cv",
        render_ctx=RenderCtx(),
    )

    if pdf_bytes is None:
        # This should not happen if output_path is None, but it's good practice
        # to handle it, perhaps by raising an internal server error.
        raise HTTPException(
            status_code=500, detail="Internal server error: PDF generation failed."
        )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "inline; filename=resume.pdf"},
    )
