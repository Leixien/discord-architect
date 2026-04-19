import discord
from discord.ext import commands
from discord import app_commands


class StatsCog(commands.Cog):
    def __init__(self, bot: commands.Bot) -> None:
        self.bot = bot

    @app_commands.command(name="stats", description="Mostra le statistiche del server")
    async def stats(self, interaction: discord.Interaction) -> None:
        await interaction.response.defer()

        guild = interaction.guild
        if not guild:
            await interaction.followup.send("❌ Comando utilizzabile solo in un server.", ephemeral=True)
            return

        total_members = guild.member_count or 0
        bots = sum(1 for m in guild.members if m.bot)
        humans = total_members - bots

        text_channels = len(guild.text_channels)
        voice_channels = len(guild.voice_channels)
        categories = len(guild.categories)
        roles = len(guild.roles) - 1  # escludi @everyone

        boost_level = guild.premium_tier
        boost_count = guild.premium_subscription_count or 0

        created_at = guild.created_at.strftime("%d/%m/%Y")
        owner = guild.owner.mention if guild.owner else "N/D"

        embed = discord.Embed(
            title=f"📊 Statistiche — {guild.name}",
            color=0x5865f2,
        )

        if guild.icon:
            embed.set_thumbnail(url=guild.icon.url)

        embed.add_field(
            name="👥 Membri",
            value=f"**{total_members:,}** totali\n{humans:,} utenti · {bots} bot",
            inline=True,
        )
        embed.add_field(
            name="💬 Canali",
            value=f"**{text_channels + voice_channels}** totali\n{text_channels} testo · {voice_channels} vocali",
            inline=True,
        )
        embed.add_field(
            name="📁 Categorie",
            value=f"**{categories}**",
            inline=True,
        )
        embed.add_field(
            name="🏷️ Ruoli",
            value=f"**{roles}**",
            inline=True,
        )
        embed.add_field(
            name="🚀 Boost",
            value=f"Livello **{boost_level}** · {boost_count} boost",
            inline=True,
        )
        embed.add_field(
            name="📅 Creato il",
            value=created_at,
            inline=True,
        )
        embed.add_field(
            name="👑 Proprietario",
            value=owner,
            inline=False,
        )

        embed.set_footer(text=f"ID Server: {guild.id}")
        await interaction.followup.send(embed=embed)


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(StatsCog(bot))
