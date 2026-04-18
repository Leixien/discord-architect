# Modifica: Ticket System — implementazione iniziale

**Data:** 2026-04-19
**Tipo:** feat
**Branch:** feature/ticket-system
**Commit:** feat(tickets): implement /ticket open/setup with persistent close button

## Cosa è stato fatto
Implementazione completa del sistema ticket con canali privati Discord, Modal apertura, bottone chiusura persistente e storico su Supabase.

## File modificati

| File | Azione | Dettaglio |
|---|---|---|
| `cogs/tickets.py` | riscritto | TicketsCog con group, TicketOpenModal, CloseTicketView persistente, CloseReasonModal, listener channel_delete |
| `services/supabase_client.py` | modificato | Aggiunti 7 helper per tickets e ticket_config |

## Verifiche

| Verifica | Tool | Risultato |
|---|---|---|
| Syntax check | `py_compile` | ✅ |
| Bot avvio | `python3 main.py` | ✅ |
| /ticket setup | Test Discord | ✅ |
| /ticket open → Modal | Test Discord | ✅ |
| Canale privato creato | Test Discord | ✅ |
| Bottone chiudi ticket | Test Discord | ✅ |
| Canale eliminato dopo 10s | Test Discord | ✅ |
| Record su Supabase | Dashboard | ✅ |

## Motivazione
Feature core del bot per gestione richieste utenti con tracciabilità completa.

## Impatto
- **Cogs interessati:** tickets
- **Tabelle Supabase:** tickets, ticket_config (nuove)
- **Permessi Discord richiesti:** Manage Channels, Manage Roles
- **Breaking changes:** no

## TODO residui
- [ ] Riabilitare RLS su tickets e ticket_config con policy corrette
- [ ] Trascrizione messaggi in v2
- [ ] Limite max ticket aperti per guild configurabile
