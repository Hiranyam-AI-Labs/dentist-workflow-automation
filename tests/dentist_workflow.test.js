/**
 * ============================================================================
 * File: tests/dentist_workflow.test.js
 * Module: Dentist Workflow Automation Exhaustive Test Suite
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: Exhaustive Jest test suite validating end-to-end patient workflow:
 *              1. Social media ad ingress context and campaign hooks
 *              2. Clinical emergency triage gate (P0_EMERGENCY interception)
 *              3. ChatGPT AI adapter, objection handling & live INR cost tracking
 *              4. Lead qualification & scoring engine (COLD -> WARM -> HOT)
 *              5. Real-time calendar engine, slot locking & collision prevention
 *              6. Deposit collection & verified appointment confirmation
 *              7. REST API Gateway HTTP endpoints
 * ============================================================================
 */

const request = require('supertest');
const app = require('../src/server');
const triageGate = require('../src/services/triage_gate');
const leadScorer = require('../src/services/lead_scoring');
const calendarEngine = require('../src/services/calendar_engine');
const paymentEngine = require('../src/services/payment_engine');
const chatgptAdapter = require('../src/services/chatgpt_adapter');
const orchestrator = require('../src/services/workflow_orchestrator');

describe('🦷 Dentist Workflow Automation Platform Test Suite', () => {
  beforeEach(() => {
    calendarEngine.reset();
    paymentEngine.reset();
  });

  describe('1. Social Media Ad Ingress & Campaign Binding', () => {
    test('Correctly seeds session with 50% Off Teeth Cleaning ad context', () => {
      const session = orchestrator.getOrCreateSession('TEST-AD-1', 'CLEANING_50_OFF');
      expect(session.adCampaignKey).toBe('CLEANING_50_OFF');
      expect(session.campaign.offer_price).toBe(499);
      expect(session.treatmentKey).toBe('teeth_cleaning');
      expect(session.campaign.headline).toContain('50% Off');
    });

    test('Correctly seeds session with Pain-Free Root Canal ad context', () => {
      const session = orchestrator.getOrCreateSession('TEST-AD-2', 'RCT_PAIN_FREE');
      expect(session.adCampaignKey).toBe('RCT_PAIN_FREE');
      expect(session.campaign.offer_price).toBe(3500);
      expect(session.treatmentKey).toBe('root_canal');
    });

    test('Correctly seeds session with Dental Implants ad context', () => {
      const session = orchestrator.getOrCreateSession('TEST-AD-3', 'IMPLANT_FREE_CONSULT');
      expect(session.adCampaignKey).toBe('IMPLANT_FREE_CONSULT');
      expect(session.campaign.offer_price).toBe(19999);
      expect(session.treatmentKey).toBe('dental_implants');
    });
  });

  describe('2. Clinical Safety & Emergency Triage Gate', () => {
    test('Intercepts facial swelling and flags P0_EMERGENCY with direct hotline', () => {
      const triage = triageGate.evaluate('My right cheek is completely swollen and I cannot sleep');
      expect(triage.isEmergency).toBe(true);
      expect(triage.priority).toBe('P0_EMERGENCY');
      expect(triage.matchedTriggers).toContain('FACIAL_SWELLING');
      expect(triage.emergencyNotice).toContain('Direct Doctor Hotline');
      expect(triage.emergencyNotice).toContain('+91 98765 43219');
    });

    test('Intercepts acute trauma/broken tooth from accident and issues milk preservation advice', () => {
      const triage = triageGate.evaluate('I had a bicycle accident and broke my front tooth');
      expect(triage.isEmergency).toBe(true);
      expect(triage.priority).toBe('P0_EMERGENCY');
      expect(triage.matchedTriggers).toContain('ACUTE_TRAUMA');
      expect(triage.emergencyNotice).toContain('cold milk');
    });

    test('Intercepts continuous bleeding and issues gauze compression guidance', () => {
      const triage = triageGate.evaluate('Heavy continuous bleeding from gums after extraction');
      expect(triage.isEmergency).toBe(true);
      expect(triage.priority).toBe('P0_EMERGENCY');
      expect(triage.matchedTriggers).toContain('ACTIVE_BLEEDING');
      expect(triage.emergencyNotice).toContain('gauze');
    });

    test('Treats routine dental checkup or cleaning inquiry as P2_ROUTINE', () => {
      const triage = triageGate.evaluate('I want to schedule a routine teeth cleaning for tomorrow');
      expect(triage.isEmergency).toBe(false);
      expect(triage.priority).toBe('P2_ROUTINE');
      expect(triage.emergencyNotice).toBeNull();
    });
  });

  describe('3. ChatGPT LLM Intelligence, Objections & Forex Telemetry', () => {
    test('Addresses pain/fear objection with painless rotary and numbing assurance', async () => {
      const result = await chatgptAdapter.generateResponse({
        systemPrompt: 'Dental assistant prompt',
        userMessage: 'Is Root Canal very painful? I am terrified of dentists.',
        adContext: { service_key: 'root_canal' }
      });

      expect(result.intent).toBe('OBJECTION_PAIN_FEAR');
      expect(result.reply.toLowerCase()).toContain('pain-free');
      expect(result.isQualifiedLead).toBe(true);
      expect(result.telemetry).toBeDefined();
      expect(result.telemetry.inr_cost).toBeGreaterThanOrEqual(0);
    });

    test('Explains booking deposit transparency and full bill adjustment', async () => {
      const result = await chatgptAdapter.generateResponse({
        systemPrompt: 'Dental assistant prompt',
        userMessage: 'Why do I have to pay a ₹500 deposit to book?',
        adContext: { service_key: 'teeth_cleaning' }
      });

      expect(result.intent).toBe('INQUIRY_DEPOSIT_POLICY');
      expect(result.reply).toContain('100% adjusted');
      expect(result.reply).toContain('refundable');
    });

    test('Calculates live USD to INR token cost telemetry', async () => {
      const cost = await chatgptAdapter.calculateCost(200, 100, 'gpt-4o-mini');
      expect(cost.usdCost).toBeGreaterThan(0);
      expect(cost.inrCost).toBeGreaterThan(0);
      expect(cost.inrRate).toBeGreaterThanOrEqual(80);
    });
  });

  describe('4. Dental Lead Qualification & Scoring Engine', () => {
    test('Scores generic initial greeting as COLD (<= 35)', () => {
      const scoring = leadScorer.scoreLead({
        adCampaign: 'GENERAL_INTAKE',
        messageCount: 1,
        queryText: 'Hello'
      });

      expect(scoring.score).toBeLessThanOrEqual(35);
      expect(scoring.tier).toBe('COLD');
      expect(scoring.conversionStage).toBe('INITIAL_GREETING');
    });

    test('Scores specific treatment interest with exploratory inquiry as WARM (40-69)', () => {
      const scoring = leadScorer.scoreLead({
        adCampaign: 'GENERAL_INTAKE',
        treatmentKey: 'root_canal',
        messageCount: 2,
        queryText: 'How much does root canal cost?'
      });

      expect(scoring.score).toBeGreaterThanOrEqual(40);
      expect(scoring.score).toBeLessThan(70);
      expect(scoring.tier).toBe('WARM');
    });

    test('Scores patient who selected slot and paid deposit as HOT (>= 80)', () => {
      const scoring = leadScorer.scoreLead({
        adCampaign: 'CLEANING_50_OFF',
        treatmentKey: 'teeth_cleaning',
        messageCount: 3,
        slotSelected: true,
        depositPaid: true,
        queryText: 'Payment completed'
      });

      expect(scoring.score).toBeGreaterThanOrEqual(80);
      expect(scoring.tier).toBe('HOT');
      expect(scoring.conversionStage).toBe('APPOINTMENT_CONFIRMED');
    });

    test('Emergency inquiries immediately score HOT (95)', () => {
      const scoring = leadScorer.scoreLead({
        isEmergency: true,
        queryText: 'Severe unbearable jaw pain'
      });

      expect(scoring.score).toBe(95);
      expect(scoring.tier).toBe('HOT');
    });
  });

  describe('5. Real-Time Dentist Calendar & Collision Prevention', () => {
    test('Returns open slots for today across morning and evening clinic shifts', () => {
      const slots = calendarEngine.getAvailableSlots();
      expect(slots.doctor).toBe('Dr. XYZ');
      expect(slots.morningSlots.length).toBe(8);
      expect(slots.availableSlotsCount).toBeGreaterThan(0);
    });

    test('Successfully locks a slot on hold for 10 minutes', () => {
      const today = calendarEngine.getFormattedDate(0);
      const slotId = `SLOT-${today}-0930AM`;

      const holdResult = calendarEngine.holdSlot(slotId, {
        name: 'Adwait Deshpande',
        treatment: 'Teeth Cleaning',
        sessionId: 'SESS-101'
      });

      expect(holdResult.success).toBe(true);
      expect(holdResult.holdMinutes).toBe(10);
    });

    test('Prevents slot collision when second patient attempts to hold same slot', () => {
      const today = calendarEngine.getFormattedDate(0);
      const slotId = `SLOT-${today}-1130AM`;

      // First patient holds slot
      const hold1 = calendarEngine.holdSlot(slotId, { sessionId: 'SESS-AAA', name: 'User 1' });
      expect(hold1.success).toBe(true);

      // Second patient attempts to hold same slot
      const hold2 = calendarEngine.holdSlot(slotId, { sessionId: 'SESS-BBB', name: 'User 2' });
      expect(hold2.success).toBe(false);
      expect(hold2.error).toBe('SLOT_TEMPORARILY_HELD');
    });

    test('Confirms booking permanently upon deposit verification', () => {
      const today = calendarEngine.getFormattedDate(0);
      const slotId = `SLOT-${today}-1200PM`;

      const confirmation = calendarEngine.confirmBooking(
        slotId,
        { paymentId: 'PAY-TEST-999', amount: 500 },
        { name: 'Adwait Deshpande', phone: '+91 98201 23456', treatment: 'Root Canal' }
      );

      expect(confirmation.success).toBe(true);
      expect(confirmation.appointment.bookingStatus).toBe('CONFIRMED');
      expect(confirmation.appointment.appointmentId).toContain('APPT-XYZ-');
      expect(confirmation.appointment.depositAmount).toBe(500);

      // Verify slot is now marked BOOKED and cannot be taken
      const holdAgain = calendarEngine.holdSlot(slotId, { sessionId: 'SESS-CCC' });
      expect(holdAgain.success).toBe(false);
      expect(holdAgain.error).toBe('SLOT_ALREADY_BOOKED');
    });
  });

  describe('6. Deposit Payment Collection & No-Show Reduction Engine', () => {
    test('Creates ₹500 commitment deposit payment order with valid UPI Intent URI', () => {
      const today = calendarEngine.getFormattedDate(0);
      const slotId = `SLOT-${today}-0430PM`;

      const order = paymentEngine.createDepositOrder({
        slotId,
        patientName: 'Ramesh Kadam',
        patientPhone: '+91 98331 45678'
      });

      expect(order.success).toBe(true);
      expect(order.amount).toBe(500);
      expect(order.orderId).toContain('ORD-DENT-');
      expect(order.upiUri).toContain('drxyz.dentist@icici');
      expect(order.upiUri).toContain('am=500');
    });

    test('Verifies payment and issues structured digital receipt', () => {
      const today = calendarEngine.getFormattedDate(0);
      const slotId = `SLOT-${today}-0500PM`;

      const order = paymentEngine.createDepositOrder({ slotId });
      const verification = paymentEngine.verifyPayment({
        orderId: order.orderId,
        paymentMethod: 'UPI'
      });

      expect(verification.success).toBe(true);
      expect(verification.receiptId).toContain('REC-XYZ-');
      expect(verification.receipt.status).toBe('SUCCESS');
      expect(verification.receipt.amount).toBe(500);
      expect(verification.receipt.policyNotice).toContain('100% adjustable');
    });
  });

  describe('7. End-to-End REST API Gateway Integration', () => {
    test('GET /health returns healthy status with clinic metadata', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('HEALTHY');
      expect(res.body.doctor).toContain('Dr. XYZ');
    });

    test('POST /api/chat/message returns structured conversational response with slot picker', async () => {
      const res = await request(app)
        .post('/api/chat/message')
        .send({
          sessionId: 'API-TEST-SESS-1',
          message: 'I would like to book a slot for teeth cleaning tomorrow',
          adCampaign: 'CLEANING_50_OFF',
          patientName: 'Vikramaditya Shinde'
        });

      expect(res.status).toBe(200);
      expect(res.body.replyText).toBeDefined();
      expect(res.body.leadStatus).toBeDefined();
      expect(res.body.slotPicker).toBeDefined();
      expect(res.body.telemetry).toBeDefined();
    });

    test('POST /api/calendar/hold-slot successfully reserves doctor slot and issues deposit order', async () => {
      const today = calendarEngine.getFormattedDate(0);
      const slotId = `SLOT-${today}-0630PM`;

      const res = await request(app)
        .post('/api/calendar/hold-slot')
        .send({
          sessionId: 'API-TEST-SESS-2',
          slotId,
          patientName: 'Vikramaditya Shinde',
          patientPhone: '+91 98201 23456'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.paymentOrder).toBeDefined();
      expect(res.body.paymentOrder.amount).toBe(500);
    });

    test('POST /api/payment/confirm validates deposit and confirms appointment pass', async () => {
      const today = calendarEngine.getFormattedDate(0);
      const slotId = `SLOT-${today}-0700PM`;

      // 1. Hold slot
      const holdRes = await request(app)
        .post('/api/calendar/hold-slot')
        .send({
          sessionId: 'API-TEST-SESS-3',
          slotId,
          patientName: 'Vikramaditya Shinde',
          patientPhone: '+91 98201 23456'
        });

      const orderId = holdRes.body.paymentOrder.orderId;

      // 2. Confirm payment
      const confirmRes = await request(app)
        .post('/api/payment/confirm')
        .send({
          sessionId: 'API-TEST-SESS-3',
          orderId,
          paymentMethod: 'UPI',
          patientName: 'Vikramaditya Shinde'
        });

      expect(confirmRes.status).toBe(200);
      expect(confirmRes.body.success).toBe(true);
      expect(confirmRes.body.appointment.bookingStatus).toBe('CONFIRMED');
      expect(confirmRes.body.appointment.appointmentId).toContain('APPT-XYZ-');
      expect(confirmRes.body.leadScore.tier).toBe('HOT');
    });

    test('GET /api/appointments returns list of active appointments', async () => {
      const res = await request(app).get('/api/appointments');
      expect(res.status).toBe(200);
      expect(res.body.appointments.length).toBeGreaterThan(0);
    });
  });
});
