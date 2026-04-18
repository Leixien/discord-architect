import logging
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY, SUPABASE_BUILDS_TABLE

logger = logging.getLogger(__name__)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def save_server_build(
    guild_id: str,
    user_id: str,
    description: str,
    structure: dict,
) -> None:
    try:
        supabase.table(SUPABASE_BUILDS_TABLE).insert({
            "guild_id": guild_id,
            "user_id": user_id,
            "description": description,
            "structure": structure,
        }).execute()
    except Exception as e:
        logger.error("Supabase save_server_build error: %s", e)
