/**
 * ============================================================================
 * File: src/services/workflow_orchestrator.js
 * Module: Master Dental Patient Acquisition & Workflow Orchestrator
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: The central workflow engine connecting social media ad ingress,
 *              conversational AI, clinical emergency triage, lead qualification,
 *              real-time dentist calendar availability, payment deposit collection,
 *              and automated appointment confirmations.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const chatgptAdapter = require('./chatgpt_adapter');
const triageGate = require('./triage_gate');
const leadScorer = require('./lead_scoring');
const calendarEngine = require('./calendar_engine');
const paymentEngine = require('./payment_engine');
const { webAdapter } = require('./channel_adapters');

// Load domain treatment catalog and clinic configurations
const treatmentsData = require('../data/treatments.json');
const clinicConfig = require('../data/clinic_config.json');

/**
 * Class: DentalWorkflowOrchestrator
 * Purpose: Central coordinator implementing the complete patient acquisition funnel:
 *          Ad Ingress -> Inquiry -> AI Consultation -> Triage -> Qualification ->
 *          Slot Selection -> Deposit Checkout -> Confirmation.
 * Manual Debugging Notes:
 *   - Sessions are preserved in an in-memory Map keyed by sessionId.
 *   - Every turn records conversation history, active treatment, and score factors.
 */
class DentalWorkflowOrchestrator {
  /**
   * Method: constructor
   * Purpose: Initializes in-memory session repository, clinical prompts, and campaigns.
   * Parameters: None.
   * Return: DentalWorkflowOrchestrator instance.
   * Errors: None.
   * Manual Debugging Notes: Uses session store for multi-turn conversational state.
   */
  constructor() {
    this.sessionsStore = new Map();
    this.adCampaigns = treatmentsData.ad_campaigns;
    this.treatments = treatmentsData.treatments;
    this.clinicProfile = treatmentsData.clinic_profile;
  }

  /**
   * Method: getOrCreateSession
   * Purpose: Retrieves existing conversational session or seeds a new session
   *          tailored to the incoming social media ad campaign.
   * Parameters:
   *   - sessionId: String identifier.
   *   - adCampaignKey: Campaign identifier (e.g., 'CLEANING_50_OFF').
   *   - patientDetails: Optional name, phone, email.
   * Return: Session object.
   * Errors: Falls back to 'GENERAL_INTAKE' campaign if invalid campaign supplied.
   * Manual Debugging Notes: Check session.history for multi-turn context.
   */
  getOrCreateSession(sessionId, adCampaignKey = 'GENERAL_INTAKE', patientDetails = {}) {
    let session = this.sessionsStore.get(sessionId);

    if (!session) {
      const campaign = this.adCampaigns[adCampaignKey] || this.adCampaigns.GENERAL_INTAKE;

      session = {
        sessionId,
        adCampaignKey,
        campaign,
        treatmentKey: campaign.service_key || 'general_consultation',
        patientDetails: {
          name: patientDetails.name || 'Valued Patient',
          phone: patientDetails.phone || '',
          email: patientDetails.email || ''
        },
        history: [],
        messageCount: 0,
        selectedSlot: null,
        paymentOrder: null,
        depositPaid: false,
        appointmentConfirmed: false,
        leadScore: { score: 10, tier: 'COLD', conversionStage: 'INITIAL_GREETING' },
        createdAt: new Date().toISOString()
      };

      this.sessionsStore.set(sessionId, session);
    }

    return session;
  }

