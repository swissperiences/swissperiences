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

## 2026-08-02 (Sprint 03 — Portão Jurídico: pesquisa documental)

### Status do portão

- **Sprint 03 concluído no escopo documental. O portão jurídico NÃO foi
  liberado.** Pesquisa e preparação terminaram; a autorização para vender, não.
- **Não está estabelecido** que o Cauêh possa faturar, receber, prospectar
  comercialmente ou operar como independente. Nenhuma decisão deste log deve ser
  lida nesse sentido.
- **Próximo portão: VALIDAÇÃO EXTERNA** — depende de respostas escritas do
  ORP/caisse cantonale, da caisse de compensation (AVS) e do fisco/AFC, obtidas
  pelo Cauêh. **Não é continuação da pesquisa documental.**

### Confirmado por fonte oficial direta

Fonte única lida diretamente: SECO / arbeit.swiss, FAQ sobre indenização de
desemprego, consultada em 2026-08-02.

- Dever de informar ORP e caisse, com antecedência, de qualquer trabalho durante
  o recebimento da indenização.
- Ganho intermediário pode vir de trabalho independente ou assalariado;
  compensação de 80% ou 70% da diferença para o salário segurado.
- Início de atividade independente é mudança de declaração obrigatória.
- Aptidão para colocação é condição contínua do direito.

### Não confirmado — registro explícito

- **Ganho intermediário NÃO autoriza automaticamente atividade independente.** A
  fonte oficial mostra que a renda *pode* ser tratada como ganho intermediário;
  não diz que a atividade está autorizada por padrão. Declaração, avaliação do
  ORP e manutenção da aptidão são condições. **Segue não confirmado.**
- **Nenhum artigo da LACI foi lido na fonte primária** — a página do Fedlex exige
  JavaScript. Nada relativo aos art. 24 ou 71a e seguintes está registrado como
  verificado diretamente. O memento AVS 2.09 retornou HTTP 403.

### Bloqueios — natureza separada

- **Bloqueio legal confirmado:** dever de declarar qualquer trabalho e dever de
  manter a aptidão para colocação.
- **Bloqueio interno, por prudência da Swissperiences:** outreach, prospecção,
  proposta, assinatura, faturamento, recebimento e registro empresarial.
  **A pesquisa realizada não encontrou fonte oficial que estabeleça proibição
  geral; isso não confirma permissão no caso individual do Cauêh.** São decisão
  nossa, vigente até
  existir resposta escrita — e podem ser levantados por decisão do Cauêh assim
  que a informação chegar.

### Desenho do piloto

- **Piloto-base sem dados pessoais de hóspede** — decisão de desenho, não
  consequência jurídica: sem nome, e-mail, telefone, datas de estadia, número de
  reserva, PMS ou acesso a sistemas da propriedade. O entregável é conteúdo
  editorial e curatorial sobre o lugar. Sem processamento de dados pessoais de
  hóspedes em nome da propriedade, o piloto-base **evita o cenário de
  subcontratação relativo a esses dados**. Isso **não elimina** eventuais
  obrigações relacionadas a dados de representantes da propriedade, contratos,
  faturamento ou comunicações. A versão com dados pessoais de hóspedes fica
  apenas como cenário futuro comparativo.

### Riscos e itens simples

- **Risco central, não resolvido:** o piloto tem **um único cliente**. O status
  de independente é decidido pela caisse de compensation caso a caso e por
  atividade, e vários clientes é que apontam para independência. Risco real de
  requalificação como atividade dependente.
- **TVA — não resolvida.** O limiar geral de liberação é CHF 100.000 de
  prestações tributáveis por ano, e uma fatura isolada de piloto é
  materialmente inferior a esse limiar. **Isso não resolve sozinho o tratamento
  da TVA:** o limiar se aplica à situação fiscal e ao volume de negócios
  relevante **da entidade que efetivamente faturar**, e ainda pesam eventual
  inscrição voluntária e o lugar da prestação. Nota: o prévisionnel do NS1
  (CA de 133k/ano) ultrapassaria o limiar.

### Opção "atividade no nome do Pascal"

- **Permanece analisada e preliminarmente rejeitada. Não é rota ativa** e não
  será desenvolvida como rota operacional, salvo descoberta documental que mude
  materialmente o risco.
- **Pascal Brönnimann é parceiro de vida do Cauêh; não está estabelecido que seja
  parceiro de negócio da Swissperiences.** A análise é sobre risco estrutural,
  não sobre confiança.
- Motivo mais forte que o compliance: se o piloto fosse faturado no nome dele, a
  Swissperiences **perderia a prova de que ela própria conseguiu vender** — que é
  a única razão de o teste existir.
- Demais dimensões: dependência financeira do repasse, propriedade jurídica do
  cliente e do contrato ficando juridicamente com Pascal, e **compliance UBS**,
  cuja verificação cabe exclusivamente a ele.

### Registros pessoais reclassificados — não são fatos oficiais atuais

- NS1 (30.03–14.04.2026), NS2 (29.04–29.05.2026), escolha da Raison Individuelle,
  isenção de TVA e parecer sobre a LVF passam a constar como **registros
  pessoais/documentais a verificar**, com origem em abril de 2026.
- **A afirmação de que a Sàrl "não existe juridicamente" fica revogada e vira
  hipótese.** Ausência no Zefix e não depósito dos CHF 20.000 são indícios
  fortes, não conclusão. Permanecem abertos: mandato e condições gerais da
  Startups.ch, faturas emitidas ou em aberto, conta de consignação, eventual ato
  notarial sem inscrição, custos de encerramento e se algum documento nomeia o
  Cauêh. Quem responde é o Pascal, com os documentos.
- **O parecer de que a LVF não se aplica foi dado para o modelo B2C de
  experiências.** O modelo B2B é serviço de curadoria e provavelmente sai do
  escopo, mas a conclusão **não é herdada**.

### Pendências factuais que dependem só do Cauêh

1. Data exata do fim do direito ao chômage e número de diárias restantes.
2. Status real da Raison Individuelle: constituída ou apenas planejada no NS1
   (verificar IDE, registo de comércio, afiliação AVS).
3. Documentos da Startups.ch relativos à Sàrl.
4. Nome e canal escrito do conselheiro ORP.
