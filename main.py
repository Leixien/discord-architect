import asyncio
import discord
from discord.ext import commands
from config import DISCORD_TOKEN

COGS = [
    "cogs.ai_builder",
    "cogs.tickets",
]

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)


@bot.event
async def on_ready() -> None:
    print(f"Connesso come {bot.user} ({bot.user.id})")
    await bot.tree.sync()
    print("Slash commands sincronizzati.")


async def main() -> None:
    async with bot:
        for cog in COGS:
            await bot.load_extension(cog)
        await bot.start(DISCORD_TOKEN)


if __name__ == "__main__":
    asyncio.run(main())
