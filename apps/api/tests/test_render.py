from api.main import app
from cv_model import get_default_resume
from fastapi.testclient import TestClient

# The TestClient simulates requests to your application.
client = TestClient(app)


def test_render_resume_success():
    """
    Tests the /api/v1/render endpoint with valid resume data.
    """
    # Use the default resume from the cv_model package as valid test data
    resume_data = get_default_resume().model_dump(by_alias=True, mode="json")

    # Make a POST request to the endpoint
    response = client.post("/api/v1/render", json=resume_data)

    # Assert the response is what we expect
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    # A simple check to see if the response content looks like a PDF
    assert response.content.startswith(b"%PDF-")


def test_render_resume_with_invalid_data():
    """
    Tests that the endpoint returns a 422 Unprocessable Entity error
    if the JSON data doesn't match the Resume model.
    """
    invalid_resume_data = {"name": "John Doe", "this_is_a_wrong_field": "value"}

    response = client.post("/api/v1/render", json=invalid_resume_data)

    assert response.status_code == 422