  /**
   * Method: buildSystemPrompt
   * Purpose: Assembles grounded clinical persona instructions for ChatGPT LLM.
   * Parameters:
   *   - session: Current patient session object.
   * Return: System prompt string with clinic context, doctor credentials, and policies.
   * Errors: None.
   * Manual Debugging Notes: Enforces clinical safety, objection handling, and booking encouragement.
   */
  buildSystemPrompt(session) {
    return `You are Dr. XYZ's expert Clinical Dental AI Assistant for "${this.clinicProfile.clinic_name}" in Bandra West, Mumbai.
Head Dentist: ${this.clinicProfile.dentist_name} (${this.clinicProfile.qualification}), 15+ years experience.
Address: ${this.clinicProfile.address} (Opp. Bandra Metro Station).

YOUR MISSION:
1. Warmly assist patients inquiring from social media ads: "${session.campaign.headline}".
2. Explain dental treatments in simple, reassuring, fear-free language.
3. Address patient objections (fear of pain, pricing, sterilization, need for ₹500 booking deposit).
4. Emphasize that the ₹500 booking deposit guarantees zero waiting time and is 100% deducted from the final clinic bill.
5. Guide the patient smoothly toward selecting a time slot and confirming their appointment.

CLINICAL TREATMENT CONTEXT:
- Teeth Cleaning: Ultrasonic scaling & polishing for ₹499 (50% off promo), completely painless, 30 mins.
- Root Canal (RCT): Single sitting pain-free micro-rotary RCT from ₹3,500, eliminates infection permanently.
- Dental Implants: Permanent German/Swiss titanium implants from ₹19,999 with Lifetime Warranty. Free 3D OPG scan included.
- Clear Aligners: Invisible wire-free orthodontic trays from ₹2,999/mo EMI.
- Dental X-Ray: Ultra-low radiation HD RVG scan for ₹299.

CLINICAL SAFETY MANDATE:
- Never prescribe specific antibiotics or dosages over chat. Always recommend physical examination and digital X-ray.
- If symptoms indicate acute emergency (heavy bleeding, facial swelling, severe trauma), advise immediate doctor visit.

Return your response in structured JSON with:
{
  "reply": "Empathetic, clear, and reassuring response to patient",
  "intent": "INQUIRY_PRICING" | "OBJECTION_PAIN_FEAR" | "INTENT_SCHEDULE_BOOKING" | "GENERAL_INQUIRY",
  "detected_treatment": "teeth_cleaning" | "root_canal" | "dental_implants" | "dental_xray" | "clear_aligners",
  "suggested_actions": ["Action 1", "Action 2", "Action 3"],
  "is_qualified_lead": true | false
}`;
  }

