# DECISIONS — Swissperiences

> Log de decisões de produto e processo. Uma linha de data + decisão + consequência. Só o MASTER adiciona entradas.

## 2026-07 (anteriores ao Sprint 01, consolidadas)

- **Homepage da produção venceu.** A versão curta com a marca-mãe (`1caf5d5`) é a oficial. A homepage de 9 seções/4 mundos da branch `feat/frontend-brand-alignment` NÃO será integrada; fica como referência.
- **Branch `feat/frontend-brand-alignment` preservada sem merge.** Sem rebase, merge ou cherry-pick antes de decisão explícita de produto + diff contra `origin/main`.
- **Audio Journeys não é anunciada no site** até existir jornada completa: descobrir → comprar/resgatar → iniciar → ouvir → concluir.
- **App de áudio vive em repo separado** (`swissperiences-audio`), não no site principal.
- **Stripe canônico = Supabase Edge Function `stripe-webhook`.** Endpoint Live duplicado da Vercel deve ser desativado no dashboard (pendente, ação manual).
- **Modelo de trabalho: MASTER fixo + 1 chat de sprint por vez.** Sprint não faz push em `main`; para antes de PR/merge/deploy.

## 2026-07-30 (Sprint 01)

- **Stones & Water protegido por commit local** (`d0425d7` em `swissperiences-audio`). Papel comercial do ativo continua sem decisão — pendente.
- **`main` local passa a ser sempre sincronizado com `origin/main` antes de qualquer sprint.**
- **Remoção local de `@upstash/*` em `package.json` NÃO é decisão aprovada** — mudança não commitada de origem incerta; não commitar sem análise.
- **Prioridade após base segura: monetização/operação** (GYG, oferta clara) antes de polish de frontend.
