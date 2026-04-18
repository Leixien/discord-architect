import os
from dotenv import load_dotenv

load_dotenv()

DISCORD_TOKEN: str = os.environ["DISCORD_TOKEN"]
GEMINI_API_KEY: str = os.environ["GEMINI_API_KEY"]
SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_ANON_KEY: str = os.environ.get("SUPABASE_ANON_KEY") or os.environ["SUPABASE_KEY"]

GEMINI_MODEL: str = "gemini-2.0-flash"
