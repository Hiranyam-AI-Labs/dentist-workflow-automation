/**
 * ============================================================================
 * File: public/app.js
 * Module: Dental Patient Intake & Booking Web Controller
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: Client-side event orchestrator managing real-time chat interactions,
 *              ad campaign simulation switching, dynamic doctor slot rendering,
 *              temporary slot locking, simulated deposit checkout modal,
 *              and live telemetry synchronization.
 * ============================================================================
 */

// Application State
const state = {
  sessionId: `DENT-WEB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
  activeCampaign: 'CLEANING_50_OFF',
  campaignsData: {},
  pendingSlotId: null,
  pendingOrderId: null,
  patientName: 'Vikramaditya Shinde',
  patientPhone: '+91 98201 23456',
  patientEmail: 'vikram@example.com'
};

// DOM References
const chatMessagesEl = document.getElementById('chatMessages');
const chatFormEl = document.getElementById('chatForm');
const messageInputEl = document.getElementById('messageInput');
const quickRepliesEl = document.getElementById('quickReplies');
const campaignChipsEl = document.getElementById('campaignChips');
const activeAdBannerEl = document.getElementById('activeAdBanner');
const adHeadlineEl = document.getElementById('adHeadline');
const adPriceBadgeEl = document.getElementById('adPriceBadge');
const leadScoreValueEl = document.getElementById('leadScoreValue');
const leadScoreBarEl = document.getElementById('leadScoreBar');
const leadTierBadgeEl = document.getElementById('leadTierBadge');
const conversionStageTextEl = document.getElementById('conversionStageText');
const triageBadgeEl = document.getElementById('triageBadge');
const sidePanelSlotsEl = document.getElementById('sidePanelSlots');
const refreshScheduleBtnEl = document.getElementById('refreshScheduleBtn');
const resetDemoBtnEl = document.getElementById('resetDemoBtn');

// Telemetry DOM References
const telemetryEngineEl = document.getElementById('telemetryEngine');
const telemTokensEl = document.getElementById('telemTokens');
const telemCostEl = document.getElementById('telemCost');
const telemForexEl = document.getElementById('telemForex');
const telemLatencyEl = document.getElementById('telemLatency');

// Payment Modal References
const paymentModalEl = document.getElementById('paymentModal');
const closePaymentModalBtnEl = document.getElementById('closePaymentModalBtn');
const modalSlotTimeEl = document.getElementById('modalSlotTime');
const simulatePayBtnEl = document.getElementById('simulatePayBtn');
const patientFullNameInput = document.getElementById('patientFullName');
const patientMobileInput = document.getElementById('patientMobile');

/**
 * Function: initializeApp
 * Purpose: Bootstraps client configuration, campaign listeners, and initial ad greeting.
 */
async function initializeApp() {
  setupEventListeners();
  await loadCampaigns();
  await loadSidePanelSchedule();
  startAdConversation(state.activeCampaign);
}

/**
 * Function: setupEventListeners
 * Purpose: Registers DOM event handlers for form submission, modal actions, and resets.
 */
function setupEventListeners() {
  // Chat form submit
  chatFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInputEl.value.trim();
    if (!message) return;

    messageInputEl.value = '';
    appendMessage('user', message);
    await sendMessageToApi(message);
  });

  // Campaign chips switcher
  campaignChipsEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const campaignKey = chip.getAttribute('data-campaign');
    switchAdCampaign(campaignKey);
  });

  // Refresh schedule button
  refreshScheduleBtnEl.addEventListener('click', () => {
    loadSidePanelSchedule();
  });

  // Reset Demo button
  resetDemoBtnEl.addEventListener('click', async () => {
    await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: state.sessionId })
    });

    state.sessionId = `DENT-WEB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    chatMessagesEl.innerHTML = '';
    quickRepliesEl.innerHTML = '';
    startAdConversation(state.activeCampaign);
    loadSidePanelSchedule();
  });

  // Modal close
  closePaymentModalBtnEl.addEventListener('click', () => {
    paymentModalEl.classList.add('hidden');
  });

  // Simulate payment button
  simulatePayBtnEl.addEventListener('click', async () => {
    await executePaymentVerification();
  });
}

/**
 * Function: loadCampaigns
 * Purpose: Fetches configured social media ad campaigns from server.
 */
async function loadCampaigns() {
  try {
    const res = await fetch('/api/campaigns');
    if (res.ok) {
      state.campaignsData = await res.json();
    }
  } catch (err) {
    console.error('Failed to load campaigns:', err);
  }
}

