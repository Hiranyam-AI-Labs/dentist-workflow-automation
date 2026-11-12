# Universal DB-First Self-Training, Session-Isolated, Token-Optimized & `\kill critic` Conversational AI Standard (ADR-0021 / SPEC-AI-CHAT-CRITIC-001)

> **Authoritative Enterprise Standard for all AI Chatbots, Helpdesks, Voice Assistants, and n8n Conversational Agent Workflows across Hiranyam AI Labs.**
> **Reference Implementation:** `bbng-parivartan-2027` (V3.3 Conversational Agent + PostgreSQL + 2-Layer `\kill critic`)

---

## 1. Executive Mandate

Every conversational AI chatbot, helpdesk portal, and WhatsApp/web agent engineered under **Hiranyam AI Labs** MUST implement the exact **8-Step DB-First Self-Training & `\kill critic` Architecture** defined in this specification.

This architecture guarantees:
1. **100% Database-Driven Truth (`DB-First`):** Every admin/user P0 or P1 training correction is grammar-polished, persisted to its own dedicated database row (`FAQ-TRAINED-*`), and immediately served across all future sessions and browsers.
2. **95% Token Reduction:** Eliminates cartesian item multiplication and 180 KB prompt duplication in n8n workflows (`~160,000` tokens/turn $\rightarrow$ `~8,000` tokens/turn).
3. **Strict Session Isolation:** Every new browser window, tab, refresh, or Incognito window starts with a clean, isolated in-memory session (`app-sess-{timestamp}-{random}`)—zero `localStorage` cross-window session leakage.
4. **Two-Layer `\kill critic` (Polarity & Terminology Verification Gate):** Eliminates LLM positive-spin bias (e.g., answering *"Yes, Pure Veg catering is available"* when the admin trained *"No fasting menu is available"*, or calling an event an *"exhibition"* when the admin trained *"It is a Business Conference, not an exhibition"*).

---

## 2. Step-by-Step Implementation Blueprint (Mandatory Across All Projects)

### Step 1: Pure In-Memory Window Session Isolation (Frontend UI)
- **Prohibition:** NEVER store or reload `sessionId` or `conversationHistory` in `localStorage` or `sessionStorage`.
- **Implementation (`faq-chat.html` / Web Client):**
  ```javascript
  // Fresh session on every window/tab/incognito load
  let sessionId = 'app-sess-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  let conversationHistory = [];
  ```
- **Why:** Ensures every new user, browser window, or Incognito window receives a completely fresh session and relies strictly on the PostgreSQL knowledge base (`event_faqs`) rather than stale browser memory.

---

### Step 2: Token-Optimized n8n Workflow Pipeline (~95% Token Reduction)
1. **`Fetch Active FAQs from DB` Node (`executeOnce: true`):**
   - MUST enable `"executeOnce": true` in node parameters so that if upstream `Lookup Session History` returns $N$ rows, the PostgreSQL FAQ query executes **once per webhook call** instead of $N$ times.
2. **`Lookup Session History` Node (`LIMIT 25`):**
   - Cap historical session turns at `LIMIT 25` (ordered chronologically) instead of `LIMIT 200`.
3. **Compact `agentInputText` in `Build Agent Context`:**
   - Do NOT dump the full 45-row FAQ table into `agentInputText` (which gets saved into LangChain memory on every turn).
   - Keep `agentInputText` compact (~600 chars: last 5 turns summary + current question + reply language + any matched admin-trained override).
4. **Evaluated `systemMessage` in `Conversational Agent` (`=` Prefix Mandatory):**
   - Inject `{{ $('Build Agent Context').first().json.faqKnowledgeBlock }}` inside `Conversational Agent` $\rightarrow$ `options.systemMessage`.
   - **CRITICAL n8n RULE:** In n8n JSON (`workflow_entity` and `workflow_history`), `systemMessage` **MUST begin with a leading `=` character** (`"=You are the official AI Conversational Assistant..."`). Without the leading `=`, n8n sends the literal string `{{ ... }}` to OpenAI without evaluating the database expression.

