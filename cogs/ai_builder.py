import logging
import discord
from discord.ext import commands
from discord import app_commands

from services.gemini import generate_server_structure, BuildContext
from services.supabase_client import save_server_build

logger = logging.getLogger(__name__)


def build_preview_embed(structure: dict) -> discord.Embed:
    embed = discord.Embed(
        title=f"Struttura proposta: {structure.get('nome_server', 'Server')}",
        color=discord.Color.blurple(),
    )
    for categoria in structure.get("categorie", []):
        canali_text = "\n".join(
            f"{'#' if c['tipo'] == 'text' else '🔊'} {c['nome']}"
            for c in categoria.get("canali", [])
        )
        embed.add_field(
            name=f"📁 {categoria['nome']}",
            value=canali_text or "—",
            inline=False,
        )
    embed.set_footer(text="Vuoi creare questa struttura nel server?")
    return embed


async def create_structure(
    guild: discord.Guild,
    structure: dict,
) -> tuple[int, int, list[str]]:
    created = 0
    errors = 0
    log: list[str] = []

    for categoria in structure.get("categorie", []):
        try:
            category = await guild.create_category(categoria["nome"])
        except Exception as e:
            errors += 1
            log.append(f"❌ Categoria '{categoria['nome']}': {e}")
            continue

        for canale in categoria.get("canali", []):
            try:
                if canale["tipo"] == "voice":
                    await category.create_voice_channel(canale["nome"])
                else:
                    await category.create_text_channel(canale["nome"])
                created += 1
            except Exception as e:
                errors += 1
                log.append(f"❌ Canale '{canale['nome']}': {e}")

    return created, errors, log


class ConfirmBuildView(discord.ui.View):
    def __init__(self, author_id: int, structure: dict, description: str) -> None:
        super().__init__(timeout=120)
        self.author_id = author_id
        self.structure = structure
        self.description = description

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        if interaction.user.id != self.author_id:
            await interaction.response.send_message(
                "Solo chi ha avviato il comando può confermare.", ephemeral=True
            )
            return False
        return True

    async def on_timeout(self) -> None:
        for item in self.children:
            item.disabled = True  # type: ignore

    @discord.ui.button(label="Conferma", style=discord.ButtonStyle.success, emoji="✅")
    async def conferma(
        self, interaction: discord.Interaction, button: discord.ui.Button
    ) -> None:
        for item in self.children:
            item.disabled = True  # type: ignore
        await interaction.response.edit_message(view=self)

        if not interaction.guild:
            return

        await interaction.followup.send("Creazione in corso...", ephemeral=True)

        created, errors, log = await create_structure(interaction.guild, self.structure)

        save_server_build(
            guild_id=str(interaction.guild.id),
            user_id=str(interaction.user.id),
            description=self.description,
            structure=self.structure,
        )

        riepilogo = f"✅ **{created}** canali creati"
        if errors:
            riepilogo += f", ❌ **{errors}** errori\n" + "\n".join(log[:5])

        await interaction.followup.send(riepilogo, ephemeral=True)

    @discord.ui.button(label="Annulla", style=discord.ButtonStyle.danger, emoji="❌")
    async def annulla(
        self, interaction: discord.Interaction, button: discord.ui.Button
    ) -> None:
        for item in self.children:
            item.disabled = True  # type: ignore
        await interaction.response.edit_message(view=self)
        await interaction.followup.send("Build annullato.", ephemeral=True)


class BuildInputModal(discord.ui.Modal, title="Parlami del tuo server"):
    descrizione = discord.ui.TextInput(
        label="Di cosa si tratta?",
        placeholder="Es. un server per una community di appassionati di fotografia...",
        style=discord.TextStyle.paragraph,
        required=True,
        max_length=500,
    )
    tema = discord.ui.TextInput(
        label="Tema principale",
        placeholder="Es. gaming, musica, studio, crypto, arte...",
        style=discord.TextStyle.short,
        required=True,
        max_length=100,
    )
    audience = discord.ui.TextInput(
        label="Chi userà il server? Quanti membri prevedi?",
        placeholder="Es. gruppo di amici, 50 persone, community pubblica...",
        style=discord.TextStyle.short,
        required=False,
        max_length=150,
    )
    tono = discord.ui.TextInput(
        label="Che vibe vuoi dare?",
        placeholder="Es. casual e divertente, serio e professionale, competitivo...",
        style=discord.TextStyle.short,
        required=False,
        max_length=100,
    )
    esigenze = discord.ui.TextInput(
        label="Canali o funzionalità specifiche che vuoi?",
        placeholder="Es. canale per tornei, stanza music bot, sezione annunci...",
        style=discord.TextStyle.paragraph,
        required=False,
        max_length=400,
    )

    async def on_submit(self, interaction: discord.Interaction) -> None:
        if not interaction.guild:
            await interaction.response.send_message(
                "Comando disponibile solo in un server.", ephemeral=True
            )
            return

        if not interaction.guild.me.guild_permissions.manage_channels:
            await interaction.response.send_message(
                "Il bot non ha il permesso `Gestisci canali`.", ephemeral=True
            )
            return

        await interaction.response.defer(ephemeral=True)

        context = BuildContext(
            descrizione=self.descrizione.value,
            tema=self.tema.value,
            audience=self.audience.value or "",
            tono=self.tono.value or "",
            esigenze=self.esigenze.value or "",
        )

        try:
            structure = await generate_server_structure(context)
        except RuntimeError as e:
            await interaction.followup.send(str(e), ephemeral=True)
            return

        description = f"{context.tema} — {context.descrizione}"
        embed = build_preview_embed(structure)
        view = ConfirmBuildView(
            author_id=interaction.user.id,
            structure=structure,
            description=description,
        )
        await interaction.followup.send(embed=embed, view=view, ephemeral=True)

    async def on_error(
        self, interaction: discord.Interaction, error: Exception
    ) -> None:
        logger.error("BuildInputModal error: %s", error)
        await interaction.response.send_message(
            "Si è verificato un errore. Riprova.", ephemeral=True
        )


class AIBuilderCog(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot

    @app_commands.command(
        name="build",
        description="Genera la struttura del server tramite AI",
    )
    async def build(self, interaction: discord.Interaction) -> None:
        await interaction.response.send_modal(BuildInputModal())


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(AIBuilderCog(bot))