/**
 * Function: switchAdCampaign
 * Purpose: Switches simulated social media ad source, updating header banner and chat.
 */
function switchAdCampaign(campaignKey) {
  state.activeCampaign = campaignKey;
  const campaign = state.campaignsData[campaignKey];

  if (campaign) {
    adHeadlineEl.textContent = campaign.headline;
    adPriceBadgeEl.textContent = `Only ₹${campaign.offer_price}`;
  }

  // Clear chat thread and trigger new ad ingress greeting
  chatMessagesEl.innerHTML = '';
  quickRepliesEl.innerHTML = '';
  startAdConversation(campaignKey);
}

/**
 * Function: startAdConversation
 * Purpose: Triggers initial automated greeting based on active ad campaign.
 */
async function startAdConversation(campaignKey) {
  const campaign = state.campaignsData[campaignKey];
  const initialGreeting = campaign ? campaign.hook_message : "Hello! Welcome to Dr. XYZ Dental Care.";

  // Post bot message
  appendMessage('bot', initialGreeting);

  // Set default quick replies based on campaign
  const defaultActions = [
    'Check Available Slots',
    'Is Treatment Painful?',
    'View Clinic Timings',
    'Consultation Fee & Policy'
  ];
  renderQuickReplies(defaultActions);
}

/**
 * Function: appendMessage
 * Purpose: Renders a chat bubble in the chat thread.
 */
function appendMessage(sender, text, isEmergency = false) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender} ${isEmergency ? 'emergency' : ''}`;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  bubble.innerHTML = `
    <div class="bubble-text">${escapeHtml(text)}</div>
    <span class="bubble-time">${timeStr}</span>
  `;

  chatMessagesEl.appendChild(bubble);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

/**
 * Function: renderQuickReplies
 * Purpose: Displays quick action chips below chat thread.
 */
function renderQuickReplies(actions = []) {
  quickRepliesEl.innerHTML = '';
  actions.forEach(action => {
    const btn = document.createElement('button');
    btn.className = 'reply-chip';
    btn.textContent = action;
    btn.addEventListener('click', () => {
      appendMessage('user', action);
      sendMessageToApi(action);
    });
    quickRepliesEl.appendChild(btn);
  });
}

/**
 * Function: sendMessageToApi
 * Purpose: Dispatches user message to /api/chat/message and handles response.
 */
async function sendMessageToApi(messageText) {
  try {
    const payload = {
      sessionId: state.sessionId,
      message: messageText,
      adCampaign: state.activeCampaign,
      patientName: state.patientName,
      patientPhone: state.patientPhone,
      patientEmail: state.patientEmail
    };

    const res = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('API communication error');
    const data = await res.json();

    // Render bot reply
    appendMessage('bot', data.replyText, data.isEmergency);

    // Update Telemetry Panel
    if (data.telemetry) {
      updateTelemetry(data.telemetry);
    }

    // Update Lead Scoring Panel
    if (data.leadStatus) {
      updateLeadScore(data.leadStatus);
    }

    // Update Triage Status
    updateTriageStatus(data.isEmergency);

    // Render Slot Picker if provided
    if (data.slotPicker) {
      renderEmbeddedSlotPicker(data.slotPicker);
    }

    // Render Quick Replies
    if (data.quickReplies && data.quickReplies.length > 0) {
      renderQuickReplies(data.quickReplies);
    }

    // Reload side schedule in case holds changed
    loadSidePanelSchedule();
  } catch (err) {
    console.error('Error sending message:', err);
    appendMessage('bot', "Dr. XYZ's clinic coordinator is experiencing high volume. Please call our direct helpline at +91 98765 43210.");
  }
}

/**
 * Function: renderEmbeddedSlotPicker
 * Purpose: Embeds an interactive calendar slot selector into the chat thread.
 */
function renderEmbeddedSlotPicker(slotData) {
  const container = document.createElement('div');
  container.className = 'chat-slot-picker-card';

  let slotsHtml = `
    <div class="picker-header">
      <div>
        <div class="picker-title">📅 Choose Consultation Slot (Dr. XYZ)</div>
        <div style="font-size:0.75rem; color: #64748b;">Today: ${slotData.today ? slotData.today.date : 'Available'}</div>
      </div>
      <span class="deposit-tag">₹500 Deposit (100% Adjusted)</span>
    </div>
  `;

  if (slotData.today) {
    slotsHtml += `
      <div class="slots-grid-group">
        <div class="group-label">🌅 Morning Shift</div>
        <div class="slots-tiles-row">
          ${(slotData.today.morning || []).map(s => `
            <button class="slot-tile-btn ${s.isAvailable ? '' : 'booked'}" 
                    data-slot-id="${s.slotId}" 
                    data-slot-time="${s.time}" 
                    ${s.isAvailable ? '' : 'disabled'}>
              ${s.time}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="slots-grid-group">
        <div class="group-label">🌆 Evening Shift</div>
        <div class="slots-tiles-row">
          ${(slotData.today.evening || []).map(s => `
            <button class="slot-tile-btn ${s.isAvailable ? '' : 'booked'}" 
                    data-slot-id="${s.slotId}" 
                    data-slot-time="${s.time}" 
                    ${s.isAvailable ? '' : 'disabled'}>
              ${s.time}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  } else if (slotData.slots) {
    slotsHtml += `
      <div class="slots-grid-group">
        <div class="group-label">🚨 Emergency Priority Slots</div>
        <div class="slots-tiles-row">
          ${slotData.slots.map(s => `
            <button class="slot-tile-btn" data-slot-id="${s.slotId}" data-slot-time="${s.time}">
              ${s.time}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = slotsHtml;

  // Attach slot click listeners
  container.querySelectorAll('.slot-tile-btn:not(.booked)').forEach(btn => {
    btn.addEventListener('click', () => {
      const slotId = btn.getAttribute('data-slot-id');
      const slotTime = btn.getAttribute('data-slot-time');
      handleSlotSelection(slotId, slotTime);
    });
  });

  chatMessagesEl.appendChild(container);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

/**
 * Function: handleSlotSelection
 * Purpose: Temporarily reserves slot for 10 mins and presents deposit payment drawer.
 */
async function handleSlotSelection(slotId, slotTime) {
  try {
    state.pendingSlotId = slotId;

    const res = await fetch('/api/calendar/hold-slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: state.sessionId,
        slotId,
        patientName: state.patientName,
        patientPhone: state.patientPhone,
        patientEmail: state.patientEmail
      })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Could not hold slot. Please pick another.');
      return;
    }

    state.pendingOrderId = data.paymentOrder.orderId;

    // Show in modal
    modalSlotTimeEl.textContent = `${slotId.split('-')[1]}-${slotId.split('-')[2]}-${slotId.split('-')[3]} at ${slotTime}`;
    paymentModalEl.classList.remove('hidden');

    if (data.leadScore) {
      updateLeadScore(data.leadScore);
    }
  } catch (err) {
    console.error('Failed to hold slot:', err);
  }
}

