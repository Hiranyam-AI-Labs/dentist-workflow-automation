# OpenSpec: Universal Workflow Execution Diagnostics Specification

> **Specification ID:** `SPEC-LOOP-DIAG-001`  
> **Status:** Standard / Active Production  
> **Scope:** Enterprise-wide (All 19+ Client Projects running n8n or autonomous workflow engines)  
> **Authoritative Tool:** `powershell automation/scripts/diagnose-workflow-execution.ps1`

---

## 1. Context & Motivation

Within the Central Private Engineering Control Plane (`F:\Clients\MetaDataProjects`), all automated business workflows (WhatsApp lead intake, AI chat agents, SMS/Email dispatchers, telephony integrations) operate on continuous feedback loops.

When clients report discrepancies (e.g. incorrect inventory recommendations, formatting errors, scheduling conflicts, unexpected replies), developers and AI agents must NOT guess or manually construct ad-hoc database queries. They must immediately run the **Universal Workflow Execution Diagnostics Tool** to retrieve ground truth runtime traces.

---

## 2. Architecture & Capabilities

```text
[Operator / AI Agent]
         │
         ▼
[diagnose-workflow-execution.ps1 -Client <ClientId> [-ExecutionId <Id>]]
         │
         ▼
[n8n-diagnostics-engine.js]
         │
         ├─► Connects to n8n SQLite / PostgreSQL runtime
         ├─► Retrieves execution_entity + execution_data rows
         ├─► Un-flattens n8n circular JSON representations
         ├─► Reconstructs runtime graph: Inbound -> Intent -> Query -> LLM -> Outbound
         ├─► Analyzes Quality & Boundary Constraints:
         │     • Location / Domain Leakage (e.g. inland properties returned for coastal queries)
         │     • Formatting Anomalies (e.g. WhatsApp double asterisks **, unspaced bold)
         │     • SQL execution results vs intent expectations
         │     • Prompt token spikes or unhandled exceptions
         └─► Outputs human-readable diagnostic report or JSON stream
```

---

## 3. Command Reference

### Inspect Specific Execution
```powershell
powershell automation/scripts/diagnose-workflow-execution.ps1 -Client HemkarRealty -ExecutionId 1170
```

### Inspect Last N Executions for a Client
```powershell
powershell automation/scripts/diagnose-workflow-execution.ps1 -Client HemkarRealty -Limit 10
```

### Filter Executions by Customer Phone
```powershell
powershell automation/scripts/diagnose-workflow-execution.ps1 -Client HemkarRealty -Phone $env:DIAGNOSTIC_TEST_PHONE -Limit 5
```

### Emit Raw JSON for Automated Evaluation / CI Verification
```powershell
powershell automation/scripts/diagnose-workflow-execution.ps1 -Client HemkarRealty -ExecutionId 1170 -Json
```

---

## 4. Anomaly Rules & Automatic Checks

1. **Boundary & Filter Integrity:**
   - When user specifies a locality, city, or geographical feature (e.g., Beach/Coastal, Alibag, Wakad, Kothrud), verify that 100% of retrieved records strictly match that boundary. Any out-of-boundary record is flagged as a P0 Leakage Anomaly.
2. **Platform Formatting Standards:**
   - WhatsApp messages must use single asterisks (`*bold*`) without trailing/leading internal spaces. Double asterisks (`**`) are strictly flagged as broken formatting.
3. **Spam & Route Classification:**
   - Verify that deliveryRoute (`first_contact`, `conversation`, `spam`) aligns with the actual customer context and CRM history.
