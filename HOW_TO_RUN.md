# 🚀 Como Rodar o Projeto Completo (Frontend + API)

## ⚠️ PROBLEMA IDENTIFICADO

O comando `npm run dev` **APENAS roda o Vite** (frontend na porta 8080).

As funções API em `/api/*` **NÃO são servidas** pelo Vite - elas precisam do **Vercel Dev Server**.

---

## ✅ SOLUÇÃO: Rodar Vercel Dev

### **Opção 1: Vercel Dev (Recomendado)**

```bash
# Pare o npm run dev atual (Ctrl+C)

# Rode o Vercel Dev Server
vercel dev
```

**O que acontece:**
- Vercel Dev roda **TUDO** em uma porta (geralmente 3000)
- Serve o frontend (Vite)
- Serve as funções API (`/api/*`)
- Carrega automaticamente o `.env`

**Acesse:** `http://localhost:3000`

---

### **Opção 2: Dois Terminais (Desenvolvimento Avançado)**

**Terminal 1 - API Server:**
```bash
vercel dev --listen 3000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Acesse:** `http://localhost:8080` (com proxy configurado)

---

## 🔧 Configurações Aplicadas

### **1. Vite Proxy (`vite.config.ts`)**
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

**Isso faz:** Requisições para `/api/*` no port 8080 são redirecionadas para port 3000.

### **2. Scripts Adicionados (`package.json`)**
```json
{
  "dev:api": "vercel dev --listen 3000",
  "dev:full": "npm run dev"
}
```

---

## 📋 Passo a Passo AGORA

### **1. Pare o servidor atual:**
```bash
# No terminal onde está rodando npm run dev
Ctrl + C
```

### **2. Rode o Vercel Dev:**
```bash
vercel dev
```

**Se pedir para fazer login:**
```bash
vercel login
```

**Se pedir para linkar o projeto:**
- Escolha: "Link to existing project" ou "Create new project"
- Siga as instruções

### **3. Acesse:**
```
http://localhost:3000
```

### **4. Teste o formulário:**
- Vá para `/for-teams`
- Preencha e envie
- **AGORA você verá os logs no terminal!**

---

## 🎯 O Que Esperar

**No terminal você verá:**
```
============================================================
--- API CALL STARTED (CORPORATE INQUIRY) ---
Timestamp: 2026-01-22T...
Method: POST
============================================================

🔑 CHAVE PRESENTE? true
✅ API Key loaded successfully

[CORPORATE API] 🚀 Processing corporate inquiry for: ...
[CORPORATE API] 💾 Step 1: Attempting to save to database...
[CORPORATE API] ✅ Step 1 complete
[CORPORATE API] 📧 Step 2: Attempting to send user email...
[CORPORATE API] ✅ Step 2 complete: User email sent successfully
[CORPORATE API] 📧 User email ID: abc-123-def
...
```

**E você receberá os emails!** ✅

---

## 🐛 Troubleshooting

### **"vercel: command not found"**
```bash
npm install -g vercel
```

### **"Port 3000 already in use"**
```bash
# Use outra porta
vercel dev --listen 3001

# E atualize o proxy no vite.config.ts para 3001
```

### **Ainda não funciona?**
- Verifique se o `.env` está na raiz do projeto
- Rode `vercel env pull` para baixar variáveis do Vercel (se tiver projeto linkado)

---

## 🎉 Resumo

**ANTES:**
- `npm run dev` → Só frontend (8080)
- APIs não funcionavam ❌

**AGORA:**
- `vercel dev` → Frontend + APIs (3000)
- Tudo funciona ✅

**RODE AGORA:**
```bash
vercel dev
```
