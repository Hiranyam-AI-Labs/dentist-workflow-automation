# Domain Workflow Blueprints & Standards

This document establishes the official architectural standards for implementing domain-specific AI WhatsApp workflows across all client projects.

---

## 1. Real Estate Domain (e.g., Hemkar Realty)

### A. Intent & Entity Extraction:
- **Location & Belt Intelligence**:
  - **Coastal / Seashore Belt**: Keywords (`beach`, `sea`, `ocean`, `coastal`, `waterfront`, `samudra`, `samudrakinar`, `दर्याकिनारा`, `समुद्र`, `बीच`) must map to coastal towns (**Kashid/Alibaug**, **Dighi**, **Jivne/Shriwardhan**, **Velas**, **Diveagar**).
  - **Inland / Agricultural Belt**: Towns (`Mangaon`, `Kadapur`, `Umroli`, `Nalefodi`, `Mahad`, `Palasgaon`, `Gangavali`, `Kakal`, `Lonshi`, `Surav`, `Devrukh`).
- **Land & Property Units**:
  - Normalized support for: `Guntha / Gunthe`, `Acre / Acres`, `Sq. Ft / Sqft`, `Bigha`, `Hectare`.
  - Legal & document terms: `7/12 extract (सातबारा)`, `Clear Title`, `NA / Non-NA`, `Gated Community`, `Tar Road Touch`.
- **Budget Formatting & Storage**:
  - Preserve human-readable unit strings: `2 Cr`, `50 Lakh`, `15 Lakh`.
  - For SQL filtering, compute numeric equivalents: `Crores = val * 10,000,000` | `Lakhs = val * 100,000`. Never store Crores as raw unlabelled numbers (e.g. `200`).
- **Lead Scoring & Routing**:
  - **HOT (70-100)**: Defined budget, preferred location, plot size, timeline within 3 months, or requested site visit.
  - **WARM (40-69)**: Explored properties, asked about prices/locations, partial profile.
  - **COLD (0-39)**: Generic inquiries, greetings, unresolved requirements.
  - **🚨 OWNER ESCALATION**: Immediate notification to leadership when customer asks for owner/proprietor, expresses urgency, or requests an immediate phone call.

---

## 2. Healthcare & Dental Domain (e.g., Dental Clinic / Dentist Project)

### A. Clinical Treatment & Service Catalog:
- **Treatment Category Mapping**:
  - **Endodontics**: Root Canal Treatment (RCT), Single Sitting RCT, Re-RCT.
  - **Prosthodontics & Implants**: Dental Implants (Single/Multiple/Full Mouth), All-on-4, Crowns (Zirconia/Ceramic/Metal), Bridges, Dentures.
  - **Orthodontics**: Invisible Aligners (Invisalign/Clear Aligners), Ceramic Braces, Metal Braces.
  - **Cosmetic / Aesthetic**: Teeth Whitening / Bleaching, Dental Veneers, Smile Designing.
  - **Oral Surgery & General**: Wisdom Tooth Extraction (Impacted Tooth), Scaling & Polishing (Teeth Cleaning), Tooth Filling / Cavity Treatment (Composite/GIC), Pediatric Dentistry (Milk teeth care).
  - **Periodontics**: Gum Bleeding, Flap Surgery, Pyorrhea treatment.

### B. Patient Urgency & Emergency Triage:
- **Triage Level 1: EMERGENCY / URGENT (Immediate Doctor Notification)**:
  - Symptoms: `Severe unbearable pain`, `facial swelling`, `trauma / broken tooth / accident`, `continuous bleeding`, `pus discharge`, `unable to open mouth / lockjaw`.
  - Action: Immediate empathy reply, priority urgent appointment booking, instant SMS/WhatsApp alert to Head Doctor.
- **Triage Level 2: ROUTINE APPOINTMENT**:
  - Routine checkup, cosmetic whitening, aligners consultation, cleaning, mild sensitivity.
  - Action: Prompt for preferred clinic branch, date, morning/evening slot (15-30 min consultation).

### C. Voice Note Symptom Analysis:
- Patients often describe tooth pain or symptoms via voice notes in Marathi (*"माझी दाढ खूप दुखतेय आणि सुजली आहे"*), Hindi (*"दांत में बहुत दर्द है और खून आ रहा है"*), or English.
- OpenAI Whisper transcribes vernacular dental complaints, translates to clinical English summary, logs in patient history, and assists the clinic coordinator.

### D. Pricing & Transparency:
- Transparent consultation fees, starting estimates per treatment (e.g. *RCT starting ₹2,500*, *Implant starting ₹18,000*, *Aligners EMI available*).
- Never prescribe specific antibiotics/medicines over WhatsApp; mandate in-person clinical examination and X-ray.

