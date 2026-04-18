import logging
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY, SUPABASE_BUILDS_TABLE

logger = logging.getLogger(__name__)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

TICKETS_TABLE = "tickets"
TICKET_CONFIG_TABLE = "ticket_config"


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


def get_ticket_config(guild_id: int) -> dict | None:
    try:
        res = supabase.table(TICKET_CONFIG_TABLE).select("*").eq("guild_id", guild_id).single().execute()
        return res.data
    except Exception:
        return None


def upsert_ticket_config(guild_id: int, staff_role_id: int, category_id: int | None = None) -> None:
    try:
        supabase.table(TICKET_CONFIG_TABLE).upsert({
            "guild_id": guild_id,
            "staff_role_id": staff_role_id,
            "category_id": category_id,
        }).execute()
    except Exception as e:
        logger.error("Supabase upsert_ticket_config error: %s", e)


def get_open_ticket(guild_id: int, user_id: int) -> dict | None:
    try:
        res = (
            supabase.table(TICKETS_TABLE)
            .select("*")
            .eq("guild_id", guild_id)
            .eq("user_id", user_id)
            .eq("status", "open")
            .limit(1)
            .execute()
        )
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error("Supabase get_open_ticket error: %s", e)
        return None


def create_ticket(
    guild_id: int,
    user_id: int,
    channel_id: int,
    subject: str,
    description: str,
    priority: str,
) -> dict | None:
    try:
        res = supabase.table(TICKETS_TABLE).insert({
            "guild_id": guild_id,
            "user_id": user_id,
            "channel_id": channel_id,
            "subject": subject,
            "description": description,
            "priority": priority,
        }).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error("Supabase create_ticket error: %s", e)
        return None


def get_ticket_by_channel(channel_id: int) -> dict | None:
    try:
        res = (
            supabase.table(TICKETS_TABLE)
            .select("*")
            .eq("channel_id", channel_id)
            .eq("status", "open")
            .single()
            .execute()
        )
        return res.data
    except Exception:
        return None


def close_ticket(ticket_id: int, closed_by: int, reason: str | None = None) -> None:
    try:
        from datetime import datetime, timezone
        supabase.table(TICKETS_TABLE).update({
            "status": "closed",
            "closed_at": datetime.now(timezone.utc).isoformat(),
            "closed_by": closed_by,
            "close_reason": reason,
        }).eq("id", ticket_id).execute()
    except Exception as e:
        logger.error("Supabase close_ticket error: %s", e)


def close_ticket_by_channel(channel_id: int, closed_by: int, reason: str | None = None) -> None:
    try:
        from datetime import datetime, timezone
        supabase.table(TICKETS_TABLE).update({
            "status": "closed",
            "closed_at": datetime.now(timezone.utc).isoformat(),
            "closed_by": closed_by,
            "close_reason": reason,
        }).eq("channel_id", channel_id).eq("status", "open").execute()
    except Exception as e:
        logger.error("Supabase close_ticket_by_channel error: %s", e)
