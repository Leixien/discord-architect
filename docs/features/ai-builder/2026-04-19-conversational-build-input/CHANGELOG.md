# Modifica: AI Builder — Modal conversazionale

**Data:** 2026-04-19
**Tipo:** feat
**Branch:** feature/conversational-build-input
**Commit:** feat(ai-builder): add conversational modal with structured context

## Cosa è stato fatto
Implementazione completa del comando `/build` con flusso conversazionale. Il comando apre un Modal Discord nativo con 5 campi contestuali, usa le risposte per generare una struttura server personalizzata tramite Groq, mostra anteprima Embed e crea canali reali dopo conferma utente.

## File modificati

| File | Azione | Dettaglio |
|---|---|---|
| `cogs/ai_builder.py` | modificato | Aggiunto BuildInputModal (5 TextInput), ConfirmBuildView, helpers embed e create_structure |
| `services/gemini.py` | modificato | Migrazione google-generativeai → groq, aggiunto BuildContext dataclass, refactor generate_server_structure |
| `config.py` | modificato | Aggiornato BUILD_SYSTEM_PROMPT multi-field, GROQ_API_KEY/MODEL, rimosso GEMINI |
| `requirements.txt` | modificato | google-generativeai → groq>=0.11.0 |
| `.env.example` | modificato | GEMINI_API_KEY → GROQ_API_KEY |

## Verifiche

| Verifica | Tool | Risultato |
|---|---|---|
| Syntax check | `py_compile` | ✅ |
| Bot avvio | `python3 main.py` | ✅ 2 comandi sincronizzati |
| /build apre Modal | Test Discord | ✅ |
| Struttura generata | Groq API | ✅ |
| Canali creati | Test Discord | ✅ |
| Salvataggio DB | Supabase | ✅ (RLS disabilitato) |

## Motivazione
Flusso a singolo parametro era troppo generico. Modal a 5 campi (descrizione, tema, audience, tono, esigenze) permette a Groq di generare strutture più mirate e pertinenti al contesto reale del server.

## Impatto
- **Cogs interessati:** ai_builder
- **Breaking change:** parametro `descrizione` rimosso da slash command (ora nel Modal)
- **Tabelle Supabase:** server_builds (invariata)
- **Permessi Discord richiesti:** Manage Channels

## TODO residui
- [ ] Riabilitare RLS su Supabase con policy corretta
- [ ] Implementare `/ticket`
