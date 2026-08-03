# CURRENT_SPRINT — Swissperiences

> Existe apenas UM sprint ativo por vez. Este arquivo descreve o sprint corrente
> (ou o último concluído).

## SPRINT 03 — Portão Jurídico e Administrativo (fase documental)

- **Status:** **CONCLUÍDO NO ESCOPO DOCUMENTAL.** O portão jurídico **não** foi
  liberado.
- **Data:** 2026-08-02
- **Objetivo:** determinar o caminho legal mais simples para emitir uma primeira
  fatura de piloto pago, sem comprometer o chômage e sem criar estrutura
  empresarial prematura.

> **Leitura obrigatória deste status.** O sprint entregou pesquisa e preparação.
> Ele **não** estabelece que o Cauêh pode faturar, receber, prospectar ou operar
> como independente. Nada disso está autorizado.

### O que foi feito

1. Consulta a fontes oficiais, com nível de verificação declarado por afirmação:
   SECO/arbeit.swiss, AFC/ESTV, PFPDT/EDÖB, mementos AVS 2.02 e 2.09.
2. Separação explícita entre **confirmado por fonte oficial direta**, **fonte
   oficial acessada indiretamente**, **hipótese** e **pendência que só a
   autoridade pode responder** para o caso concreto.
3. Reclassificação dos registros do NS1/NS2 (forma jurídica, TVA, LVF, Sàrl) como
   **registros pessoais a verificar**, não fatos oficiais atuais.
4. Matriz de quatro opções de faturamento.
5. Listas de perguntas prontas por destinatário — ORP/caisse, AVS, fisco/TVA.
6. Checklist de documentos exigidos antes de cada gesto comercial.
7. Desenho do piloto-base **sem dados pessoais de hóspede**.

O dossiê completo foi entregue ao Cauêh em 2026-08-02. Seu conteúdo essencial
está consolidado em `PROJECT_STATE.md` e `DECISIONS.md` — o repositório não
depende de arquivo externo para saber o que sabemos hoje.

### Limites de verificação declarados

- O texto da LACI **não foi lido na fonte primária**: a página do Fedlex exige
  JavaScript. **Nenhum artigo da LACI está registrado como verificado
  diretamente.**
- O memento AVS 2.09 retornou HTTP 403 e não foi lido na íntegra.
- A Directive LACI IC (SECO) não foi lida na íntegra.

### Resultado

- **Uma única fonte foi lida diretamente** (SECO/arbeit.swiss): dever de declarar
  qualquer trabalho, ganho intermediário podendo vir de atividade independente,
  obrigação de declarar início de atividade independente, aptidão para colocação
  como condição contínua.
- **A pesquisa realizada não encontrou fonte oficial que estabeleça proibição
  geral de prospecção ou de fatura pontual; isso não confirma permissão no caso
  individual do Cauêh.** Também **nenhuma fonte confirma** que ganho
  intermediário autorize atividade independente.
- **Risco central identificado e não resolvido:** o piloto tem um único cliente,
  o que levanta risco de requalificação como atividade dependente pela caisse de
  compensation.
- **TVA não está resolvida.** Uma fatura isolada de piloto é materialmente
  inferior ao limiar geral de CHF 100.000, o que não basta para determinar o
  tratamento — o limiar depende da entidade que efetivamente faturar, de eventual
  inscrição voluntária e do lugar da prestação. Ver `DECISIONS.md`.
- **Proteção de dados:** sem processamento de dados pessoais de hóspedes em nome
  da propriedade, o piloto-base evita o cenário de subcontratação relativo a
  esses dados. Isso **não elimina** eventuais obrigações relacionadas a dados de
  representantes da propriedade, contratos, faturamento ou comunicações.

### Limites deste sprint — o que NÃO foi feito

- **Nenhuma entidade contatada:** ORP, caisse, AVS, fisco, advogado, fiduciário,
  propriedades, Pascal, Startups.ch, UBS.
- Nenhum registro, inscrição, afiliação ou alteração empresarial.
- Nenhum outreach, proposta ou envio.
- Nenhuma conclusão jurídica sem fonte citada e sem nível de verificação.
- Nenhum arquivo alterado fora de `docs/project/`. Nenhum push, PR, merge,
  deploy, alteração em produção.

### Critérios de aceite

| Critério | Situação |
|---|---|
| Afirmações classificadas por nível de verificação | Feito |
| Nenhuma conclusão jurídica sem fonte oficial citada | Feito |
| Registrado que ganho intermediário **não** autoriza automaticamente atividade independente | Feito |
| Perguntas prontas por destinatário | Feito |
| Matriz das opções de faturamento | Feito |
| Checklist de documentos por gesto | Feito |
| Cenário de dados pessoais em duas versões | Feito |
| Bloqueio legal separado de bloqueio interno | Feito |
| Nenhum contato externo | Cumprido |
| Nenhum commit sem autorização | Cumprido |

## Próximo portão — VALIDAÇÃO EXTERNA

**Não é continuação da pesquisa documental.** O próximo portão depende de
**respostas escritas das autoridades** — ORP/caisse cantonale, caisse de
compensation (AVS) e fisco/AFC — obtidas pelo Cauêh.

Enquanto elas não chegarem:

- outreach permanece bloqueado **por prudência interna**, não por proibição legal
  confirmada;
- proposta, assinatura, faturamento e recebimento permanecem bloqueados;
- nenhum registro empresarial é feito.

Pendências factuais que dependem só do Cauêh: data exata do fim do direito,
diárias restantes, status real da Raison Individuelle (constituída ou apenas
planejada), documentos da Startups.ch, canal escrito do conselheiro ORP.

## Histórico

### SPRINT 02 — Reenquadramento Estratégico: Alpine Sanctuaries — CONCLUÍDO (2026-08-02)

Definição da marca em uma frase; B2C e B2B separados; restrição eliminatória
registrada (o negócio não pode depender da presença contínua do Cauêh);
reauditoria dos 8 drafts GetYourGuide, nenhum sobrevivente; comparação de três
testes pequenos e equivalentes; recomendação do piloto pago de guest experience
editorial, com a camada editorial como sequenciamento e não como segundo
negócio. Commit `01c986a`. Sem push, sem deploy.

### SPRINT 01 — Base Segura e Fonte de Verdade — CONCLUÍDO (2026-07-30)

Backup de Stones & Water em commit local `d0425d7` (`swissperiences-audio`);
`main` sincronizado por fast-forward `8289350` → `6ca3247`; três documentos de
projeto criados na branch `docs/project-state` (`cba2d08`). Sem push, sem deploy.
Fast-forward interrompido por timeout do iCloud e recuperado com `git restore`
cirúrgico + novo `merge --ff-only`, sob autorização explícita.
