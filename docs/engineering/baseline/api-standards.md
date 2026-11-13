# API & Webhook Standards

## 1. RESTful Conventions
- Use standard HTTP verbs: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).
- Return standardized JSON error envelopes: { error: true, code: "ERR_CODE", message: "Explanation" }.

## 2. Webhook Ingress (Meta WhatsApp / n8n)
- Immediate 200 OK acknowledgment on webhook intake.
- Asynchronous queuing/processing for LLM reasoning or database persistence.
- Signature verification (HMAC SHA-256) on incoming Meta WhatsApp webhooks.
