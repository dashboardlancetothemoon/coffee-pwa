# Café Guide — PWA

PWA d'optimisation de recettes de café distribuée aux clients d'une boutique.  
Coût d'infrastructure : **0 €/mois** (Cloudflare Pages free + Supabase free).

## Stack

| Couche | Outil |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript strict |
| UI | Tailwind CSS v4 + shadcn/ui (Base UI) |
| Base de données | Supabase Postgres + Auth + RLS |
| PWA | Serwist (service worker + précache + offline) |
| Hébergement | Cloudflare Pages (free tier illimité) |

## Démarrage local

```bash
cp .env.example .env.local
# Renseigner les variables Supabase

npm install
npm run dev        # http://localhost:3000
```

## Base de données

1. Créer un projet sur [supabase.com](https://supabase.com)
2. SQL Editor → coller `supabase/migrations/001_initial_schema.sql`
3. (optionnel) coller `supabase/migrations/002_seed_data.sql` pour les données de démo

## Déploiement Cloudflare Pages

1. Connecter le repo dans le dashboard Cloudflare Pages
2. Framework preset : **Next.js**
3. Build command : `npm run build --webpack`
4. Build output : `.next`
5. Variables d'env : copier depuis `.env.example`

## Rôle admin

```sql
-- Dans la console Supabase SQL Editor
UPDATE auth.users
SET app_metadata = jsonb_set(app_metadata, '{role}', '"admin"')
WHERE email = 'admin@example.com';
```

L'interface admin est accessible sur `/admin`.

## Keepalive Supabase (free tier)

Configurer un cron hebdomadaire sur [cron-job.org](https://cron-job.org) :
`GET https://<domaine>/api/health`

## Structure du projet

```
app/
  (client)/          # App PWA (auth requise)
    catalogue/       # Liste des cafés par catégorie
    recette/[id]/    # Recette optimisée machine × café
    profil/          # Changement de machine
  admin/             # Interface admin (rôle admin requis)
    machines/        # CRUD machines
    coffee-types/    # CRUD types de café
  auth/              # Login / signup client
  api/               # Routes publiques
    machines/        # GET — liste machines
    coffee-types/    # GET — liste cafés
    recipes/         # GET ?coffee_type_id=…&machine_id=…
    health/          # GET — keepalive

lib/
  recommendation.ts  # Moteur de règles (0 LLM, 100% déterministe)
  supabase/          # Clients browser / server / admin
  actions/           # Server Actions (auth, machines, café, profil)
  schemas/           # Zod (machine, coffee-type)

supabase/
  migrations/        # SQL versionnés
```

## PWA — checklist installation

- **Android / Chrome** : bannière « Installer » automatique via `beforeinstallprompt`
- **iOS / Safari** : bannière d'instructions « Partager → Sur l'écran d'accueil »
- Icônes : 192px, 512px (maskable), 180px apple-touch-icon
- Offline : page `/offline` + cache NetworkFirst sur les API
- `viewport-fit=cover` + `safe-area-inset-bottom` pour les encoches iPhone
