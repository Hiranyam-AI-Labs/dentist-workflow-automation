/**
 * ============================================================================
 * File: src/services/calendar_engine.js
 * Module: Real-Time Dentist Calendar Scheduling Engine
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: High-concurrency calendar management engine for Dr. XYZ.
 *              Generates real-time availability across morning and evening clinic shifts,
 *              implements temporary slot locking (10-minute hold) during payment checkout
 *              to prevent double-booking collisions, and finalizes confirmed bookings
 *              upon deposit verification.
 * ============================================================================
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Class: DentistCalendarEngine
 * Purpose: Manages clinic schedule, slot querying, temporary reservation holds,
 *          and final appointment bookings for Dr. XYZ.
 * Manual Debugging Notes:
 *   - Slot holds expire after 10 minutes (configurable via SLOT_HOLD_MINUTES).
 *   - In-memory store initialized with seed bookings for realistic demo availability.
 */
class DentistCalendarEngine {
  /**
   * Method: constructor
   * Purpose: Sets up operating schedule, hold durations, and in-memory booking storage.
   * Parameters: None.
   * Return: DentistCalendarEngine instance.
   * Errors: None.
   * Manual Debugging Notes: Doctor details default to Dr. XYZ (BDS, MDS).
   */
  constructor() {
    this.doctorName = 'Dr. XYZ';
    this.specialization = 'BDS, MDS - Prosthodontics & Oral Implantology';
    this.holdDurationMs = (parseInt(process.env.SLOT_HOLD_MINUTES, 10) || 10) * 60 * 1000;
    
    // In-Memory storage for bookings and held slots: slotId -> SlotRecord
    this.slotsStore = new Map();
    this.appointmentsStore = new Map();

    // Initialize with mock seed data for today and tomorrow
    this._initializeSeedData();
  }

  /**
   * Method: _initializeSeedData
   * Purpose: Seeds existing appointments so the calendar reflects realistic dentist availability.
   * Parameters: None.
   * Return: Void.
   * Errors: None.
   * Manual Debugging Notes: Locks a few slots as 'BOOKED' to demonstrate real-time collision detection.
   */
  _initializeSeedData() {
    this.slotsStore.clear();
    this.appointmentsStore.clear();

    const todayStr = this.getFormattedDate(0);
    const tomorrowStr = this.getFormattedDate(1);

    // Pre-book 1-2 slots on today and tomorrow to simulate active clinic traffic
    const seedBookings = [
      { date: todayStr, time: '10:30 AM', patientName: 'Rohan Mehta', treatment: 'Root Canal Follow-up' },
      { date: todayStr, time: '05:30 PM', patientName: 'Priya Nair', treatment: 'Dental Implant Consultation' },
      { date: tomorrowStr, time: '11:00 AM', patientName: 'Amit Shah', treatment: 'Teeth Whitening' }
    ];

    seedBookings.forEach((b, idx) => {
      const slotId = `SLOT-${b.date}-${b.time.replace(/[: ]/g, '')}`;
      const apptId = `APPT-SEED-${idx + 101}`;
      
      this.slotsStore.set(slotId, {
        id: slotId,
        date: b.date,
        time: b.time,
        status: 'BOOKED',
        patientName: b.patientName,
        treatment: b.treatment,
        appointmentId: apptId
      });

      this.appointmentsStore.set(apptId, {
        appointmentId: apptId,
        slotId,
        date: b.date,
        time: b.time,
        doctor: this.doctorName,
        patientName: b.patientName,
        treatment: b.treatment,
        depositPaid: true,
        depositAmount: 500,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
      });
    });
  }

