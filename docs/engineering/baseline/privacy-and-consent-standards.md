# Privacy & Sensitive-Data Consent Gate Standard (P0 Policy)

> **Mandatory Zero-Trust Protocol for Data Privacy, Personal Identifiable Information (PII), Confidential Client Assets, and Informed Consent.**

---

## 1. P0 Rule: The Sensitive-Data Consent Gate

**Strict Rule:** No sensitive personal, financial, medical, or government identity information may EVER be exposed or published without explicit, documented client consent.

### Protected Information Categories:
- **Government Identifiers:** Aadhaar Number, PAN Card, Passport Number, Voter ID, Driving License.
- **Financial Information:** Bank Account Numbers, IFSC, Credit/Debit Card numbers, Tax Returns, Balance Sheets.
- **Medical & Health Data:** Patient consultation notes, diagnosis records, medical history, clinical yoga treatment files.
- **Personal Identifiable Information (PII):** Private personal phone numbers, home addresses, personal email addresses without explicit marketing consent.
- **Authentication Secrets:** Passwords, API tokens, OAuth keys, private encryption keys.

---

## 2. Mandatory STOP EXPOSURE Protocol

If sensitive client or customer information is discovered in any file, repository, presentation, or asset:

```text
SENSITIVE DATA DETECTED
           ↓
Is explicit written client consent/authorization verified?
           ├── NO  ──► STOP PUBLICATION / EXPOSURE STEP IMMEDIATELY
           │           Inform Lead Architect: "Sensitive information detected without consent."
           │           Redact or isolate into secure offline storage.
           │
           └── YES ──► Verify Data Minimization
                       Apply Encryption / Tokenization
                       Proceed with Authorized Scope
```

**Rule:** Possession of data does NOT imply permission to publish or commit.

---

## 3. Data Minimization Standard

In all public files, git repositories, client requirement registers, and documentation, apply **Data Minimization**:

| Sensitive Item | Prohibited Representation | Standard Compliant Representation |
| :--- | :--- | :--- |
| **PAN Card** | `<PAN identifier>` | `PAN: RECEIVED — SECURE REFERENCE` |
| **Aadhaar** | `<Aadhaar identifier>` | `Aadhaar: VERIFIED — SECURE REFERENCE` |
| **Bank Account**| `<bank account identifier>` | `Bank Account: CONFIGURED (Last 4: 1234)` |
| **Patient Case**| Real patient name + medical case | `Patient Case #1042 (Anonymized)` |

---

## 4. Automated Privacy Audit Tooling

Every project must be auditable via the automated privacy scanner:
```powershell
powershell -ExecutionPolicy Bypass -File automation/scripts/audit-privacy-consent.ps1
```
