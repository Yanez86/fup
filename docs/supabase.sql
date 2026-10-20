-- FUP: archivio delle partite salvate online.
-- Da incollare una volta sola in Supabase: SQL Editor → New query → incolla tutto → Run.
-- Si può rilanciare senza problemi: non cancella le partite già salvate.

-- una riga per ogni posto di salvataggio (da 1 a 3) di ogni giocatore
create table if not exists public.partite (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  slot smallint not null check (slot between 1 and 3),
  at bigint not null,                -- quando è stata salvata (millisecondi): dice quale versione è più recente
  dev text not null default '',      -- da dove è stata salvata (telefono, computer…)
  nome text not null default '',     -- nome dell'azienda, per l'elenco
  giorno integer not null default 0, -- giorno della partita
  dati jsonb not null check (pg_column_size(dati) < 3000000),  -- la partita (al massimo 3 MB)
  aggiornata timestamptz not null default now(),
  primary key (user_id, slot)
);

-- ognuno vede, scrive e cancella solo le sue partite (vale anche per gli ospiti)
alter table public.partite enable row level security;
grant select, insert, update, delete on public.partite to authenticated;
drop policy if exists "leggo le mie partite" on public.partite;
drop policy if exists "aggiungo le mie partite" on public.partite;
drop policy if exists "modifico le mie partite" on public.partite;
drop policy if exists "cancello le mie partite" on public.partite;
create policy "leggo le mie partite" on public.partite for select to authenticated using ((select auth.uid()) = user_id);
create policy "aggiungo le mie partite" on public.partite for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "modifico le mie partite" on public.partite for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "cancello le mie partite" on public.partite for delete to authenticated using ((select auth.uid()) = user_id);

-- pulsante «Elimina i miei dati online»: cancella l'account e, a cascata, tutte le sue partite
create or replace function public.elimina_account() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid();
$$;
revoke all on function public.elimina_account() from public, anon;
grant execute on function public.elimina_account() to authenticated;
