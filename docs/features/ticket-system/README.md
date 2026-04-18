# Feature: Ticket System (/ticket)

**Stato:** completata
**Data creazione:** 2026-04-19
**Ultima modifica:** 2026-04-19

## Descrizione
Sistema ticket per gestione richieste utenti su Discord. Apre canali privati dedicati per ogni ticket, visibili solo all'utente e allo staff. Storico su Supabase.

## Componenti coinvolti

| File | Percorso | Ruolo |
|---|---|---|
| TicketsCog | `cogs/tickets.py` | Gruppo comandi /ticket open e /ticket setup |
| TicketOpenModal | `cogs/tickets.py` | Modal apertura ticket (subject, description, priority) |
| CloseTicketView | `cogs/tickets.py` | Bottone persistente chiusura ticket |
| CloseReasonModal | `cogs/tickets.py` | Modal motivo chiusura |
| supabase_client | `services/supabase_client.py` | Helper CRUD per tickets e ticket_config |

## Dipendenze
- Supabase tabelle: `tickets`, `ticket_config`
- Permessi bot: `Manage Channels`, `Manage Roles`
- Permesso setup: `Manage Guild` (solo admin)

## Flusso
1. Admin esegue `/ticket setup ruolo:@Staff`
2. Utente esegue `/ticket open` → Modal con subject, description, priority
3. Bot crea canale `#ticket-username` in categoria `TICKETS`
4. Staff chiude con bottone → canale eliminato dopo 10s, record aggiornato su DB

## Stato delle modifiche

| Data | Modifica | Changelog |
|---|---|---|
| 2026-04-19 | Implementazione iniziale | [link](2026-04-19-implementazione-iniziale/CHANGELOG.md) |