  /**
   * Method: processPatientMessage
   * Purpose: Main entry point processing patient chat queries through the entire workflow funnel.
   * Parameters:
   *   - payload: Inbound payload containing message, sessionId, adCampaign, patientDetails.
   * Return: Formatted outbound response object ready for presentation.
   * Errors: Catches exceptions and returns user-friendly dental fallback response.
   * Manual Debugging Notes: Inspect leadScore and slotPicker fields in output.
   */
  async processPatientMessage(payload = {}) {
    const inbound = webAdapter.parseInbound(payload);
    const session = this.getOrCreateSession(inbound.sessionId, inbound.adCampaign, inbound.patientDetails);

    // Increment message turn count
    session.messageCount++;

    // Minute-level step 1: Clinical Safety & Emergency Triage Evaluation
    const triageResult = triageGate.evaluate(inbound.queryText);

    if (triageResult.isEmergency) {
      session.isEmergency = true;
      session.history.push({ sender: 'user', text: inbound.queryText });
      session.history.push({ sender: 'bot', text: triageResult.emergencyNotice });

      // Emergency leads are immediately scored as HOT
      session.leadScore = leadScorer.scoreLead({
        adCampaign: session.adCampaignKey,
        treatmentKey: session.treatmentKey,
        messageCount: session.messageCount,
        queryText: inbound.queryText,
        isEmergency: true
      });

      // Provide immediate emergency slots for today
      const todaySlots = calendarEngine.getAvailableSlots(calendarEngine.getFormattedDate(0));

      return webAdapter.formatOutbound({
        sessionId: session.sessionId,
        text: triageResult.emergencyNotice,
        suggestedActions: triageResult.suggestedActions,
        isEmergency: true,
        leadScore: session.leadScore,
        slotPicker: {
          date: todaySlots.date,
          emergencyNotice: 'Emergency Priority Walk-in & Reserved Slots Available',
          slots: [...todaySlots.morningSlots, ...todaySlots.eveningSlots].filter(s => s.isAvailable).slice(0, 4)
        }
      });
    }

    // Minute-level step 2: LLM Intelligence Layer & Conversational Understanding
    const systemPrompt = this.buildSystemPrompt(session);
    const llmResult = await chatgptAdapter.generateResponse({
      systemPrompt,
      userMessage: inbound.queryText,
      conversationHistory: session.history,
      adContext: session.campaign
    });

    if (llmResult.detectedTreatment) {
      session.treatmentKey = llmResult.detectedTreatment;
    }

    // Minute-level step 3: Lead Scoring & Qualification Update
    session.leadScore = leadScorer.scoreLead({
      adCampaign: session.adCampaignKey,
      treatmentKey: session.treatmentKey,
      messageCount: session.messageCount,
      slotSelected: !!session.selectedSlot,
      depositPaid: session.depositPaid,
      queryText: inbound.queryText,
      isEmergency: false
    });

    // Append to conversation history
    session.history.push({ sender: 'user', text: inbound.queryText });
    session.history.push({ sender: 'bot', text: llmResult.reply });

    // Minute-level step 4: Check if Calendar Slot Picker should be presented
    let slotPickerData = null;
    const bookingKeywords = ['book', 'schedule', 'slot', 'appointment', 'visit', 'timing', 'available'];
    const isBookingIntent = llmResult.intent === 'INTENT_SCHEDULE_BOOKING' ||
                           bookingKeywords.some(kw => inbound.queryText.toLowerCase().includes(kw)) ||
                           session.leadScore.score >= 50;

    if (isBookingIntent && !session.appointmentConfirmed) {
      const todaySlots = calendarEngine.getAvailableSlots(calendarEngine.getFormattedDate(0));
      const tomorrowSlots = calendarEngine.getAvailableSlots(calendarEngine.getFormattedDate(1));

      slotPickerData = {
        doctor: clinicConfig.head_doctor,
        clinicName: clinicConfig.clinic_name,
        depositAmount: clinicConfig.deposit_required_inr,
        today: {
          date: todaySlots.date,
          availableCount: todaySlots.availableSlotsCount,
          morning: todaySlots.morningSlots.filter(s => s.isAvailable),
          evening: todaySlots.eveningSlots.filter(s => s.isAvailable)
        },
        tomorrow: {
          date: tomorrowSlots.date,
          availableCount: tomorrowSlots.availableSlotsCount,
          morning: tomorrowSlots.morningSlots.filter(s => s.isAvailable),
          evening: tomorrowSlots.eveningSlots.filter(s => s.isAvailable)
        }
      };
    }

    return webAdapter.formatOutbound({
      sessionId: session.sessionId,
      text: llmResult.reply,
      suggestedActions: llmResult.suggestedActions,
      isEmergency: false,
      leadScore: session.leadScore,
      slotPicker: slotPickerData,
      paymentCheckout: session.paymentOrder,
      telemetry: llmResult.telemetry
    });
  }

  /**
   * Method: selectSlotAndInitiateDeposit
   * Purpose: Locks the selected doctor slot for 10 minutes and generates the deposit payment order.
   * Parameters:
   *   - sessionId: Patient session identifier.
   *   - slotId: Selected slot identifier.
   *   - patientDetails: Object with name, phone, email.
   * Return: Object with slot reservation status and deposit payment order details.
   * Errors: Returns error if slot already occupied.
   * Manual Debugging Notes: Enforces the no-show deposit reduction strategy.
   */
  async selectSlotAndInitiateDeposit(sessionId, slotId, patientDetails = {}) {
    const session = this.getOrCreateSession(sessionId, 'GENERAL_INTAKE', patientDetails);

    // Minute-level action: Hold slot in calendar engine
    const holdResult = calendarEngine.holdSlot(slotId, {
      name: patientDetails.name || session.patientDetails.name,
      phone: patientDetails.phone || session.patientDetails.phone,
      treatment: session.treatmentKey,
      sessionId
    });

    if (!holdResult.success) {
      return {
        success: false,
        error: holdResult.error,
        message: holdResult.message
      };
    }

    session.selectedSlot = slotId;

    // Minute-level action: Create deposit order to guarantee commitment
    const orderResult = paymentEngine.createDepositOrder({
      slotId,
      patientName: patientDetails.name || session.patientDetails.name,
      patientPhone: patientDetails.phone || session.patientDetails.phone,
      treatmentKey: session.treatmentKey,
      amount: clinicConfig.deposit_required_inr
    });

    session.paymentOrder = orderResult;

    // Update lead score after slot selection
    session.leadScore = leadScorer.scoreLead({
      adCampaign: session.adCampaignKey,
      treatmentKey: session.treatmentKey,
      messageCount: session.messageCount,
      slotSelected: true,
      depositPaid: false,
      isEmergency: false
    });

    return {
      success: true,
      slotId,
      holdExpiresAt: holdResult.heldUntil,
      paymentOrder: orderResult,
      leadScore: session.leadScore,
      instructions: `Slot reserved for 10 minutes. Please complete the ₹${orderResult.amount} deposit to confirm your appointment.`
    };
  }

