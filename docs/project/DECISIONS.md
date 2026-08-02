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

## 2026-08-02 (Sprint 02 — Reenquadramento Estratégico)

### Identidade

- **Definição adotada.** A Swissperiences transforma lugares excepcionais dos
  Alpes em experiências de hóspede cuidadosamente curadas — como marca editorial
  para viajantes e serviço de guest experience para propriedades boutique.
- **B2B é hipótese de monetização em teste**, não empresa nem produto validado.
  Nenhum cliente pagante, nenhuma recorrência comprovada.
- **Alpine Sanctuaries permanece a identidade da marca.**
- **Papel do Cauêh: curador/editor.** Não guia, não motorista, não operador de
  estadias.

### Restrição eliminatória (nova)

- **O negócio não pode depender da presença contínua do Cauêh.** Isto não é
  "risco de overload" — é filtro que elimina opções antes da avaliação
  econômica. Toda comparação anterior que tratava operação founder-hosted como
  ativo pronto está revogada.

### Benchmark de campo — uso estritamente interno

- Um retiro observado em campo (Lago de Lugano, agosto 2026) confirmou o padrão
  "o lugar é o destino" com curadoria local integrada. Registrado apenas com
  fatos de fontes públicas: hotel all-suites de 15 suítes dentro de um resort
  maior, integração lago-montanha-design-wellness, spa e restaurante próprios,
  programa próprio de atividades locais curadas.
- **Proibido em material comercial:** nome, marca, imagens, linguagem
  característica do benchmark, ou qualquer coisa que sugira parceria, endosso ou
  associação. Portfólio e pitch usam **princípios próprios da Swissperiences**
  (registrados em `PROJECT_STATE.md`), não a referência.
- **Observações de campo pendentes de Cauêh** — seção reservada, ainda vazia.
  Impressões pessoais, atritos da estadia, qualidade de serviço e comportamento
  do hóspede **não foram inventados** e serão preenchidos por ele.

### GetYourGuide

- **Rebaixado a canal de afiliado ou a experiências operadas por terceiros.**
- **Hospedagem não é comercializável no GYG** — reservas de acomodação constam
  como atividade restrita na política atual. Qualquer oferta de estadia avulsa
  está fora.
- **Os 8 drafts próprios (março + abril 2026) são legado incompatível.** Nenhum
  sobrevive aos não negociáveis: uns dependem de hospedagem inelegível, os
  outros de Cauêh guiando ou dirigindo; vários exigiriam validação jurídica
  adicional (licença de transporte de pessoas, seguro comercial, drone
  comercial). Tabela completa em `PROJECT_STATE.md`.
- **Existiam duas estratégias GYG paralelas e conflitantes** (março premium vs
  abril volume), nenhuma publicada em 5 meses. Sinal de que o gargalo é foco de
  execução, não falta de plano.

### Preço e evidência

- **Preços dos drafts de março (CHF 490/790) não são evidência de viabilidade.**
  Seguem pendentes e não verificados: custo real de duas noites, limpeza e
  turnover, provisões, deslocamento, comissão de canal, taxa de turismo,
  impostos, seguro de hóspede pagante, disponibilidade do imóvel, carga
  operacional e **autorização efetiva para comercializar o imóvel**.
- **"Pronto" não significa viável.** Texto redigido não é produto validado.

### Comparação refeita — testes equivalentes

Comparados três testes pequenos e do mesmo porte, nenhum exigindo software novo:

- **A — editorial/afiliado/lead-gen sem Cauêh guiando.** Passa nas restrições,
  mas receita potencial irrelevante dentro do runway sem audiência existente.
- **B — piloto manual de guest experience para uma propriedade.** Passa nas
  restrições, valida pagamento real, carga recorrente baixa, usa a força
  editorial já demonstrada.
- **C — camada editorial B2C como aquisição para o piloto B2B.** Não é um
  terceiro negócio: é o **sequenciamento correto de B**. A peça editorial é o
  material de venda.

- **Decisão recomendada: B**, com C como sequenciamento. **Não executar duas
  empresas.**
- **A rejeitado como teste de receita**; sobrevive apenas como peça de portfólio
  dentro de B.
- **Guia digital pago (CHF 29–49) avaliado e descartado como produto** —
  esforço baixo e sem operação, mas receita potencial incompatível com o runway.

### Primeiro teste monetizável — Guest Editorial Concierge (piloto pago)

- **Cliente-alvo:** uma propriedade boutique ou host premium na região
  alpina/lacustre, sem capacidade editorial própria.
- **Oferta:** produção manual da guest experience editorial da propriedade —
  contexto de pré-chegada e curadoria local, na marca da propriedade.
- **Preço: CHF 800–1.200 com 50% adiantado é FAIXA A VALIDAR, não preço
  comprovado.** O único sinal de validação aceito é **pagamento real recebido**.
  Elogio, reunião agendada, "adoraria" e intenção declarada não contam.
- **Sucesso:** 1 piloto pago. **Abandono:** 0 fechamentos após o limite de
  propostas acordado ou ao fim do prazo.
- **Tudo manual no piloto.** Sem SaaS, sem multi-tenant, sem login, sem
  automação.

### Limites registrados

- **Nada será publicado neste sprint.** A peça de portfólio começa como
  **protótipo privado ou demonstração sobre ativo próprio ou genérico**.
  Publicação, alteração do site e outreach continuam fora de escopo e exigem
  autorização posterior.
- **Nenhum software novo antes de cliente ou piloto pago.**
- **Reaproveitar `/enhance` apenas se não exigir mudança em produção.**
- **Qualquer execução comercial é outro portão**, posterior ao Sprint 02.
- **Portão jurídico/administrativo obrigatório antes de outreach, proposta,
  faturamento ou recebimento** — chômage/gain intermédiaire, forma jurídica e
  capacidade de faturar, impostos/AVS/TVA, uso de dados pessoais no guest
  portal, autorização para acesso a dados ou sistemas da propriedade. Detalhes
  em `PROJECT_STATE.md`.

### Hipótese futura — explicitamente NÃO é evidência

- Uma eventual escala de 10–20 propriedades a CHF 150–300/mês é **hipótese
  futura não validada**. Não fundamenta a decisão atual, não pressupõe
  recorrência e não pressupõe SaaS. Registrada apenas para não se perder.

### Pendências abertas

1. Observações de campo do Cauêh sobre o benchmark.
2. Validação do portão jurídico/administrativo.
3. Escolha da propriedade-alvo do piloto.
4. Papel comercial de Stones & Water.
5. Escolha do ativo próprio/genérico que servirá de base ao protótipo privado.
