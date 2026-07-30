# PROJECT_STATE — Swissperiences

> Fonte única de verdade do projeto. Atualizada pelo MASTER ao fim de cada sprint.
> Última atualização: 2026-07-30 (Sprint 01).

## Produção

- Site no ar: https://swissperiences.ch
- Repo: `swissperiences/swissperiences` (GitHub)
- Produção = `origin/main` = `6ca3247` — "fix(a11y): apply the 44px touch minimum on narrow viewports too"
- Deploy automático via Vercel a cada push em `main`. **Por isso: push em `main` = deploy. Proibido push direto sem aprovação.**
- Backend: Supabase projeto `rhoxismvcalqppbnndew` (West EU). Stripe via Edge Function `stripe-webhook` (canônica, `verify_jwt=false`).

## Mapa de repositórios

| Repo | Local | Papel |
|---|---|---|
| `swissperiences` | `~/Documents/Documents - C’s MacBook Air/MeusProjetos/swissperiences` | Site principal (Vite + React + Supabase). ATENÇÃO: apóstrofo do caminho é Unicode curvo (`’`); existe diretório irmão com apóstrofo ASCII (`'`) — são pastas diferentes. |
| `swissperiences-audio` | `/Users/cv/swissperiences-audio` | App de Audio Journeys (Expo). Branch `feat/alpine-editorial`. Material Stones & Water preservado no commit `d0425d7` (local, sem push). |
| `swissperiences-video` | `MeusProjetos/swissperiences-video` | Projeto Next.js/hyperframes de vídeo. Fora do escopo atual. |
| SWP2 | `~/Documents/SWP2` | Projeto Xcode (iOS). Fora do escopo atual. |

## Branches e worktrees (repo principal)

- `main` — `6ca3247`, igual a `origin/main` (sincronizado no Sprint 01).
- `feat/frontend-brand-alignment` — `59bfd13`, **somente local, preservada como referência histórica**. 5 commits sobre base `8289350`. NÃO fazer merge/rebase; 17 arquivos conflitam com a produção (Index, App, Navigation, Footer etc.). Peças candidatas a recuperação seletiva: `src/lib/packageStatus.ts`, `use-reduced-motion.ts`, partes de i18n PT. Avaliar depois: MembersJourney, MembersConcierge, página `/audio`.
- `restore/pre-audio-site` — `6ca3247`, espelha produção.
- `backup/audio-journeys-20260726` e branches `claude/*` — históricas, não tocar sem decisão.
- Worktrees em `.claude/worktrees/`: `swissperiences-restore-00e851` (detached `59bfd13`) e `swissperiences-restore-site-1c60ba` (detached `6ca3247`). Preservar.

## Modificações locais conhecidas (não commitadas, no worktree principal)

- `package.json` + `package-lock.json`: **removem `@upstash/ratelimit` e `@upstash/redis`** — dependências do rate limiting das APIs Vercel. ⚠️ NÃO commitar sem decisão explícita; commitar por engano derruba proteção das APIs.
- `.claude/launch.json`: ajuste local de PATH para npm.
- `skills-lock.json`: mudança local de tooling.
- Untracked: `podcasts/` (8 mídias), `studio-site/`, `AGENTS.md`, `TUTORIEL_STACK.md`, `SWISSPERIENCES.pdf`, `scripts/cleanup-test-leads.ts`, `scripts/list-leads.ts`. Preservar até decisão.

## Pendências de backend/produção

1. Endpoint Stripe **Live** duplicado da Vercel ainda ENABLED no dashboard Stripe — desativar (ação manual do Cauêh; risco de processamento duplo).
2. Touch targets: reverificar no site publicado após `6ca3247`.
3. `/enhance`: solução definitiva continua sendo `/enhance/<opaque-token>`.
4. Logs, credenciais rotativas e estado final das integrações: verificar antes de novas alterações de produção.
5. Nenhuma alteração de produção sem plano de impacto e rollback.

## Regras de trabalho

- Modelo MASTER + 1 sprint temporário por vez. Nunca dois sprints ativos.
- Sprint nunca faz push em `main`; para antes de PR/merge/deploy e entrega relatório.
- Filesystem iCloud é lento: comandos git que reescrevem muitos arquivos precisam de timeout longo.
