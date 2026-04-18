import asyncio
import logging
import discord
from discord.ext import commands
from discord import app_commands

from services.supabase_client import (
    get_ticket_config,
    upsert_ticket_config,
    get_open_ticket,
    create_ticket,
    get_ticket_by_channel,
    close_ticket_by_channel,
)

logger = logging.getLogger(__name__)

VALID_PRIORITIES = {"bassa", "media", "alta"}
PRIORITY_COLOR = {"bassa": discord.Color.green(), "media": discord.Color.orange(), "alta": discord.Color.red()}


def _priority_label(p: str) -> str:
    return {"bassa": "🟢 Bassa", "media": "🟡 Media", "alta": "🔴 Alta"}.get(p, p)


class CloseReasonModal(discord.ui.Modal, title="Chiudi ticket"):
    reason = discord.ui.TextInput(
        label="Motivo chiusura (opzionale)",
        style=discord.TextStyle.paragraph,
        required=False,
        max_length=300,
        placeholder="Es. problema risolto, richiesta completata...",
    )

    def __init__(self, ticket: dict, channel: discord.TextChannel) -> None:
        super().__init__()
        self.ticket = ticket
        self.channel = channel

    async def on_submit(self, interaction: discord.Interaction) -> None:
        await interaction.response.defer(ephemeral=True)
        close_ticket_by_channel(
            channel_id=self.channel.id,
            closed_by=interaction.user.id,
            reason=self.reason.value or None,
        )
        await interaction.followup.send("Ticket chiuso. Il canale verrà eliminato tra 10 secondi.", ephemeral=True)

        embed = discord.Embed(
            title="🔒 Ticket chiuso",
            description=f"Chiuso da {interaction.user.mention}" + (f"\nMotivo: {self.reason.value}" if self.reason.value else ""),
            color=discord.Color.dark_grey(),
        )
        await self.channel.send(embed=embed)
        await asyncio.sleep(10)
        try:
            await self.channel.delete(reason="Ticket chiuso")
        except discord.NotFound:
            pass


class CloseTicketView(discord.ui.View):
    def __init__(self) -> None:
        super().__init__(timeout=None)

    @discord.ui.button(
        label="Chiudi ticket",
        style=discord.ButtonStyle.danger,
        emoji="🔒",
        custom_id="ticket_close",
    )
    async def chiudi(self, interaction: discord.Interaction, button: discord.ui.Button) -> None:
        if not isinstance(interaction.channel, discord.TextChannel):
            return

        ticket = get_ticket_by_channel(interaction.channel.id)
        if not ticket:
            await interaction.response.send_message("Ticket non trovato o già chiuso.", ephemeral=True)
            return

        config = get_ticket_config(interaction.guild.id) if interaction.guild else None
        is_staff = False
        if config and interaction.guild:
            staff_role = interaction.guild.get_role(config["staff_role_id"])
            if staff_role and isinstance(interaction.user, discord.Member):
                is_staff = staff_role in interaction.user.roles

        if not is_staff and not (isinstance(interaction.user, discord.Member) and interaction.user.guild_permissions.manage_channels):
            await interaction.response.send_message("Solo lo staff può chiudere i ticket.", ephemeral=True)
            return

        await interaction.response.send_modal(CloseReasonModal(ticket=ticket, channel=interaction.channel))