/**
 * Function: executePaymentVerification
 * Purpose: Simulates instant payment verification of ₹500 deposit and confirms appointment.
 */
async function executePaymentVerification() {
  try {
    simulatePayBtnEl.disabled = true;
    simulatePayBtnEl.innerHTML = '<span>Verifying Deposit Payment...</span>';

    // Capture user details from input fields
    state.patientName = patientFullNameInput.value.trim() || state.patientName;
    state.patientPhone = patientMobileInput.value.trim() || state.patientPhone;

    const res = await fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: state.sessionId,
        orderId: state.pendingOrderId,
        paymentMethod: 'UPI',
        patientName: state.patientName,
        patientPhone: state.patientPhone,
        patientEmail: state.patientEmail
      })
    });

    const data = await res.json();
    simulatePayBtnEl.disabled = false;
    simulatePayBtnEl.innerHTML = '<span>✓ Pay ₹500 Deposit & Confirm Slot</span>';

    if (!res.ok) {
      alert(data.message || 'Payment confirmation failed');
      return;
    }

    // Close payment modal
    paymentModalEl.classList.add('hidden');

    // Update Lead Score to HOT
    if (data.leadScore) {
      updateLeadScore(data.leadScore);
    }

    // Render Confirmed Booking Voucher Card in chat
    renderConfirmationCard(data.appointment, data.receipt);

    // Refresh schedule
    loadSidePanelSchedule();
  } catch (err) {
    simulatePayBtnEl.disabled = false;
    simulatePayBtnEl.innerHTML = '<span>✓ Pay ₹500 Deposit & Confirm Slot</span>';
    alert('Payment verification failed. Please retry.');
  }
}

