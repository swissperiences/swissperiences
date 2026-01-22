# Configuração DNS para Resend - swissperiences.ch

## 📧 Verificação de Domínio no Resend

Para que os emails sejam enviados oficialmente de `hello@swissperiences.ch` (ao invés de `onboarding@resend.dev`), você precisa verificar o domínio no painel do Resend.

---

## 🔧 Passos para Configuração

### 1. Acessar o Painel do Resend

1. Faça login em: https://resend.com/login
2. Navegue até: **Domains** (no menu lateral)
3. Clique em: **Add Domain**
4. Digite: `swissperiences.ch`

---

### 2. Registros DNS Necessários

Após adicionar o domínio, o Resend fornecerá **3 tipos de registros DNS** que você precisa adicionar no seu provedor de DNS (ex: Cloudflare, GoDaddy, Namecheap, etc.):

#### **A. Registro SPF (TXT)**
```
Type: TXT
Name: @ (ou swissperiences.ch)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600 (ou Auto)
```

**Propósito:** Autoriza o Resend a enviar emails em nome do seu domínio.

---

#### **B. Registro DKIM (TXT)**
```
Type: TXT
Name: resend._domainkey (ou similar - Resend fornecerá o nome exato)
Value: [Chave DKIM fornecida pelo Resend - string longa começando com "v=DKIM1"]
TTL: 3600 (ou Auto)
```

**Propósito:** Assina digitalmente os emails para provar autenticidade.

**Exemplo do valor:**
```
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

---

#### **C. Registro DMARC (TXT) - Opcional mas Recomendado**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:hello@swissperiences.ch
TTL: 3600 (ou Auto)
```

**Propósito:** Define política de autenticação e recebe relatórios de emails rejeitados.

**Políticas disponíveis:**
- `p=none` - Apenas monitora (recomendado para início)
- `p=quarantine` - Coloca emails suspeitos em spam
- `p=reject` - Rejeita emails não autenticados

---

### 3. Registros MX (Opcional - Apenas se quiser RECEBER emails)

Se você quiser **receber** emails em `hello@swissperiences.ch` (não apenas enviar), precisará configurar registros MX:

```
Type: MX
Name: @ (ou swissperiences.ch)
Priority: 10
Value: [Servidor de email do seu provedor]
TTL: 3600
```

**Nota:** O Resend **NÃO fornece serviço de recebimento de emails**. Você precisará usar:
- Google Workspace (Gmail para domínios)
- Microsoft 365
- Zoho Mail
- Outro provedor de email

---

## 📋 Checklist de Configuração

### No Painel do Resend:
- [ ] Adicionar domínio `swissperiences.ch`
- [ ] Copiar os registros DNS fornecidos

### No Provedor de DNS:
- [ ] Adicionar registro SPF (TXT)
- [ ] Adicionar registro DKIM (TXT)
- [ ] Adicionar registro DMARC (TXT) - opcional
- [ ] Aguardar propagação DNS (pode levar até 48h, geralmente 1-2h)

### Verificação:
- [ ] Clicar em "Verify Domain" no painel do Resend
- [ ] Aguardar status mudar para "Verified" ✅

---

## 🔍 Como Verificar os Registros DNS

### Opção 1: Ferramenta Online
Use: https://mxtoolbox.com/SuperTool.aspx

**Testes:**
- SPF: `spf:swissperiences.ch`
- DKIM: `dkim:resend._domainkey.swissperiences.ch`
- DMARC: `dmarc:swissperiences.ch`

### Opção 2: Terminal (Linux/Mac)
```bash
# Verificar SPF
dig TXT swissperiences.ch

# Verificar DKIM
dig TXT resend._domainkey.swissperiences.ch

# Verificar DMARC
dig TXT _dmarc.swissperiences.ch
```

---

## ⚠️ Notas Importantes

### 1. Propagação DNS
- Mudanças DNS podem levar de **15 minutos a 48 horas** para propagar globalmente
- Geralmente leva **1-2 horas** na prática
- Use `dig` ou MXToolbox para verificar se propagou

### 2. Enquanto o Domínio Não Está Verificado
- Os emails continuarão sendo enviados de `onboarding@resend.dev`
- Isso é **normal e funcional** - os emails chegam normalmente
- Apenas o remetente aparece diferente

### 3. Após Verificação
- Os emails serão enviados de `hello@swissperiences.ch`
- Melhor deliverability (menos chance de ir para spam)
- Branding profissional

---

## 🎯 Valores Exatos do Resend

**IMPORTANTE:** Os valores exatos dos registros DNS (especialmente DKIM) são **únicos para sua conta Resend**.

Você precisa:
1. Acessar https://resend.com/domains
2. Adicionar o domínio `swissperiences.ch`
3. Copiar os valores **exatos** fornecidos pelo Resend
4. Adicionar no seu provedor de DNS

---

## 📧 Configuração Atual

### ✅ Já Configurado:
- `RESEND_API_KEY` - Configurado no `.env`
- `RESEND_AUDIENCE_ID` - Configurado no `.env` (`473cb3ee-c67f-4341-a4bf-397d4a7069ac`)
- Newsletter opt-in - Funcionando (usuários são adicionados à audiência quando marcam o checkbox)

### ⏳ Pendente:
- Verificação do domínio `swissperiences.ch` no Resend
- Adição dos registros DNS (SPF, DKIM, DMARC)

---

## 🚀 Próximos Passos

1. **Acesse o painel do Resend** e adicione o domínio
2. **Copie os registros DNS** fornecidos
3. **Adicione no seu provedor de DNS** (Cloudflare, GoDaddy, etc.)
4. **Aguarde a propagação** (1-2 horas)
5. **Verifique o domínio** no painel do Resend
6. **Teste o envio** - os emails virão de `hello@swissperiences.ch` ✅

---

## 📞 Suporte

Se tiver problemas:
- **Resend Support:** https://resend.com/support
- **Documentação:** https://resend.com/docs/dashboard/domains/introduction
