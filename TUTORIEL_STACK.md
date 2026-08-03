# Tutoriel Stack — Infomaniak + Vercel + Supabase + Resend

Guide pratique pour héberger un site moderne (React/Next/Vite) avec domaine Infomaniak, hébergement gratuit Vercel, base de données Supabase et emails transactionnels Resend.

---

## 1. Vue d'ensemble — qui fait quoi

| Service | Rôle | Coût |
|---|---|---|
| **Infomaniak** | Tu y as **acheté le nom de domaine** (ex: `monsite.ch`). C'est ton registrar — il garde le domaine et gère les **DNS**. | Payant (le domaine) |
| **Vercel** | **Héberge le site** (front-end + API serverless). Build automatique à chaque `git push`. | **Gratuit** (plan Hobby) |
| **Supabase** | **Base de données PostgreSQL + Auth + Storage + Edge Functions**. Le "backend" complet. | **Gratuit** (jusqu'à 500 MB DB, 50k MAU) |
| **Resend** | **Envoi d'emails transactionnels** (confirmations, newsletters, notifications). | **Gratuit** (3 000 emails/mois) |

**Schéma mental:**
```
Utilisateur
    ↓
[Infomaniak DNS] → pointe monsite.ch vers...
    ↓
[Vercel] → sert le site React + routes API
    ↓                ↓
[Supabase]     [Resend]
   DB/Auth      Emails
```

Infomaniak ne fait **que** le domaine. Tout le reste tourne ailleurs, gratuitement.

---

## 2. Étape par étape

### Étape 1 — Préparer le code (si pas déjà fait)

Le projet doit être sur **GitHub** (ou GitLab/Bitbucket). Vercel se connecte au repo et déploie automatiquement.

```bash
git init
git add .
git commit -m "initial commit"
gh repo create monsite --public --source=. --push
```

### Étape 2 — Déployer sur Vercel (gratuit)

1. Aller sur [vercel.com](https://vercel.com) → "Sign up with GitHub"
2. **Import Project** → sélectionner le repo
3. Vercel détecte automatiquement le framework (Vite, Next.js, etc.)
4. Cliquer **Deploy** → en ~1 minute le site est en ligne sur `monsite.vercel.app`

**Important:** chaque `git push` sur `main` redéploie automatiquement. Les autres branches reçoivent une URL de preview.

### Étape 3 — Connecter le domaine Infomaniak à Vercel

C'est l'étape la plus délicate. Deux options:

#### Option A (recommandée) — Garder DNS chez Infomaniak

1. Sur **Vercel** → projet → **Settings** → **Domains** → ajouter `monsite.ch`
2. Vercel affiche les enregistrements DNS à créer (un `A` et un `CNAME`)
3. Sur **Infomaniak** → Manager → Domaines → `monsite.ch` → **DNS**
4. Ajouter:
   - Enregistrement `A` : `@` → `76.76.21.21` (IP Vercel)
   - Enregistrement `CNAME` : `www` → `cname.vercel-dns.com`
5. Attendre la propagation (5 min à 24 h, généralement <1 h)
6. Vercel génère automatiquement le **certificat HTTPS** (Let's Encrypt)

#### Option B — Déléguer les DNS à Vercel
Changer les nameservers chez Infomaniak vers ceux de Vercel. Plus simple si Vercel gère tout, mais on perd le contrôle DNS chez Infomaniak (utile si on a aussi des emails Infomaniak).

**→ Option A est meilleure si l'email pro est chez Infomaniak** (pour garder les MX records intacts).

### Étape 4 — Ajouter Supabase (base de données + auth)

1. Aller sur [supabase.com](https://supabase.com) → créer un compte → **New Project**
2. Choisir une région **proche** (West EU = Frankfurt pour la Suisse)
3. Noter le **mot de passe DB** (impossible de le récupérer après)
4. Une fois créé, aller dans **Settings → API** et copier:
   - `Project URL`
   - `anon public key`

5. Dans le code (exemple Vite/React):

```bash
npm install @supabase/supabase-js
```

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)
```

6. Créer un fichier `.env.local` (ne PAS commit) :
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

7. Sur **Vercel** → projet → **Settings → Environment Variables** : ajouter les mêmes variables (sinon le build prod ne les aura pas).

**Auth Google en 2 clics:**
Supabase → Authentication → Providers → Google → activer + ajouter les clés OAuth Google Cloud Console. Redirect URL à mettre dans Google Cloud: `https://xxxxx.supabase.co/auth/v1/callback`.

### Étape 5 — Resend pour les emails

1. [resend.com](https://resend.com) → créer un compte
2. **Domains** → ajouter `monsite.ch` → Resend donne 3 enregistrements DNS (SPF, DKIM, MX optionnel)
3. Retourner sur **Infomaniak DNS** → ajouter ces 3 enregistrements
4. Attendre la vérification (~10 min)
5. Récupérer la **clé API** dans **API Keys**

**Attention conflit MX:** si l'email pro est chez Infomaniak (kSuite/Mail Service), **NE PAS** mettre le MX de Resend. Resend n'a besoin que de SPF + DKIM pour **envoyer**. Les MX servent à **recevoir** — ils restent ceux d'Infomaniak.

**Exemple d'envoi (route API Vercel):**

```ts
// api/send-email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  await resend.emails.send({
    from: 'contact@monsite.ch',
    to: req.body.email,
    subject: 'Bienvenue!',
    html: '<p>Merci pour ton inscription.</p>',
  })
  res.json({ ok: true })
}
```

Ajouter `RESEND_API_KEY` dans **Vercel → Environment Variables**.

---

## 3. Workflow quotidien

```bash
# 1. Coder en local
npm run dev

# 2. Commit & push
git add .
git commit -m "feat: nouvelle page contact"
git push

# 3. Vercel déploie automatiquement (~1 min)
# → site mis à jour sur monsite.ch
```

**Preview deployments:** chaque branche/PR reçoit son URL unique (`monsite-git-feature-x.vercel.app`). Idéal pour tester avant de merger.

---

## 4. Récapitulatif des coûts (cas typique)

| Service | Plan | Limite | Coût |
|---|---|---|---|
| Infomaniak | Domaine `.ch` | — | ~CHF 12/an |
| Vercel | Hobby | 100 GB bandwidth/mois | **0 CHF** |
| Supabase | Free | 500 MB DB, 50k users | **0 CHF** |
| Resend | Free | 3 000 emails/mois, 1 domaine | **0 CHF** |
| **Total** | | | **~12 CHF/an** |

Tant que le trafic est raisonnable (< quelques milliers de visiteurs/jour), tout reste gratuit.

---

## 5. Pièges courants

1. **DNS pas propagé** → utiliser [dnschecker.org](https://dnschecker.org) pour vérifier
2. **Variables d'environnement oubliées sur Vercel** → le site marche en local mais crash en prod
3. **MX Resend qui écrase l'email Infomaniak** → ne JAMAIS toucher au MX si email pro chez Infomaniak
4. **Clé `service_role` Supabase exposée côté front** → ne JAMAIS l'utiliser dans le client, **uniquement** dans les routes API serverless
5. **CORS sur les routes API** → si appelées depuis un autre domaine, configurer les headers dans `vercel.json`

---

## 6. Pour aller plus loin

- **Stripe** pour les paiements (plug & play avec Vercel + Supabase)
- **Upstash Redis** pour le rate limiting des routes API (gratuit jusqu'à 10k req/jour)
- **Plausible/Umami** pour l'analytics respectueux du RGPD
- **Supabase Edge Functions** pour la logique backend lourde (Deno)

---

**TL;DR pour ton ami:** Infomaniak = juste le domaine. Vercel héberge gratuitement. Supabase = backend gratuit. Resend = emails gratuits. Il pointe les DNS Infomaniak vers Vercel, et c'est parti — le tout pour ~12 CHF/an.
