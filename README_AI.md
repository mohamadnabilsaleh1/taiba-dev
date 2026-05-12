Ask AI (Grok) setup

- The app includes a new page at `/ask-ai` where you can ask an AI question from the sidebar.
- Server API route: `/api/grok` — it will proxy to an external Grok endpoint only if you configure the following environment variables in your deployment or a local `.env.local` file:

  - `GROK_API_URL` — the full URL of the Grok API endpoint to POST to.
  - `GROK_API_KEY` — your Grok API key (keep this secret).

- For quick local testing you may check the "Use custom API key" checkbox on the `/ask-ai` page and paste your key; the key will be sent to the server endpoint and used for that request only. This is convenient for testing but not recommended for production.

- If `GROK_API_URL` is not configured the server returns a simulated response so the UI still demonstrates behavior.

Security note
- Never commit your API keys to source control. Prefer storing keys in environment variables or a secrets manager.
