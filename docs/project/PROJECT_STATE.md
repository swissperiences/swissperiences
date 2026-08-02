# PROJECT_STATE — Swissperiences

> Fonte única de verdade do projeto. Atualizada pelo MASTER ao fim de cada sprint.
> Última atualização: 2026-08-02 (Sprint 02).

## Estratégia

**Definição.** A Swissperiences transforma lugares excepcionais dos Alpes em
experiências de hóspede cuidadosamente curadas — como marca editorial para
viajantes e serviço de guest experience para propriedades boutique.

**Status honesto.** A marca editorial existe e está no ar. O serviço de guest
experience para propriedades é uma **hipótese de monetização em teste** — não é
empresa, não é produto, não tem cliente pagante, não tem recorrência validada.

### Não negociáveis

Estas restrições eliminam opções; não são preferências.

1. **Cauêh atua como curador/editor.** Não é guia, não é motorista, não é
   operador de estadias. Nenhum modelo que dependa da presença contínua dele
   sobrevive a este filtro.
2. **Carga operacional recorrente baixa.**
3. **Nenhum software novo antes de cliente ou piloto pago.**
4. **Todo teste valida pagamento real.** Elogio, reunião, "adoraria" e intenção
   declarada não são validação.
5. **Nenhuma dependência de comercializar hospedagem pelo GetYourGuide.**
6. **Runway:** aproximadamente 8 meses de chômage até a monetização precisar
   existir.
7. **Alpine Sanctuaries permanece a identidade da marca.**
8. **Separar sempre "negócio desejável" de "ativos antigos já redigidos".**

### Públicos

| | Quem | Papel |
|---|---|---|
| **B2C** | O viajante | Marca, editorial, aquisição, autoridade |
| **B2B** | Propriedade boutique alpina/lacustre | Hipótese de monetização em teste |

### Frentes

1. **Alpine Sanctuaries** — identidade editorial da marca. Ativa.
2. **Guest experience para propriedades** — hipótese de monetização. Em teste
   (Sprint 02+).
3. **Journals** — aquisição e prova pública de capacidade editorial. Ativa.
4. **Audio Journeys** — linha futura. Repo separado. Não anunciada.
5. **GetYourGuide** — apenas como canal de afiliado ou para experiências
   operadas por terceiros. Ver "Ativos comerciais legados".

### Princípios de curadoria (uso interno)

Derivados de um benchmark interno de hotelaria observado em campo (registro em
`DECISIONS.md`). São formulação própria da Swissperiences — o benchmark **não
pode ser citado, nomeado ou insinuado em material comercial, portfólio ou
pitch**.

1. O lugar é o destino; o programa serve o lugar, não o contrário.
2. Curadoria local faz parte da hospedagem, não é folheto anexo.
3. Escala pequena e silêncio são características, não limitações.
4. Coerência entre arquitetura, mesa, bem-estar e território.
5. O hóspede recebe contexto **antes** de chegar.

### Portão jurídico/administrativo — obrigatório antes de vender

Nenhum outreach, proposta formal, faturamento ou recebimento antes de validar,
separadamente e por escrito:

1. compatibilidade com chômage / gain intermédiaire;
2. forma jurídica e capacidade efetiva de faturar;
3. impostos, AVS e TVA quando aplicáveis;
4. uso de dados pessoais no guest portal (base legal, retenção, encarregado);
5. autorização formal para qualquer acesso a dados ou sistemas da propriedade.

### Ativos comerciais legados — 8 drafts GetYourGuide

Redigidos em março e abril de 2026, **nenhum publicado**. Reauditados no Sprint
02 contra os não negociáveis. Nenhum sobrevive na forma atual.

| Draft | Situação |
|---|---|
| M1 Loft Stay + trilha guiada (2n) | Hospedagem provavelmente inelegível no GYG + exige Cauêh operando |
| M2 Cinematic Road Journey + drone (2n) | Exige Cauêh dirigindo + validação jurídica (drone comercial) + hospedagem |
| M3 Wellness Retreat + spa & trilha (3n) | Hospedagem provavelmente inelegível + trilha guiada |
| M4 Grand Tour (5n) | Hospedagem + Cauêh operando tudo |
| A1 Transfer aeroporto CHF 95 | Categoria elegível, mas Cauêh motorista + licença de transporte de pessoas e seguro comercial |
| A2 Genebra→Chamonix CHF 220 | Idem A1 + transporte transfronteiriço |
| A3 Genebra→Verbier CHF 300 | Idem A1 |
| A4 Private Alpine Drive CHF 550 | É o fundador-como-produto |

Preços destes drafts **não são evidência de viabilidade**. Custo real de
turnover, provisões, deslocamento, comissão de canal, taxa de turismo, seguro de
hóspede pagante, disponibilidade do imóvel e autorização de comercialização
seguem **pendentes e não verificados**.

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
- `docs/project-state` — `cba2d08`, **somente local, sem push**. Carrega estes três documentos.
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
3. `/enhance`: solução definitiva continua sendo `/enhance/<opaque-token>`. Enquanto isso, **qualquer reaproveitamento de `/enhance` em protótipo só é permitido se não exigir mudança em produção**.
4. Logs, credenciais rotativas e estado final das integrações: verificar antes de novas alterações de produção.
5. Nenhuma alteração de produção sem plano de impacto e rollback.

## Regras de trabalho

- Modelo MASTER + 1 sprint temporário por vez. Nunca dois sprints ativos.
- Sprint nunca faz push em `main`; para antes de PR/merge/deploy e entrega relatório.
- Execução comercial (publicação, outreach, proposta, faturamento) é **sempre um
  portão separado**, posterior ao sprint que a planejou.

## Ambiente — armadilhas conhecidas

- O repositório vive em pasta sincronizada pelo iCloud. Arquivos podem ficar
  `dataless` (evictos): aparecem com tamanho normal, mas a leitura falha com
  `Operation timed out`.
- **Ocorrido em 2026-08-02:** `.git/logs/HEAD` e `.git/logs/refs/heads/main`
  ficaram `dataless` e ilegíveis. Consequência: `git switch` falha com
  `unable to append to '.git/logs/HEAD'`, mesmo com
  `core.logAllRefUpdates=false`, porque o Git anexa ao reflog sempre que o
  arquivo existe. `brctl download` não recupera. Commits e troca de branch
  ficam bloqueados até o reflog ser recuperado ou movido de lado.
- Comandos git que reescrevem muitos arquivos precisam de timeout longo
  (10 min ou mais).
