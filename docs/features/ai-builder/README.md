# Feature: AI Builder (/build)

**Stato:** completata
**Data creazione:** 2026-04-19
**Ultima modifica:** 2026-04-19

## Descrizione
Comando slash `/build` che guida l'utente attraverso un Modal conversazionale a 5 campi, genera una struttura server personalizzata tramite AI (Groq llama-3.3-70b), mostra un'anteprima con Embed e crea categorie e canali reali sul server Discord dopo conferma.

## Componenti coinvolti

| File | Percorso | Ruolo |
|---|---|---|
| AIBuilderCog | `cogs/ai_builder.py` | Comando /build, Modal, View conferma, creazione canali |
| BuildInputModal | `cogs/ai_builder.py` | Modal 5 campi con raccolta input contestuale |
| ConfirmBuildView | `cogs/ai_builder.py` | Bottoni Conferma/Annulla con timeout 120s |
| generate_server_structure | `services/gemini.py` | Chiamata Groq con BuildContext, structured JSON output |
| BuildContext | `services/gemini.py` | Dataclass che compone il prompt da 5 campi |
| save_server_build | `services/supabase_client.py` | Persistenza struttura su Supabase |

## Dipendenze
- `groq` — llama-3.3-70b-versatile
- `discord.py 2.x` — Modal, View, TextInput, app_commands
- Supabase tabella `server_builds`
- Permesso bot: `Manage Channels`

## Stato delle modifiche

| Data | Modifica | Changelog |
|---|---|---|
| 2026-04-19 | Implementazione iniziale /build con Modal conversazionale | [link](2026-04-19-conversational-build-input/CHANGELOG.md) |
