# 🦷 Dentist Workflow Automation Platform

> **Production-oriented Conversational AI, Lead Qualification, Real-Time Calendar Scheduling, and No-Show Reduction Engine for Dental Clinics.**

---

## 🌟 Overview & Product Value

Dentist marketing campaigns on Instagram and Facebook often suffer from severe conversion friction:
1. Patients drop off when forced to fill tedious lead forms.
2. Inquiries arrive outside clinic hours with slow or no responses.
3. Patients fear dental pain and abandon before understanding modern painless techniques.
4. Confirmed appointments suffer from high **no-show rates (30%–50%)** because patients have zero financial commitment.

The **Dentist Workflow Automation Platform** solves this end-to-end:
- **Social Media Ad Ingress**: Dynamically captures inbound ad campaigns (50% Off Teeth Cleaning, Pain-Free Single Sitting RCT, Lifetime German Dental Implants, Invisible Clear Aligners, HD Digital RVG X-Rays).
- **Conversational Intelligence**: Powered by ChatGPT (`gpt-4o-mini` / `gpt-4o`) with grounded clinical responses, dental objection handling, and real-time USD/INR forex cost tracking.
- **Clinical Safety Triage Gate**: Intercepts acute emergencies (facial swelling, uncontrollable bleeding, trauma/broken tooth, lockjaw) -> triggers immediate `P0_EMERGENCY` priority alert and direct doctor hotline.
- **Dynamic Lead Qualification**: Quantitative scoring (0–100) categorizing leads into `HOT`, `WARM`, and `COLD` stages.
- **Dr. XYZ's Real-Time Calendar**: Real-time morning and evening availability queries, temporary 10-minute slot holding during checkout to prevent double-booking collisions.
- **Deposit Collection Engine**: Collects a commitment deposit (e.g. ₹500 via UPI QR / Card / Net Banking) that is **100% deducted from the clinic bill**, drastically slashing no-show rates.
- **Modular Multi-Channel Architecture**: Built web-first for interactive clinic demos and 1-month trials, with an abstracted channel adapter layer designed for seamless transition to **Meta WhatsApp Cloud API (Graph API v21.0)**.

---

## 📐 System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │        Social Media Ad Campaigns             │
                               │ (Teeth Cleaning / RCT / Implants / Aligners) │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │    Ad Context & Ingress      │
                                       └──────────────┬───────────────┘
                                                      │
                                                      ▼
 ┌───────────────────────────┐         ┌──────────────────────────────┐
 │   Web Channel Adapter     │◄───────►│  Workflow Orchestrator       │
 │   (Interactive Web Chat)  │         └──────────────┬───────────────┘
 └───────────────────────────┘                        │
               ▲                                      ▼
               │                       ┌──────────────────────────────┐
 ┌─────────────┴─────────────┐         │ Clinical Emergency Triage    │
 │ Future: WhatsApp Adapter  │         │ (Swelling/Trauma/Bleeding)   │
 │ (Meta Graph API v21.0)    │         └──────────────┬───────────────┘
 └───────────────────────────┘                        │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │ ChatGPT LLM Intelligence     │
                                       │ (Objection & Fear Handling)  │
                                       └──────────────┬───────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │ Lead Qualification Engine    │
                                       │ (Score 0-100: HOT/WARM/COLD) │
                                       └──────────────┬───────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │ Dentist Real-Time Calendar   │
                                       │ (Dr. XYZ Slots & 10m Hold)   │
                                       └──────────────┬───────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │ Commitment Deposit Engine    │
                                       │ (₹500 Deposit to Stop No-Show│
                                       └──────────────┬───────────────┘
                                                      │
                                                      ▼
                                       ┌──────────────────────────────┐
                                       │ Confirmed Appointment Pass   │
                                       │ (Token Voucher & SMS/WA Sync)│
                                       └──────────────────────────────┘
```

---

## 🚀 Quickstart & Demo Execution

### 1. Installation
```powershell
cd C:\Users\deshp\.gemini\antigravity\scratch\dentist-workflow-automation
npm install
```

### 2. Running the Server
```powershell
node src/server.js
```
The server will boot on `http://localhost:5055`.

### 3. Running Automated Tests
```powershell
npm test
```

---

## 🕹️ Interactive Web Demo Features

1. **Ad Campaign Ingress Switcher**:
   - Tap between campaigns:
     - ⚡ *50% Off Teeth Cleaning (₹499)*
     - 🦷 *Pain-Free Single Sitting Root Canal*
     - 💎 *Lifetime Dental Implants + Free 3D Scan*
     - 📸 *HD Digital RVG X-Ray (₹299)*
     - ✨ *Invisible Aligners (₹2,999/mo)*
   - Watch the chat automatically personalize the hook, pricing, and clinical recommendations.

2. **Objection & Fear Handling**:
   - Ask: *"Is root canal painful?"* $\to$ Bot details computer-controlled local anesthesia and micro-rotary tools.
   - Ask: *"Why do I have to pay a ₹500 deposit?"* $\to$ Bot explains how it secures Dr. XYZ's dedicated chair time with zero waiting and is 100% adjusted on the final bill.

3. **Emergency Clinical Triage**:
   - Type: *"My face and cheek are swollen with unbearable toothache."* $\to$ System triggers `P0_EMERGENCY`, generates cold compress advice, and displays the direct doctor emergency hotline.

4. **In-Chat Calendar Slot Booking**:
   - Slots load dynamically for Dr. XYZ across Morning (09:30 AM – 01:30 PM) and Evening (04:30 PM – 08:30 PM) shifts.
   - Click a slot $\to$ Holds the slot for 10 minutes to prevent double-booking.

5. **Commitment Deposit Checkout Drawer**:
   - Visual UPI QR Code (`drxyz.dentist@icici`) + Card simulation.
   - Click **Pay ₹500 Deposit & Confirm Slot** $\to$ Issues confirmed appointment pass with token number and directions.

6. **Live Telemetry & Lead Intel Panel**:
   - Real-time Lead Score (`HOT`, `WARM`, `COLD`).
   - Token accounting with live USD/INR forex conversion calculation.

---

## 📱 Future WhatsApp Cloud API Transition Guide

Once a dental clinic client completes their pilot and signs up:
1. **Meta Business Manager Setup**:
   - Register the clinic's official phone number under the clinic's Meta Business Account.
   - Generate Meta System User Access Token and Phone Number ID.
2. **Channel Activation**:
   - In `.env`, set `WHATSAPP_ENABLED=true`, `WHATSAPP_PHONE_NUMBER_ID`, and `WHATSAPP_ACCESS_TOKEN`.
   - Point the Meta App Webhook to `https://your-domain.com/api/webhooks/whatsapp`.
3. **Zero Core Logic Rewrite**:
   - `WhatsAppChannelAdapter` in `src/services/channel_adapters.js` handles inbound webhooks and outbound interactive templates while utilizing the exact same `DentalWorkflowOrchestrator`, `calendarEngine`, and `paymentEngine`.

---

## 🏛️ Code Standards & Documentation Mandate

Every class, constructor, routine, and handler in this codebase strictly complies with the **Hiranyam AI Universal Code Documentation Mandate**:
- Full explanatory comment blocks above every function detailing purpose, parameters, return values, errors, and manual debugging notes.
- Minute-level inline explanations of state mutations, locks, and scoring factors.
- Synchronous maintenance protocol ensuring zero stale documentation.
