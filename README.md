# Brand Visualizer

design the website given this document, i prefer the first logo but whichever one you decide to use, maintain its colours

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e268ef92-266b-4f91-8c78-f49e85fb4cc6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Project Workspaces

The client portal at `/client-portal` lets authenticated clients follow assigned project progress, read delivery updates, and message the iTheku team. The staff portal at `/admin-portal` manages client projects, publishes progress updates, and replies in project conversations.

### Connect Supabase

Set the project URL and publishable key in the local `.env` file. The browser uses the `VITE_` variables; the server-side lead form uses the server variables as well:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

The service-role key is used only by the authenticated server function that reads and triages private website requests. Never put it in a `VITE_` variable or expose it to the browser. Apply [the project workspaces migration](supabase/migrations/20261030000000_project_workspaces.sql) in the Supabase SQL Editor. It creates the profile, project, project-update and project-message tables, with row-level security and grants for authenticated users.

Create client accounts in Supabase Auth. A profile is created automatically for each Auth user. To grant a staff account access, set the trusted `app_metadata` role from the Supabase SQL Editor, replacing the email with the staff account:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'staff@example.com';
```

Have the staff user sign out and back in after changing the role so the refreshed access token carries the new claim. Clients do not need a role claim; row-level security limits them to their own projects and conversations.
