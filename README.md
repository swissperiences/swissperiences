# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## DISCOVERY Agent Integration

The Discovery feature supports automated pack creation via a weekly research agent (AgentHub-based, separate repo).

### Endpoint

```
POST https://rhoxismvcalqppbnndew.supabase.co/functions/v1/create-discovery-draft
```

### Authentication

Header: `x-agent-secret: <AGENT_SECRET>`

The `AGENT_SECRET` must be set as a Supabase Edge Function secret:
```bash
supabase secrets set AGENT_SECRET="your-secret-value"
```

### Request body

```json
{
  "title_pt": "Festival das Tulipas de Morges",
  "title_en": "Morges Tulip Festival",
  "season": "spring",
  "price_chf": 480,
  "duration_days": 1,
  "max_guests": 6,
  "cover_image_url": "https://...",
  "highlight_event": "Festival des Tulipes de Morges",
  "event_dates": { "start": "2025-03-27", "end": "2025-05-11" },
  "includes": [
    { "label_pt": "Transfer privado", "label_en": "Private transfer", "icon_name": "car" },
    { "label_pt": "Almoço curado", "label_en": "Curated lunch", "icon_name": "utensils" }
  ]
}
```

### Response

```json
{ "id": "uuid", "slug": "morges-tulip-festival-spring-2025" }
```

Packs are created with `status: draft`. An admin reviews and activates them at `/admin/discovery`.

### Environment variables (agent side)

| Variable | Value |
|----------|-------|
| `SUPABASE_FUNCTION_URL` | `https://rhoxismvcalqppbnndew.supabase.co/functions/v1/create-discovery-draft` |
| `AGENT_SECRET` | Shared secret (same as Supabase edge function secret) |