---

### Step 3: Dedicated Row Persistence (`FAQ-TRAINED-*`) & Base FAQ Protection
- **Problem Prevented:** When the Conversational Agent answers a question, `matched_faq_id` defaults to `'AGENT_V3'` (or a general base FAQ like `'FAQ-FOOD-OPTIONS'`). If `autoTrainFaqWithCorrection()` UPSERTs directly at `matchedFaqId`, every new training submission overwrites the same `'AGENT_V3'` row or corrupts a general base FAQ.
- **Mandatory Implementation (`synthesizeSmartFaqCorrection` in `faqDatabaseService.js`):**
  1. Check if an existing `FAQ-TRAINED-*` row already matches the normalized question (`normQ`). If found, reuse that `FAQ-TRAINED-*` ID so re-training updates the same rule cleanly.
  2. Otherwise, if `!targetId || !String(targetId).startsWith('FAQ-TRAINED-')`, allocate a dedicated persistent ID:
     ```javascript
     targetId = `FAQ-TRAINED-${Date.now().toString().slice(-8)}`;
     ```

---

### Step 4: Context-Aware AI Grammar, Spelling & Polarity Polish (`polishAnswerWithAI`)
- **Backend Environment Requirement:** Ensure `OPENAI_API_KEY` is injected into the backend Docker Swarm service (`docker service update --env-add OPENAI_API_KEY=... <service>`), not only inside n8n's encrypted credential store.
- **Context-Aware Polishing (`polishAnswerWithAI(rawText, questionContext)`):**
  - Pass **both** the user's original question (`questionContext`) and the admin's correction (`rawText`) to `gpt-4o-mini` (`temperature: 0`).
  - Why: When an admin types shorthand like *"it is not a exhibition its a conference"* for the question *"What is Parivartan?"*, context-aware polishing synthesizes a complete, grammatically flawless helpdesk sentence:
    > *"BBNG Parivartan 2027 is a premier two-day Business Conference for the Brahmin community (not an exhibition), held on 9th and 10th January 2027 at CIDCO Convention Centre, Vashi."*
  - Also polish `finalQEn` (declared with `let finalQEn`, never `const`) so misspelled questions (*"any police stattion near by"*) are stored as clean canonical questions (*"Is there any police station nearby?"*), and extract named entities (Plus-codes, locations, URLs, proper nouns) into `keywords`.

---

### Step 5: Positive-Template Hijack Guard (`!isNegativeOrSpecificFact`)
- **Problem Prevented:** Pre-built domain synthesis templates (e.g. generic Food/Catering, Parking, or Fee brochure paragraphs) must **NEVER** trigger when an admin submits a negative restriction or specific factual correction.
- **Mandatory Guard (`faqDatabaseService.js`):**
  ```javascript
  const isNegativeOrSpecificFact =
    /\b(no\b|not\b|never\b|none\b|without\b|fasting|upvas|upvasache|vrat|faral|cheque|single.?day|one.?day|conference|conferance)\b|नाही|उपलब्ध नाही|नहीं|उपवास|फराळ/i.test(cleanCorrection)
    || !isMetaDirective;
  ```
  Hardcoded domain templates may only execute when `!isNegativeOrSpecificFact` is true (i.e. only when the user typed a vague meta-directive like *"give food answer here"* without providing factual content).

---

### Step 6: Trained-First Knowledge Hierarchy & Greeting Guard (`Build Agent Context V3.3`)
1. **Top-of-Prompt Priority Partitioning:**
   - Partition active rows from `event_faqs` into two separate blocks inside `faqKnowledgeBlock`:
     - **`🚨 HIGHEST-PRIORITY ADMIN-TRAINED OVERRIDES (MUST OBEY 100% — SUPERSEDES ALL OTHER FAQS & DEFAULT DESCRIPTIONS):`** (`FAQ-TRAINED-*` / `AUTO_TRAINED` rows placed at the very top).
     - **`STANDARD KNOWLEDGE BASE:`** (base FAQs placed below).
