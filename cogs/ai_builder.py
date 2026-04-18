import discord
from discord.ext import commands
from discord import app_commands


class AIBuilderCog(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot

    @app_commands.command(name="build", description="Genera la struttura del server tramite AI")
    async def build(self, interaction: discord.Interaction) -> None:
        await interaction.response.defer()
        await interaction.followup.send("Funzione in sviluppo.")


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(AIBuilderCog(bot))
