import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL

genai.configure(api_key=GEMINI_API_KEY)

_model = genai.GenerativeModel(GEMINI_MODEL)


async def generate(prompt: str) -> str:
    response = await _model.generate_content_async(prompt)
    return response.text
