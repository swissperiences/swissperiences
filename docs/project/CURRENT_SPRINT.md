# CURRENT_SPRINT — Swissperiences

> Existe apenas UM sprint ativo por vez. Este arquivo descreve o sprint corrente (ou o último concluído).

## SPRINT 01 — Base Segura e Fonte de Verdade

- **Status:** CONCLUÍDO (2026-07-30)
- **Objetivo:** ambiente local íntegro e documentado, sem tocar em produção.

### Escopo executado

1. Backup Stones & Water: commit local `d0425d7` em `swissperiences-audio` (branch `feat/alpine-editorial`) — capítulo 1 PT-BR, textos TTS, `chapter-1-pf-dora.wav`, 5 ícones. Sem push.
2. `main` local sincronizado com `origin/main` por fast-forward: `8289350` → `6ca3247`.
3. Criados `docs/project/PROJECT_STATE.md`, `CURRENT_SPRINT.md`, `DECISIONS.md` na branch `docs/project-state`.

### Fora de escopo (não feito, de propósito)

- Qualquer push, PR, merge de conteúdo, deploy.
- Qualquer mudança em `src/`, `api/`, `supabase/`, Stripe, Supabase, Vercel, Resend, secrets.
- As 4 modificações locais não commitadas e os arquivos untracked: intactos.

### Ocorrências

- Fast-forward interrompido por timeout (iCloud lento) na 1ª tentativa; árvore ficou meio-atualizada; recuperado com `git restore` cirúrgico dos 51 arquivos afetados + novo `merge --ff-only`, com autorização explícita do Cauêh. Sem reset/stash/force.

## Próximo sprint (a definir pelo MASTER)

Candidato natural: frente de monetização/operação (GYG listings ou oferta clara no site). Decisão no chat MASTER.
