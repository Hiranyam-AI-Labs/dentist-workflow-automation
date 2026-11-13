# AI & Automation Standards

## 1. Standard Omnichannel & Multilingual Architecture
Every client project implementing automated customer communication (WhatsApp, Web, Voice) must adhere to this standardized sequential architecture:

```text
Channel Ingress (WhatsApp Text / Quick Reply / Voice Note / Web)
   ↓
Webhook Verification & Signature Validation
   ↓
Audio Processing Gate (If Voice Note):
   ├── 1. Get Meta Media URL (Graph API v21.0)
   ├── 2. Download Audio Binary (.ogg / Opus)
   ├── 3. Transcribe Speech (OpenAI Whisper-1: Marathi, Hindi, English vernacular)
   └── 4. Translate to English (OpenAI GPT-4o-mini: Context-aware English translation)
   ↓
Normalize Inbound Message (Merge original speech + English translation)
   ↓
PostgreSQL Persistence (customer_master upsert + conversation_history log)
   ↓
Domain-Specific Intent & Entity Extraction (Location, Budget, Service, Symptoms, Urgency)
   ↓
Filtered Database Inventory / Service Catalog Query
   ↓
Live IST Date & Time Ground Truth Injection (Asia/Kolkata)
   ↓
AI Agent Reasoning with Strict Validation & Guardrails (gpt-4o-mini)
   ↓
WhatsApp Markdown Sanitization (Regex: **text** -> *text*, strip rogue asterisks)
   ↓
Parallel Fast-Path Outbound Dispatch (Meta Graph API) & Asynchronous DB Updates
   ↓
Live Dashboard Sync (Real-time message feed, Token Usage, Live INR Forex Cost)
```

## 2. Multilingual Voice Note Pipeline
- **Sequential Execution**: Voice processing must execute linearly (Get URL ➔ Download Binary ➔ Whisper Transcribe ➔ English Translation ➔ Normalization) to prevent orphan node errors and parallel race conditions.
- **Native HTTP Request Integration**: Audio calls to OpenAI Whisper (`https://api.openai.com/v1/audio/transcriptions`) must use multipart form-data via standard HTTP Request nodes with `openAiApi` credentials rather than deprecated LangChain wrapper nodes.
- **Dual Representation**: Both the original spoken speech and the English translation must be stored in `conversation_history` and rendered on the live monitoring dashboard.

## 3. WhatsApp Messaging & Markdown Standards
- **Single Asterisk Bolding**: WhatsApp supports only single asterisks (`*bold*`). Double asterisks (`**bold**`) leave stray asterisks on the user's phone.
- **Automated Regex Sanitization**: All outbound message builders must sanitize responses before dispatch:
  ```javascript
  responseText = responseText.replace(/\*\*(.*?)\*\*/g, '*$1*').replace(/\*\*/g, '*');
  ```
- **Policy Compliance**: Adhere strictly to the 24-hour customer service window, explicit opt-out handling ("STOP", "थांबवा"), anti-flooding controls, and anti-ban green quality preservation.

## 4. Real-Time Telemetry & Financial Cost Tracking
- **Token Tracking**: Inbound and outbound token consumption (Prompt Tokens, Completion Tokens, Total Tokens) must be captured on every conversation turn.
- **Real-Time Live Forex**: AI cost calculations must dynamically fetch live USD to INR exchange rates (`https://open.er-api.com/v6/latest/USD`) with 10-minute caching. Static exchange rates are strictly prohibited.

## 5. Strict Workflow Validation & Action Execution Rules (Accuracy Over Speed)
Every assistant across all domains (Real Estate, Healthcare, E-Commerce) must adhere to these 5 mandatory validation rules:

1. **Date and Time Past-Validation**:
   - Never schedule a call, callback, appointment, or site visit for a date/time that has already passed.
   - Always compare requested date/time against the live injected India Standard Time (`Asia/Kolkata`).
   - If the requested time is in the past, politely notify the user and request a valid future date and time.
   - Never assume or fabricate date or time.

2. **Explicit Date and Time Requirement**:
   - Date and time must both be explicitly specified before scheduling.
   - Never schedule based on vague instructions ("tomorrow", "later", "in the evening") without resolving them to specific dates/times and confirming with the user.
   - Always confirm the final scheduled date and time with the user before completing the action.

3. **Accurate Conversation Summaries**:
   - When a user asks for a conversation summary, provide a structured 5-part summary based strictly on available history:
     - User Requirements
     - Information Provided
     - Decisions & Shortlists
     - Actions Completed
     - Pending Actions / Next Steps
   - Never claim a summary is unavailable when history exists.

4. **Zero-Hallucination Location URLs**:
   - Never generate or send unverified Google Maps URLs.
   - Only share location details, landmarks, distances, and URLs that are verified in the database.
   - If an exact map link is unavailable, provide verified address/landmark details instead of inventing a link.

5. **Pre-Action Final Validation Checklist**:
   - Verify Date/Time (Specific & Future), Conversation consistency, Location accuracy, and User intent before finalizing any booking or action.
   - If any validation check fails, pause the action and ask the user for clarification.

## 6. ChatGPT LLM Engine & LangChain Integration Standards
All conversational bots and AI automations must utilize OpenAI ChatGPT models under the following standard specifications:
- **Default Production Engine**: OpenAI **ChatGPT (`gpt-4o-mini`)** must be the default model across all n8n LangChain nodes (`@n8n/n8n-nodes-langchain.lmChatOpenAi`) and backend AI services.
- **Escalation Engine**: **`gpt-4o`** is reserved exclusively for high-complexity clinical triage, arbitration, or complex multi-turn synthesis.
- **Hyperparameter Standards**:
  - `temperature`: `0.2` (mandatory for deterministic, hallucination-free factual execution).
  - `builtInTools`: Offload calculation or database querying to dedicated tool nodes or database query nodes.
  - `response_format`: Must request strict JSON objects (`{ "type": "json_object" }`) in API mode and strict schema validation in n8n parser nodes.
- **Prompt Envelope Pattern**:
  ```text
  [System Role & Identity]
      +
  [User Raw Query & Session ID]
      +
  [Injected IST Current Date/Time Asia/Kolkata]
      +
  [Verified Ground Truth Catalog / Knowledge Base Slice]
      +
  [Strict Guardrails: No medical claims, no past dates, no hallucinated URLs]
      +
  [Strict JSON Output Schema Directive]
  ```
- **Universal Inheritance**: This standard is mandatory for all projects created under Hiranyam AI.

