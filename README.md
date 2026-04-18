# Discord Architect

Bot Discord modulare con sistema di AI builder e gestione ticket, sviluppato in Python.

## Stack

| Layer | Tecnologia |
|---|---|
| Bot framework | discord.py 2.x — slash commands |
| AI | Google Gemini 2.0 Flash |
| Database | Supabase (PostgreSQL) |
| Config | python-dotenv |
| Runtime | Python 3.11+ |

## Funzionalità

- `/build` — AI builder: genera la struttura di un server Discord tramite AI
- `/ticket` — sistema ticket integrato per la gestione delle richieste utenti

## Struttura

```
discord-architect/
├── main.py                  # entry point, carica cogs
├── config.py                # variabili d'ambiente e costanti
├── cogs/
│   ├── ai_builder.py        # comando /build
│   └── tickets.py           # comando /ticket
├── services/
│   ├── gemini.py            # wrapper Google Gemini SDK
│   └── supabase_client.py   # wrapper Supabase
├── .env                     # credenziali (non versionato)
├── .env.example             # template credenziali
├── requirements.txt
└── docs/
    └── features/            # documentazione feature
```

## Setup

### 1. Clona e installa dipendenze

```bash
git clone <repo-url>
cd discord-architect
pip install -r requirements.txt
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.example .env
```

Compila `.env`:

```env
DISCORD_TOKEN=        # token bot da Discord Developer Portal
GEMINI_API_KEY=       # chiave API da aistudio.google.com
SUPABASE_URL=         # URL progetto Supabase
SUPABASE_KEY=    # chiave anon Supabase
```

### 3. Avvia il bot

```bash
python main.py
```

## Permessi Discord

Il bot richiede i seguenti permessi minimi:

- `Manage Channels` — creazione canali tramite AI builder
- `Manage Roles` — assegnazione ruoli
- `Send Messages` — risposte ai comandi
- `Read Message History` — gestione ticket

## Sviluppo

Branch di lavoro: `develop`. Mai commit diretti su `main`.

```bash
git checkout -b feature/nome-feature
```

Commit seguono lo standard [Conventional Commits](https://www.conventionalcommits.org/).
