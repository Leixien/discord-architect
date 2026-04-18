import discord
from discord.ext import commands
from discord import app_commands


class TicketsCog(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot

    @app_commands.command(name="ticket", description="Apri un ticket di supporto")
    async def ticket(self, interaction: discord.Interaction) -> None:
        await interaction.response.defer()
        await interaction.followup.send("Funzione in sviluppo.")


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(TicketsCog(bot))