  /**
   * Method: verifyDepositAndConfirmAppointment
   * Purpose: Verifies the payment transaction and finalizes appointment booking with Dr. XYZ.
   * Parameters:
   *   - sessionId: Patient session ID.
   *   - orderId: Valid payment order ID.
   *   - paymentMethod: 'UPI' | 'CARD' | 'SIMULATED'.
   *   - patientDetails: Object with name, phone, email.
   * Return: Confirmed appointment record, payment receipt, and follow-up clinical instructions.
   * Errors: Throws error if payment verification or slot confirmation fails.
   * Manual Debugging Notes: Generates official appointment receipt and token voucher.
   */
  async verifyDepositAndConfirmAppointment(sessionId, orderId, paymentMethod = 'UPI', patientDetails = {}) {
    const session = this.getOrCreateSession(sessionId);

    // 1. Verify payment with payment engine
    const paymentVerification = paymentEngine.verifyPayment({
      orderId,
      paymentMethod
    });

    if (!paymentVerification.success) {
      return {
        success: false,
        error: 'PAYMENT_VERIFICATION_FAILED',
        message: 'Could not verify deposit transaction. Please retry.'
      };
    }

    const order = paymentEngine.ordersStore.get(orderId);
    const slotId = order.slotId;

    // 2. Permanently lock slot in calendar engine
    const bookingResult = calendarEngine.confirmBooking(
      slotId,
      {
        paymentId: paymentVerification.paymentId,
        amount: order.amount,
        method: paymentMethod
      },
      {
        name: patientDetails.name || session.patientDetails.name,
        phone: patientDetails.phone || session.patientDetails.phone,
        email: patientDetails.email || session.patientDetails.email,
        treatment: session.treatmentKey
      }
    );

    if (!bookingResult.success) {
      return {
        success: false,
        error: bookingResult.error,
        message: bookingResult.message
      };
    }

    // 3. Mark session confirmed and update lead status
    session.depositPaid = true;
    session.appointmentConfirmed = true;
    session.confirmedAppointment = bookingResult.appointment;

    session.leadScore = leadScorer.scoreLead({
      adCampaign: session.adCampaignKey,
      treatmentKey: session.treatmentKey,
      messageCount: session.messageCount,
      slotSelected: true,
      depositPaid: true,
      isEmergency: false
    });

    const confirmationText = `🎉 APPOINTMENT CONFIRMED!\nDr. XYZ is scheduled to see you on ${bookingResult.appointment.date} at ${bookingResult.appointment.time}.\n\nAppointment Token: ${bookingResult.appointment.appointmentId}\nDeposit Received: ₹${bookingResult.appointment.depositAmount} (Adjustable against treatment bill)\nReceipt No: ${paymentVerification.receiptId}\nClinic: ${bookingResult.appointment.clinicAddress}\n\nWe have sent your confirmation SMS & WhatsApp notice. See you soon!`;

    session.history.push({ sender: 'bot', text: confirmationText });

    return {
      success: true,
      appointment: bookingResult.appointment,
      receipt: paymentVerification.receipt,
      leadScore: session.leadScore,
      confirmationMessage: confirmationText
    };
  }

  /**
   * Method: resetSession
   * Purpose: Resets session data and calendar holds to facilitate continuous manual QA.
   * Parameters:
   *   - sessionId: String ID.
   * Return: Success status.
   */
  resetSession(sessionId) {
    this.sessionsStore.delete(sessionId);
    calendarEngine.reset();
    paymentEngine.reset();
    return { success: true, message: 'Session and clinic state reset to fresh baseline.' };
  }
}

module.exports = new DentalWorkflowOrchestrator();