---

## 3. Food & E-Commerce Domain (e.g., MoolTatva Foods)

### A. Catalog & Order Normalization:
- **Product Entity Matching**: Organic spices, cold-pressed oils, grains, flours, natural sweeteners.
- **Unit Normalization**: `500g`, `1 Kg`, `5 Kg`, `1 Liter`, `5 Liter Tin`, `Pack of 2`.
- **Address & Pin Code Resolution**: Extraction of street address, landmark, 6-digit Indian PIN code, city/district.
- **Order Calculation**: Unit price $\times$ quantity, delivery charges based on PIN code, minimum order value checks.

### B. Customer Intent & Lead Management:
- **Retail vs B2B / Bulk Order**: Inquiries $> 25\text{ kg}$ or commercial restaurant supplies automatically trigger **Owner / Sales Lead Escalation**.
- **Customer Feedback & Support**: Damaged packaging, delivery tracking, return/replacement handling.

---

---

## 4. Ayurvedic Healthcare & Clinical Yoga Domain (e.g., Aarogyam Global)

### A. Intent & Service Taxonomy:
- **Medical & Therapeutic Yoga**:
  - Spinal alignment & back pain relief (`कणा / मणके / पाठदुखी`, `Slip Disc`, `Sciatica`, `Spondylosis`).
  - Joint health & arthritis management (`गुडघेदुखी / सांधेदुखी`, `Frozen Shoulder`, `Osteoarthritis`).
  - Rope-and-belt supported therapy (Iyengar/Therapeutic yoga props).
- **Holistic Wellness & Lifestyle Education**:
  - Pranayama & Breathwork (Stress relief, hypertension, anxiety management).
  - Women's Wellness (`PCOD / PCOS`, pre/post-natal yoga, hormonal health).
  - Pancha-Kosha & Mind-Body relaxation (Yoga Nidra, meditation).
- **Programs & Formats**:
  - Group yoga classes, clinical 1-on-1 consultations, weekend spinal workshops, corporate seminars.
  - Delivery modes: In-studio (Pune/center) and live interactive online sessions.

### B. ChatGPT LLM Engine & Triage Integration:
- **Engine**: OpenAI ChatGPT (`gpt-4o-mini`) with strict system prompts grounded in verified Aarogyam clinical and educational guidelines.
- **Multilingual Support**: Fluent responses in Marathi (`mr`), Hindi (`hi`), and English (`en`).
- **Clinical Triage & Safety Guardrails**:
  - **Triage Level 1: RED FLAG / ACUTE (Mandatory Doctor Referral)**:
    - Symptoms: `Sudden severe shooting pain`, `loss of bladder control`, `numbness in limbs`, `recent surgery/fracture`, `acute cardiac symptoms`.
    - Action: Immediate empathy reply with bold medical disclaimer, halt yoga posture suggestions, recommend immediate allopathic physician / hospital consultation, and generate high-priority coordinator alert.
  - **Triage Level 2: CHRONIC / ROUTINE CONSULTATION**:
    - Chronic stiffness, routine yoga learner, lifestyle stress, general fitness.
    - Action: Offer doctor consultation slot, check contraindications, collect medical history summary, and provide fee schedule.
- **Medical Disclaimer Mandate**:
  - Every clinical advice or workshop summary generated by ChatGPT must append:
    *"टीप: योगासने आणि थेरपी केवळ मार्गदर्शनासाठी आहेत; हा वैद्यकीय उपचारांचा पर्याय नाही. गंभीर दुखण्यात डॉक्टरांचा सल्ला अवश्य घ्या."* / *"Note: Yoga therapy is a complementary practice and does not substitute professional medical care."*

---

## 5. Universal Design System & Dashboard Integration

All domain implementations must connect to a unified Live Monitoring Dashboard adhering to:
1. **WCAG 2.1 AA Compliance**: High-contrast typography, readable font sizes, accessible color codes.
2. **Real-Time Live Chat Stream**: Dual speech bubbles for voice notes (`🎙️ Voice Note` + Spoken Speech + English Translation box).
3. **Dynamic Lead / Patient Status Badges**: `🔥 HOT`, `⚡ WARM`, `❄️ COLD`, `🚨 OWNER / EMERGENCY ESCALATION`.
4. **Token Telemetry & Real-Time INR Forex**: Dynamic conversion via live exchange rate API.
5. **Testing Mode Reset**: One-click conversation reset to facilitate thorough QA testing by Business Analysts and Product Managers.
