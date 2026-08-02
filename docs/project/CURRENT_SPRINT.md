# CURRENT_SPRINT — Swissperiences

> Existe apenas UM sprint ativo por vez. Este arquivo descreve o sprint corrente
> (ou o último concluído).

## SPRINT 02 — Reenquadramento Estratégico: Alpine Sanctuaries

- **Status:** em revisão — documentos editados, aguardando aprovação e
  autorização de commit.
- **Data:** 2026-08-02
- **Objetivo:** transformar uma descoberta de campo em decisão estratégica
  documentada, sem implementar produto, alterar o site ou tocar em produção.

### Pergunta que o sprint precisava responder

O que exatamente é a Swissperiences, para quem ela cria valor e qual é a
primeira oferta monetizável coerente com Alpine Sanctuaries?

### Hipótese

O padrão observado em campo (retiro onde o lugar é o destino, com curadoria
local integrada) confirma a direção Alpine Sanctuaries já registrada no site.
A oportunidade monetizável não é operar estadias — é **vender curadoria de guest
experience para propriedades boutique**, mantendo Cauêh como curador/editor.

### O que foi feito

1. **Auditoria da fonte de verdade** — os três documentos de projeto, mais
   Sanctuaries, Packages, Experiences, Journals, `/enhance`, Guest Link
   Generator, backlog de implementação e os 8 drafts GetYourGuide.
2. **Benchmark interno** registrado apenas com fatos de fontes públicas.
   Observações de campo do Cauêh seguem pendentes (seção reservada em
   `DECISIONS.md`).
3. **Reauditoria dos 8 drafts GYG** contra os não negociáveis. Nenhum sobrevive
   na forma atual — tabela em `PROJECT_STATE.md`.
4. **Comparação de três testes pequenos e equivalentes** (não de um modelo
   pronto contra um SaaS imaginário):
   - **A** — editorial/afiliado/geração de leads, sem Cauêh guiando;
   - **B** — um piloto manual de guest experience para uma propriedade,
     reaproveitando o que já existe, sem construir SaaS;
   - **C** — avaliar se a camada editorial B2C serve de aquisição para o piloto
     B2B (não é "duas empresas").
5. **Correções obrigatórias do Cauêh incorporadas** — ver `DECISIONS.md`.

### Resultado

- Definição da marca em uma frase, com B2C e B2B separados.
- Recomendação: **B**, com **C** entendido como sequenciamento de B (a peça
  editorial é o material de venda, não um segundo negócio).
- Um único teste prioritário: **Guest Editorial Concierge — piloto pago**.
- A alternativa avaliada e descartada (guia digital pago) fica registrada.

### Limites deste sprint — o que NÃO foi feito

- Nenhum código, redesign, mudança de copy, Figma.
- Nada em Stripe, Supabase, Vercel, Resend.
- **Nenhuma publicação, nenhum outreach, nenhum contato com propriedades.**
- Nenhum portal, nenhum software novo.
- Nenhum push, PR, merge, deploy.
- `main` e `feat/frontend-brand-alignment` intocadas. Repo
  `swissperiences-audio` intocado.
- Nenhum commit antes de autorização textual do Cauêh.

### Critérios de aceite

| Critério | Situação |
|---|---|
| Definição da Swissperiences em uma frase | Feito |
| B2C e B2B separados | Feito |
| Três testes comparados com critérios concretos | Feito |
| Recomendação defendida por evidências | Feito |
| Um único teste monetizável prioritário | Feito |
| Explícito o que não será construído | Feito |
| Capacidade e risco de overload considerados | Feito (restrição eliminatória) |
| Três documentos aprovados textualmente | **Pendente** |
| Nenhuma alteração fora de `docs/project/` | Cumprido |
| Nenhum commit/push/PR/merge/deploy sem autorização | Cumprido |

### Ocorrências

- `.git/logs/HEAD` e `.git/logs/refs/heads/main` ficaram `dataless` (evictos pelo
  iCloud) e ilegíveis. `git switch docs/project-state` falha ao anexar ao
  reflog. O checkout já havia materializado os três documentos no working tree
  com o conteúdo de `cba2d08`, então a edição autorizada foi feita normalmente;
  **HEAD permanece em `main` e a branch `docs/project-state` continua em
  `cba2d08`**. Commit bloqueado até o reflog ser resolvido. Nenhum reset, stash,
  force ou remoção executados.

## Próximo portão (não é sprint ainda)

Antes de qualquer execução comercial do teste recomendado, o portão
jurídico/administrativo de `PROJECT_STATE.md` precisa estar validado. Publicação,
outreach e proposta exigem autorização própria do Cauêh.

## Histórico

### SPRINT 01 — Base Segura e Fonte de Verdade — CONCLUÍDO (2026-07-30)

Backup de Stones & Water em commit local `d0425d7` (`swissperiences-audio`);
`main` sincronizado por fast-forward `8289350` → `6ca3247`; três documentos de
projeto criados na branch `docs/project-state` (`cba2d08`). Sem push, sem deploy.
Fast-forward interrompido por timeout do iCloud e recuperado com `git restore`
cirúrgico + novo `merge --ff-only`, sob autorização explícita.
