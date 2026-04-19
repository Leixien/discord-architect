import discord
from discord.ext import commands
from discord import app_commands

TEMPLATES: dict[str, dict] = {
    "gaming": {
        "label": "🎮 Gaming",
        "color": 0x5865f2,
        "categories": [
            {
                "name": "📋 INFO",
                "channels": [
                    ("regole", "text"),
                    ("annunci", "text"),
                    ("ruoli-self", "text"),
                ],
            },
            {
                "name": "🎮 GAMING",
                "channels": [
                    ("generale", "text"),
                    ("cerca-squad", "text"),
                    ("clip-e-screenshot", "text"),
                    ("lobby", "voice"),
                    ("gaming-1", "voice"),
                    ("gaming-2", "voice"),
                ],
            },
            {
                "name": "💬 COMMUNITY",
                "channels": [
                    ("chat-libera", "text"),
                    ("memes", "text"),
                    ("musica", "voice"),
                ],
            },
        ],
    },
    "study": {
        "label": "📚 Studio",
        "color": 0x57f287,
        "categories": [
            {
                "name": "📋 INFO",
                "channels": [
                    ("regole", "text"),
                    ("annunci", "text"),
                ],
            },
            {
                "name": "📚 STUDIO",
                "channels": [
                    ("generale", "text"),
                    ("domande", "text"),
                    ("risorse-e-link", "text"),
                    ("sessione-studio", "voice"),
                    ("focus-room", "voice"),
                ],
            },
            {
                "name": "☕ PAUSA",
                "channels": [
                    ("off-topic", "text"),
                    ("memes-studio", "text"),
                    ("chill", "voice"),
                ],
            },
        ],
    },
    "anime": {
        "label": "🌸 Anime",
        "color": 0xeb459e,
        "categories": [
            {
                "name": "📋 INFO",
                "channels": [
                    ("regole", "text"),
                    ("annunci", "text"),
                ],
            },
            {
                "name": "🌸 ANIME",
                "channels": [
                    ("generale", "text"),
                    ("discussioni", "text"),
                    ("raccomandazioni", "text"),
                    ("fan-art", "text"),
                    ("spoiler", "text"),
                ],
            },
            {
                "name": "🎮 LOUNGE",
                "channels": [
                    ("off-topic", "text"),
                    ("memes", "text"),
                    ("watch-party", "voice"),
                ],
            },
        ],
    },
    "business": {
        "label": "💼 Business",
        "color": 0xfee75c,
        "categories": [
            {
                "name": "📋 INFO",
                "channels": [
                    ("benvenuto", "text"),
                    ("annunci", "text"),
                    ("regole", "text"),
                ],
            },
            {
                "name": "💼 LAVORO",
                "channels": [
                    ("generale", "text"),
                    ("progetti", "text"),
                    ("feedback", "text"),
                    ("riunione", "voice"),
                    ("sala-lavoro", "voice"),
                ],
            },
            {
                "name": "🤝 NETWORKING",
                "channels": [
                    ("presentazioni", "text"),
                    ("opportunità", "text"),
                ],
            },
        ],
    },
}


class SetupCog(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot

    @app_commands.command(name="setup", description="Applica un template predefinito al server")
    @app_commands.describe(template="Il template da applicare")
    @app_commands.choices(template=[
        app_commands.Choice(name="🎮 Gaming", value="gaming"),
        app_commands.Choice(name="📚 Studio", value="study"),
        app_commands.Choice(name="🌸 Anime", value="anime"),
        app_commands.Choice(name="💼 Business", value="business"),
    ])
    @app_commands.default_permissions(manage_channels=True)
    async def setup(self, interaction: discord.Interaction, template: app_commands.Choice[str]) -> None:
        await interaction.response.defer(ephemeral=True)

        guild = interaction.guild
        if not guild:
            await interaction.followup.send("❌ Comando utilizzabile solo in un server.", ephemeral=True)
            return

        data = TEMPLATES[template.value]
        created_categories = 0
        created_channels = 0

        try:
            for cat_data in data["categories"]:
                category = await guild.create_category(cat_data["name"])
                created_categories += 1

                for ch_name, ch_type in cat_data["channels"]:
                    if ch_type == "voice":
                        await guild.create_voice_channel(ch_name, category=category)
                    else:
                        await guild.create_text_channel(ch_name, category=category)
                    created_channels += 1

        except discord.Forbidden:
            await interaction.followup.send(
                "❌ Permessi insufficienti. Assicurati che il bot abbia `Gestisci canali`.",
                ephemeral=True,
            )
            return
        except discord.HTTPException as e:
            await interaction.followup.send(f"❌ Errore Discord: {e}", ephemeral=True)
            return

        embed = discord.Embed(
            title=f"✅ Template {data['label']} applicato",
            description=(
                f"La struttura è stata creata con successo.\n\n"
                f"**{created_categories}** categorie · **{created_channels}** canali"
            ),
            color=data["color"],
        )
        embed.set_footer(text="Puoi rinominare o riorganizzare i canali a piacere.")
        await interaction.followup.send(embed=embed, ephemeral=True)


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(SetupCog(bot))