class TicketOpenModal(discord.ui.Modal, title="Apri un ticket"):
    subject = discord.ui.TextInput(
        label="Oggetto",
        placeholder="Descrivi brevemente il problema o la richiesta",
        style=discord.TextStyle.short,
        required=True,
        max_length=100,
    )
    description = discord.ui.TextInput(
        label="Descrizione dettagliata",
        placeholder="Spiega nel dettaglio cosa ti serve...",
        style=discord.TextStyle.paragraph,
        required=True,
        max_length=1000,
    )
    priority = discord.ui.TextInput(
        label="Priorità (bassa / media / alta)",
        placeholder="media",
        style=discord.TextStyle.short,
        required=False,
        max_length=5,
        default="media",
    )

    async def on_submit(self, interaction: discord.Interaction) -> None:
        if not interaction.guild or not isinstance(interaction.user, discord.Member):
            await interaction.response.send_message("Comando disponibile solo in un server.", ephemeral=True)
            return

        priority_val = (self.priority.value or "media").lower().strip()
        if priority_val not in VALID_PRIORITIES:
            await interaction.response.send_message(
                "Priorità non valida. Usa: `bassa`, `media` o `alta`.", ephemeral=True
            )
            return

        existing = get_open_ticket(interaction.guild.id, interaction.user.id)
        if existing:
            channel = interaction.guild.get_channel(existing["channel_id"])
            ref = channel.mention if channel else f"(canale rimosso, ID: {existing['channel_id']})"
            await interaction.response.send_message(
                f"Hai già un ticket aperto: {ref}", ephemeral=True
            )
            return

        await interaction.response.defer(ephemeral=True)

        config = get_ticket_config(interaction.guild.id)
        if not config:
            await interaction.followup.send(
                "Il sistema ticket non è configurato. Un admin deve eseguire `/ticket setup`.", ephemeral=True
            )
            return

        staff_role = interaction.guild.get_role(config["staff_role_id"])

        category: discord.CategoryChannel | None = None
        if config.get("category_id"):
            category = interaction.guild.get_channel(config["category_id"])  # type: ignore

        if not category:
            try:
                category = await interaction.guild.create_category("TICKETS")
                upsert_ticket_config(
                    guild_id=interaction.guild.id,
                    staff_role_id=config["staff_role_id"],
                    category_id=category.id,
                )
            except Exception as e:
                logger.error("Errore creazione categoria TICKETS: %s", e)
                await interaction.followup.send("Errore nella creazione della categoria ticket.", ephemeral=True)
                return

        channel_name = f"ticket-{interaction.user.name}".lower().replace(" ", "-")[:50]

        overwrites: dict = {
            interaction.guild.default_role: discord.PermissionOverwrite(view_channel=False),
            interaction.user: discord.PermissionOverwrite(view_channel=True, send_messages=True, read_message_history=True),
            interaction.guild.me: discord.PermissionOverwrite(view_channel=True, send_messages=True, manage_channels=True),
        }
        if staff_role:
            overwrites[staff_role] = discord.PermissionOverwrite(
                view_channel=True, send_messages=True, read_message_history=True, manage_channels=True
            )

        try:
            channel = await category.create_text_channel(channel_name, overwrites=overwrites)
        except Exception as e:
            logger.error("Errore creazione canale ticket: %s", e)
            await interaction.followup.send("Errore nella creazione del canale ticket.", ephemeral=True)
            return

        ticket = create_ticket(
            guild_id=interaction.guild.id,
            user_id=interaction.user.id,
            channel_id=channel.id,
            subject=self.subject.value,
            description=self.description.value,
            priority=priority_val,
        )

        embed = discord.Embed(
            title=f"🎫 Ticket — {self.subject.value}",
            color=PRIORITY_COLOR.get(priority_val, discord.Color.blurple()),
        )
        embed.add_field(name="Utente", value=interaction.user.mention, inline=True)
        embed.add_field(name="Priorità", value=_priority_label(priority_val), inline=True)
        embed.add_field(name="Descrizione", value=self.description.value, inline=False)
        embed.set_footer(text="Usa il bottone qui sotto per chiudere il ticket.")

        view = CloseTicketView()
        await channel.send(embed=embed, view=view)
        await interaction.followup.send(f"Ticket aperto: {channel.mention}", ephemeral=True)

    async def on_error(self, interaction: discord.Interaction, error: Exception) -> None:
        logger.error("TicketOpenModal error: %s", error)
        if not interaction.response.is_done():
            await interaction.response.send_message("Si è verificato un errore. Riprova.", ephemeral=True)


class TicketsCog(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot

    ticket = app_commands.Group(name="ticket", description="Sistema ticket")

    @ticket.command(name="open", description="Apri un nuovo ticket di supporto")
    async def ticket_open(self, interaction: discord.Interaction) -> None:
        await interaction.response.send_modal(TicketOpenModal())

    @ticket.command(name="setup", description="Configura il sistema ticket (solo admin)")
    @app_commands.default_permissions(manage_guild=True)
    @app_commands.describe(ruolo="Ruolo staff che gestisce i ticket")
    async def ticket_setup(self, interaction: discord.Interaction, ruolo: discord.Role) -> None:
        if not interaction.guild:
            return
        upsert_ticket_config(guild_id=interaction.guild.id, staff_role_id=ruolo.id)
        await interaction.response.send_message(
            f"Sistema ticket configurato. Staff: {ruolo.mention}", ephemeral=True
        )

    @commands.Cog.listener()
    async def on_guild_channel_delete(self, channel: discord.abc.GuildChannel) -> None:
        if isinstance(channel, discord.TextChannel):
            close_ticket_by_channel(channel_id=channel.id, closed_by=self.bot.user.id if self.bot.user else 0)


async def setup(bot: commands.Bot) -> None:
    bot.add_view(CloseTicketView())
    await bot.add_cog(TicketsCog(bot))
