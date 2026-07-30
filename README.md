# Forgiveness-lee

An apology site for Lee — same step layout as Mybaby-lee, red hearts theme, connected to Supabase.

## Setup

1. Put your Supabase keys in `config.js`:

```js
const SUPABASE_URL = "https://upzvqcycbgmrqjqssscy.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
const SUPABASE_PROJECT_ID = "upzvqcycbgmrqjqssscy";
```

2. Create the table in Supabase (project `upzvqcycbgmrqjqssscy`):

- Open [SQL Editor](https://supabase.com/dashboard/project/upzvqcycbgmrqjqssscy/sql/new)
- Paste and run `supabase/schema.sql`

3. Open `index.html` locally (or deploy via GitHub Pages).

## Pages

- `index.html` — her experience (feelings → love/sorry → regret → do better → send)
- `responses.html` — your view of her answers

## Table

`forgiveness_responses`

| column | type |
| --- | --- |
| feelings | text[] |
| regret_response | text |
| do_better | text |
| created_at | timestamptz |
# baby-forgive-me
