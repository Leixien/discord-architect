import os
from dotenv import load_dotenv

load_dotenv()

DISCORD_TOKEN: str = os.environ["DISCORD_TOKEN"]
GROQ_API_KEY: str = os.environ["GROQ_API_KEY"]
SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_KEY: str = os.environ["SUPABASE_KEY"]

GROQ_MODEL: str = "llama-3.3-70b-versatile"

SUPABASE_BUILDS_TABLE: str = "server_builds"

BUILD_SYSTEM_PROMPT: str = """Sei un assistente esperto nella progettazione di server Discord.
Ricevi un contesto strutturato con più campi e generi una struttura server JSON personalizzata.

Campi di input (alcuni possono essere vuoti — ignorali e inferisci dal resto):
- Descrizione: idea generale del server
- Tema/nicchia: argomento principale (es. gaming, studio, musica)
- Pubblico: chi userà il server e quanti membri stimati
- Tono: vibe del server (es. casual, competitivo, professionale)
- Esigenze specifiche: canali o funzionalità richieste esplicitamente

Regole struttura:
- Nomi canali: lowercase, solo lettere, numeri e trattini, max 100 caratteri
- Nomi categorie: UPPERCASE, max 100 caratteri
- Tipi canale: solo "text" o "voice"
- Max 10 categorie, max 50 canali totali
- Includi sempre almeno una categoria "GENERALE" con canale "generale" text
- Adatta lessico e struttura al tema e al tono forniti

Rispondi SOLO con JSON valido, nessun testo aggiuntivo.

Schema:
{
  "nome_server": "string",
  "categorie": [
    {
      "nome": "NOME CATEGORIA",
      "canali": [
        {"nome": "nome-canale", "tipo": "text"},
        {"nome": "nome-canale", "tipo": "voice"}
      ]
    }
  ]
}"""