2. **Dynamic Trained-FAQ Match with Greeting & Length Guard:**
   - Match incoming `normQuery` against `trainedRows`, **strictly guarded** by:
     ```javascript
     const isGreeting = /^(hi|hello|hey|namaste|namaskar|hola|good\s+(morning|afternoon|evening)|हाय|हॅलो|नमस्कार|नमस्ते|નમસ્તે|ನಮಸ್ಕಾರ)$/i.test(normQuery);
     if (!isGreeting && normQuery.length >= 10) {
       // Match exact normalized question or long phrase (>= 16 chars)
     }
     ```
   - **Why:** Prevents 2-letter greetings like `"hi"` from substring-matching inside trained Marathi/Hindi words like `"sat-hi"` (`sathi`).

---

### Step 7: Two-Layer Universal `\kill critic` Verification Gate
To eliminate LLM sycophancy ("Yes" bias when a service is unavailable) and terminology drift:

1. **Layer 1 — Prompt-Level `\kill critic` (`Rule 0` in `Conversational Agent` `systemMessage`):**
   - Instructs the LLM: Before generating any answer, check `ADMIN-TRAINED OVERRIDES`. If a trained rule states **No / NOT available** (e.g., *No fasting/Upvas menu*, *No 1-day registration*, *No cheque payment*) or corrects core terminology (*Business Conference, NOT an exhibition*), **KILL any positive "Yes" or default assumption** and start the response directly with `"No,"` (`नाही,` / `नहीं,` / `ના,` / `ಇಲ್ಲ,`) or the exact trained terminology.
2. **Layer 2 — Deterministic Post-Generation `\kill critic` (`Parse Agent Response & Prepare SQL`):**
   - Runs in JavaScript immediately after the LLM outputs `rawAnswer`:
     - Inspects `ctx.matchedTrainedFaq` and domain-specific trained rules (`FAQ-TRAINED-WHAT-IS-PARIVARTAN`, `FAQ-TRAINED-FASTING-MENU`, `FAQ-TRAINED-ONE-DAY-REG`, `FAQ-TRAINED-PAYMENT-ONLINE`, `FAQ-TRAINED-POLICE-STATION`).
     - If `trainedIsNegative` is true and the LLM draft starts with `"Yes"` / `"होय"` / `"हाँ"` or omits negation, OR if the LLM calls a Conference an `"exhibition"`, OR if the LLM falls back to `"I don't have information"`, the **`\kill critic` immediately kills the LLM draft** and replaces `rawAnswer` with the verified localized answer (`answer_en` / `answer_mr` / `answer_hi`) from PostgreSQL `event_faqs`.
3. **Clean Trailing-Clause Sanitization (`cleanAnswer` in `ai.js`):**
   - When stripping closing filler (*"If you have any questions, feel free to ask!"*), always strip the entire conditional sentence (`/\s*If you (have|need) [^.!?]*?(feel free to (ask|reach out)|let us know|please ask)[.!?\s]*$/gi`) and sanitize any trailing comma (`.replace(/,\s*$/, '.')`) so responses never end with a hanging comma.

---

### Step 8: n8n SQLite Dual-Table Synchronization & `UID 1000:1000` Ownership Protocol
Whenever updating an active n8n workflow programmatically on a Hostinger VPS (`/var/lib/docker/volumes/n8n_n8n_data/_data/database.sqlite`):
1. **Update BOTH `workflow_entity` AND `workflow_history`:**
   - n8n v1.80+ executes live production webhooks from `workflow_history` (`WHERE versionId = workflow_entity.activeVersionId`). Updating only `workflow_entity` leaves the old code running in production.
2. **Enforce `1000:1000` (`node:node`) Ownership Before Restart:**
   - Always run:
     ```bash
     chown -R 1000:1000 /var/lib/docker/volumes/n8n_n8n_data/_data
     chmod 664 /var/lib/docker/volumes/n8n_n8n_data/_data/database.sqlite*
     ```
   - Never leave `database.sqlite` owned by `root:root`, which causes `QueryFailedError: SQLITE_READONLY: attempt to write a readonly database` and crashes the n8n container.