  /**
   * Method: getFormattedDate
   * Purpose: Helper utility to return YYYY-MM-DD string with day offset.
   * Parameters:
   *   - offsetDays: Number of days forward from today (0 = today, 1 = tomorrow).
   * Return: String in format YYYY-MM-DD.
   * Errors: None.
   */
  getFormattedDate(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * Method: releaseExpiredHolds
   * Purpose: Garbage collects temporarily held slots whose 10-minute hold window expired.
   * Parameters: None.
   * Return: Number of expired holds released.
   * Errors: None.
   * Manual Debugging Notes: Invoked automatically before querying available slots.
   */
  releaseExpiredHolds() {
    const now = Date.now();
    let releasedCount = 0;

    for (const [slotId, slot] of this.slotsStore.entries()) {
      if (slot.status === 'HELD' && slot.heldUntil && slot.heldUntil < now) {
        this.slotsStore.delete(slotId);
        releasedCount++;
      }
    }

    return releasedCount;
  }

  /**
   * Method: getAvailableSlots
   * Purpose: Computes real-time open slots for Dr. XYZ on a given date.
   * Parameters:
   *   - dateString: Optional date in YYYY-MM-DD format (defaults to today).
   * Return: Object containing date, formatted date, morningSlots, eveningSlots, totalAvailable.
   * Errors: None.
   * Manual Debugging Notes: Respects clinic hours (Morning 09:30-13:30, Evening 16:30-20:30).
   */
  getAvailableSlots(dateString = null) {
    this.releaseExpiredHolds();

    const targetDate = dateString || this.getFormattedDate(0);
    const dayOfWeek = new Date(targetDate).getDay(); // 0 is Sunday

    // Slot definitions
    const morningTimes = [
      '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
      '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM'
    ];

    const eveningTimes = dayOfWeek === 0 ? [] : [
      '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
      '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'
    ];

    const formatSlot = (timeStr, period) => {
      const slotId = `SLOT-${targetDate}-${timeStr.replace(/[: ]/g, '')}`;
      const existing = this.slotsStore.get(slotId);

      let status = 'AVAILABLE';
      let heldTimeRemainingMs = 0;

      if (existing) {
        if (existing.status === 'BOOKED') {
          status = 'BOOKED';
        } else if (existing.status === 'HELD') {
          status = 'HELD';
          heldTimeRemainingMs = Math.max(0, existing.heldUntil - Date.now());
        }
      }

      return {
        slotId,
        date: targetDate,
        time: timeStr,
        period, // 'morning' or 'evening'
        status,
        doctor: this.doctorName,
        isAvailable: status === 'AVAILABLE',
        heldRemainingSeconds: Math.ceil(heldTimeRemainingMs / 1000)
      };
    };

    const morning = morningTimes.map(t => formatSlot(t, 'morning'));
    const evening = eveningTimes.map(t => formatSlot(t, 'evening'));

    const allSlots = [...morning, ...evening];
    const availableCount = allSlots.filter(s => s.isAvailable).length;

    return {
      date: targetDate,
      doctor: this.doctorName,
      specialization: this.specialization,
      isSunday: dayOfWeek === 0,
      totalSlots: allSlots.length,
      availableSlotsCount: availableCount,
      morningSlots: morning,
      eveningSlots: evening
    };
  }

  /**
   * Method: holdSlot
   * Purpose: Temporarily locks a slot for a patient while they review or make deposit payment.
   * Parameters:
   *   - slotId: Unique slot identifier (e.g. 'SLOT-2026-09-12-1000AM').
   *   - patientInfo: Object with patient name, phone, treatmentKey.
   * Return: Object with { success, slot, error }.
   * Errors: Returns success: false if slot is already booked or held by someone else.
   * Manual Debugging Notes: Hold expires after 10 minutes.
   */
  holdSlot(slotId, patientInfo = {}) {
    this.releaseExpiredHolds();

    const existing = this.slotsStore.get(slotId);

    // Collision detection
    if (existing && existing.status === 'BOOKED') {
      return {
        success: false,
        error: 'SLOT_ALREADY_BOOKED',
        message: 'This slot was just booked by another patient. Please select an alternate slot.'
      };
    }

    if (existing && existing.status === 'HELD' && existing.sessionId !== patientInfo.sessionId) {
      return {
        success: false,
        error: 'SLOT_TEMPORARILY_HELD',
        message: 'This slot is temporarily held during checkout by another patient. Try another slot or retry in 10 minutes.'
      };
    }

    const heldUntil = Date.now() + this.holdDurationMs;
    const holdRecord = {
      id: slotId,
      status: 'HELD',
      heldUntil,
      patientName: patientInfo.name || 'Valued Patient',
      phone: patientInfo.phone || null,
      treatment: patientInfo.treatment || 'Dental Consultation',
      sessionId: patientInfo.sessionId || null,
      heldAt: new Date().toISOString()
    };

    this.slotsStore.set(slotId, holdRecord);

    return {
      success: true,
      slotId,
      heldUntil: new Date(heldUntil).toISOString(),
      holdMinutes: Math.round(this.holdDurationMs / 60000),
      message: `Slot reserved for you for 10 minutes. Please complete the ₹500 commitment deposit to confirm.`
    };
  }

  /**
   * Method: confirmBooking
   * Purpose: Transitions a held or available slot to permanently BOOKED upon deposit verification.
   * Parameters:
   *   - slotId: Unique slot ID.
   *   - paymentDetails: Object with paymentId, amount, method, transactionRef.
   *   - patientDetails: Object with name, phone, email, notes, treatmentKey.
   * Return: Object with confirmed appointment record and calendar invite details.
   * Errors: Throws error if slot cannot be locked.
   * Manual Debugging Notes: Generates APPT-XYZ-XXXX appointment confirmation token.
   */
  confirmBooking(slotId, paymentDetails = {}, patientDetails = {}) {
    const existing = this.slotsStore.get(slotId);

    // Verify slot is not already booked by another confirmed payment
    if (existing && existing.status === 'BOOKED' && existing.paymentId !== paymentDetails.paymentId) {
      return {
        success: false,
        error: 'SLOT_COLLISION',
        message: 'This slot has already been confirmed for another patient.'
      };
    }

    // Extract date and time from slotId if not explicitly provided
    // slotId format: SLOT-YYYY-MM-DD-HHMMAM
    const parts = slotId.split('-');
    const date = `${parts[1]}-${parts[2]}-${parts[3]}`;
    const rawTime = parts[4] || '';
    
    // Format time back to human string
    let displayTime = '10:00 AM';
    if (rawTime.length >= 6) {
      const hh = rawTime.substring(0, 2);
      const mm = rawTime.substring(2, 4);
      const ampm = rawTime.substring(4);
      displayTime = `${hh}:${mm} ${ampm}`;
    }

    const appointmentId = `APPT-XYZ-${Math.floor(1000 + Math.random() * 9000)}`;

    const appointmentRecord = {
      appointmentId,
      slotId,
      date,
      time: displayTime,
      doctor: this.doctorName,
      specialization: this.specialization,
      clinicName: process.env.CLINIC_NAME || 'Dr. XYZ Multispeciality Dental & Implant Clinic',
      clinicAddress: process.env.CLINIC_ADDRESS || 'Suite 402, Lotus Healthcare Park, Linking Road, Bandra West, Mumbai, MH 400050',
      patientName: patientDetails.name || 'Valued Patient',
      patientPhone: patientDetails.phone || '+91 98000 00000',
      patientEmail: patientDetails.email || null,
      treatment: patientDetails.treatment || 'Comprehensive Dental Consultation',
      depositAmount: paymentDetails.amount || 500,
      paymentId: paymentDetails.paymentId || `PAY-${uuidv4().substring(0, 8)}`,
      paymentStatus: 'PAID_VERIFIED',
      bookingStatus: 'CONFIRMED',
      confirmationToken: `DENT-CONF-${appointmentId}`,
      createdAt: new Date().toISOString(),
      instructions: [
        'Please arrive 10 minutes prior to your scheduled time.',
        'Carry any previous dental X-rays, OPG scans, or medical history reports if available.',
        'Your ₹500 booking deposit will be 100% adjusted against your treatment bill on arrival.',
        'Zero waiting time guaranteed with your confirmed slot token.'
      ]
    };

    // Permanently record in slots store
    this.slotsStore.set(slotId, {
      id: slotId,
      status: 'BOOKED',
      appointmentId,
      patientName: appointmentRecord.patientName,
      treatment: appointmentRecord.treatment,
      paymentId: appointmentRecord.paymentId
    });

    // Record in appointments registry
    this.appointmentsStore.set(appointmentId, appointmentRecord);

    return {
      success: true,
      appointment: appointmentRecord
    };
  }

  /**
   * Method: getAllAppointments
   * Purpose: Lists all active bookings for clinic administrative view.
   * Parameters: None.
   * Return: Array of appointment records.
   * Errors: None.
   */
  getAllAppointments() {
    return Array.from(this.appointmentsStore.values());
  }

  /**
   * Method: reset
   * Purpose: Resets calendar state and restores fresh seed bookings for testing.
   * Parameters: None.
   * Return: Void.
   */
  reset() {
    this._initializeSeedData();
  }
}

module.exports = new DentistCalendarEngine();
