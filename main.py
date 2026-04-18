import asyncio
import logging
import discord
from discord.ext import commands
from config import DISCORD_TOKEN

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")

COGS = [
    "cogs.ai_builder",
    "cogs.tickets",
]

intents = discord.Intents.default()

bot = commands.Bot(command_prefix="!", intents=intents)


@bot.event
async def on_ready() -> None:
    print(f"Connesso come {bot.user} ({bot.user.id})")
    synced = await bot.tree.sync()
    print(f"Slash commands sincronizzati: {len(synced)} comandi → {[c.name for c in synced]}")


async def main() -> None:
    async with bot:
        for cog in COGS:
            try:
                await bot.load_extension(cog)
                print(f"Cog caricato: {cog}")
            except Exception as e:
                print(f"Errore caricamento {cog}: {e}")
        await bot.start(DISCORD_TOKEN)



if __name__ == "__main__":
    asyncio.run(main())
