/**
 * ============================================================================
 * File: src/server.js
 * Module: Dentist Workflow Automation Express Gateway & Web Server
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: Production-ready HTTP API gateway hosting REST endpoints for the
 *              conversational dental AI, real-time doctor calendar integration,
 *              appointment deposit collection, and serving the interactive web
 *              chatbot demo experience.
 * ============================================================================
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const orchestrator = require('./services/workflow_orchestrator');
const calendarEngine = require('./services/calendar_engine');
const paymentEngine = require('./services/payment_engine');
const treatmentsData = require('./data/treatments.json');
const clinicConfig = require('./data/clinic_config.json');

const app = express();
const PORT = process.env.PORT || 5055;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static frontend assets for web chatbot demo
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Route: POST /api/chat/message
 * Purpose: Primary conversational endpoint. Evaluates patient inquiries, executes
 *          clinical emergency triage, generates AI responses, updates lead scoring,
 *          and returns dynamic calendar slot pickers.
 * Parameters:
 *   - req.body: { sessionId, message, adCampaign, patientName, patientPhone, patientEmail }
 * Return: Unified outbound chat envelope JSON.
 */
app.post('/api/chat/message', async (req, res) => {
  try {
    const { sessionId, message, adCampaign, patientName, patientPhone, patientEmail } = req.body;

    if (!message && !adCampaign) {
      return res.status(400).json({ error: 'Message or adCampaign is required.' });
    }

    const response = await orchestrator.processPatientMessage({
      sessionId,
      message,
      adCampaign,
      patientName,
      patientPhone,
      patientEmail
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in /api/chat/message:', error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to process message. Please retry.'
    });
  }
});

/**
 * Route: GET /api/calendar/slots
 * Purpose: Retrieves real-time doctor availability and open consultation slots.
 * Query Parameters:
 *   - date: Optional YYYY-MM-DD date string.
 * Return: Calendar slot availability object.
 */
app.get('/api/calendar/slots', (req, res) => {
  try {
    const { date } = req.query;
    const slots = calendarEngine.getAvailableSlots(date);
    return res.status(200).json(slots);
  } catch (error) {
    console.error('Error in /api/calendar/slots:', error);
    return res.status(500).json({ error: 'Failed to retrieve calendar slots.' });
  }
});

/**
 * Route: POST /api/calendar/hold-slot
 * Purpose: Temporarily reserves a chosen doctor slot for 10 minutes and generates
 *          the commitment deposit payment order.
 * Parameters:
 *   - req.body: { sessionId, slotId, patientName, patientPhone, patientEmail }
 * Return: Reservation details and payment order JSON.
 */
app.post('/api/calendar/hold-slot', async (req, res) => {
  try {
    const { sessionId, slotId, patientName, patientPhone, patientEmail } = req.body;

    if (!slotId) {
      return res.status(400).json({ error: 'slotId is required.' });
    }

    const result = await orchestrator.selectSlotAndInitiateDeposit(sessionId, slotId, {
      name: patientName,
      phone: patientPhone,
      email: patientEmail
    });

    if (!result.success) {
      return res.status(409).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in /api/calendar/hold-slot:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Route: POST /api/payment/confirm
 * Purpose: Verifies deposit payment completion and permanently confirms doctor appointment.
 * Parameters:
 *   - req.body: { sessionId, orderId, paymentMethod, patientName, patientPhone, patientEmail }
 * Return: Confirmed appointment voucher and digital receipt.
 */
app.post('/api/payment/confirm', async (req, res) => {
  try {
    const { sessionId, orderId, paymentMethod = 'UPI', patientName, patientPhone, patientEmail } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required.' });
    }

    const result = await orchestrator.verifyDepositAndConfirmAppointment(
      sessionId,
      orderId,
      paymentMethod,
      { name: patientName, phone: patientPhone, email: patientEmail }
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in /api/payment/confirm:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Route: GET /api/appointments
 * Purpose: Lists all active and seed bookings for clinic administrative view.
 * Return: Array of appointment records.
 */
app.get('/api/appointments', (req, res) => {
  try {
    const appointments = calendarEngine.getAllAppointments();
    return res.status(200).json({
      doctor: clinicConfig.head_doctor,
      clinic: clinicConfig.clinic_name,
      totalAppointments: appointments.length,
      appointments
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve appointments.' });
  }
});

/**
 * Route: GET /api/campaigns
 * Purpose: Returns configured social media ad campaigns for interactive demo switcher.
 */
app.get('/api/campaigns', (req, res) => {
  return res.status(200).json(treatmentsData.ad_campaigns);
});

/**
 * Route: GET /api/treatments
 * Purpose: Returns dental procedure catalog with descriptions and pricing.
 */
app.get('/api/treatments', (req, res) => {
  return res.status(200).json(treatmentsData.treatments);
});

/**
 * Route: POST /api/reset
 * Purpose: Resets test conversation and calendar state for clean client demonstrations.
 */
app.post('/api/reset', (req, res) => {
  const { sessionId = 'default-demo-session' } = req.body;
  const result = orchestrator.resetSession(sessionId);
  return res.status(200).json(result);
});

/**
 * Route: GET /health
 * Purpose: Application health and readiness status check.
 */
app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'HEALTHY',
    service: 'dentist-workflow-automation',
    timestamp: new Date().toISOString(),
    doctor: clinicConfig.head_doctor,
    clinic: clinicConfig.clinic_name
  });
});

// Start listening if not imported in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🦷 Dentist Workflow Automation Server Live on Port ${PORT}`);
    console.log(`🏥 Clinic: ${clinicConfig.clinic_name}`);
    console.log(`👨‍⚕️ Doctor: ${clinicConfig.head_doctor}`);
    console.log(`🌐 Web Chat Demo: http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