/**
 * Function: renderConfirmationCard
 * Purpose: Embeds official appointment confirmation card in chat thread.
 */
function renderConfirmationCard(appt, receipt) {
  const container = document.createElement('div');
  container.className = 'chat-confirmation-card';

  container.innerHTML = `
    <div class="confirmation-badge-row">
      <span>🎉</span>
      <span>APPOINTMENT OFFICIALLY CONFIRMED</span>
    </div>
    <div class="voucher-details-grid">
      <div class="voucher-item">
        <span>Appointment Token:</span>
        <strong>${appt.appointmentId}</strong>
      </div>
      <div class="voucher-item">
        <span>Doctor:</span>
        <strong>${appt.doctor}</strong>
      </div>
      <div class="voucher-item">
        <span>Date & Time:</span>
        <strong>${appt.date} at ${appt.time}</strong>
      </div>
      <div class="voucher-item">
        <span>Deposit Verified:</span>
        <strong style="color: #16a34a;">₹${appt.depositAmount} (Receipt: ${receipt ? receipt.receiptId : 'PAID'})</strong>
      </div>
    </div>
    <div class="voucher-guidelines">
      <strong>Clinic Address:</strong> ${appt.clinicAddress}<br>
      • Deposit is 100% adjusted on your clinic bill.<br>
      • Zero wait time guaranteed with your appointment pass.
    </div>
  `;

  chatMessagesEl.appendChild(container);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

/**
 * Function: updateLeadScore
 * Purpose: Updates visual lead score meter and stage.
 */
function updateLeadScore(leadScore) {
  leadScoreValueEl.textContent = leadScore.score;
  leadScoreBarEl.style.width = `${leadScore.score}%`;

  leadTierBadgeEl.className = `tier-badge ${leadScore.tier.toLowerCase()}`;
  leadTierBadgeEl.textContent = `${leadScore.tier} LEAD`;

  conversionStageTextEl.textContent = leadScore.conversionStage.replace(/_/g, ' ');
}

/**
 * Function: updateTriageStatus
 * Purpose: Updates clinical emergency triage status.
 */
function updateTriageStatus(isEmergency) {
  if (isEmergency) {
    triageBadgeEl.className = 'triage-badge emergency';
    triageBadgeEl.textContent = '🚨 P0 Emergency Alert';
  } else {
    triageBadgeEl.className = 'triage-badge normal';
    triageBadgeEl.textContent = '🟢 Routine Consultation';
  }
}

/**
 * Function: updateTelemetry
 * Purpose: Synchronizes token accounting and live INR cost in side panel.
 */
function updateTelemetry(telemetry) {
  telemetryEngineEl.textContent = telemetry.model || 'gpt-4o-mini';
  telemTokensEl.textContent = telemetry.total_tokens || telemetry.completion_tokens || 180;
  telemCostEl.textContent = `₹${(telemetry.inr_cost || 0.015).toFixed(4)}`;
  telemForexEl.textContent = `₹${(telemetry.inr_rate || 84.50).toFixed(2)}`;
  telemLatencyEl.textContent = `${telemetry.latency_ms || 85}ms`;
}

/**
 * Function: loadSidePanelSchedule
 * Purpose: Queries /api/calendar/slots and renders Dr. XYZ's slots in side panel.
 */
async function loadSidePanelSchedule() {
  try {
    const res = await fetch('/api/calendar/slots');
    if (!res.ok) return;
    const data = await res.json();

    const slots = [...(data.morningSlots || []), ...(data.eveningSlots || [])];
    sidePanelSlotsEl.innerHTML = '';

    slots.slice(0, 6).forEach(slot => {
      const row = document.createElement('div');
      row.className = 'side-slot-row';
      row.innerHTML = `
        <span class="side-slot-time">${slot.time}</span>
        <span class="side-slot-badge ${slot.isAvailable ? 'open' : 'booked'}">
          ${slot.isAvailable ? 'AVAILABLE' : (slot.status === 'HELD' ? 'HELD' : 'BOOKED')}
        </span>
      `;
      sidePanelSlotsEl.appendChild(row);
    });
  } catch (err) {
    sidePanelSlotsEl.innerHTML = '<div class="slot-loading">Schedule unavailable</div>';
  }
}

/**
 * Function: escapeHtml
 * Purpose: Sanitizes user strings to avoid XSS injections.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Auto-boot on load
window.addEventListener('DOMContentLoaded', initializeApp);
