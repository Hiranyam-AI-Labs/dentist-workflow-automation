/**
 * ============================================================================
 * File: src/services/lead_scoring.js
 * Module: Dental Patient Lead Scoring & Qualification Engine
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: Implements quantitative patient lead qualification adapted from
 *              proven patterns in Hemkar Realty and BBNG Parivartan. Analyzes
 *              inbound campaign origin, clinical urgency, treatment specificity,
 *              appointment slot interest, and deposit readiness to compute a
 *              0-100 score with HOT, WARM, and COLD tiering.
 * ============================================================================
 */

/**
 * Class: DentalLeadScoringEngine
 * Purpose: Computes dynamic lead score and qualification tier for dental prospects.
 * Manual Debugging Notes:
 *   - Scores >= 70 are categorized as HOT (immediate conversion pipeline).
 *   - Scores 40-69 are WARM (nurturing and slot suggestion pipeline).
 *   - Scores < 40 are COLD (informational/awareness tier).
 */
class DentalLeadScoringEngine {
  /**
   * Method: scoreLead
   * Purpose: Aggregates scoring factors across the patient's interaction session.
   * Parameters:
   *   - session: Object tracking conversation context:
   *       - adCampaign: String or object representing source ad.
   *       - treatmentKey: Detected dental procedure.
   *       - messageCount: Number of conversational turns.
   *       - slotSelected: Boolean or selected slot object.
   *       - depositPaid: Boolean indicating if ₹500 booking fee is paid.
   *       - queryText: Latest user message text.
   *       - isEmergency: Boolean from triage gate.
   * Return: Object with { score, tier, qualificationSummary, conversionStage }.
   * Errors: Safe fallback with default scores on empty session data.
   * Manual Debugging Notes: P0 emergencies automatically boost score to 95 (HOT).
   */
  scoreLead(session = {}) {
    let score = 10; // Baseline score for initiating conversation
    const factors = [];

    // Factor 1: Campaign Ingress & Ad Association (+20 pts)
    if (session.adCampaign && session.adCampaign !== 'GENERAL_INTAKE') {
      score += 20;
      factors.push('Ad Campaign Ingress (+20)');
    }

    // Factor 2: High-Value Treatment Identification (+25 pts)
    const highValueTreatments = ['root_canal', 'dental_implants', 'clear_aligners', 'teeth_cleaning', 'tooth_extraction'];
    if (session.treatmentKey && highValueTreatments.includes(session.treatmentKey)) {
      score += 25;
      factors.push(`Identified Treatment: ${session.treatmentKey} (+25)`);
    }

    // Factor 3: Time Urgency or Immediate Visit Intent (+15 pts)
    const query = (session.queryText || '').toLowerCase();
    if (query.includes('today') || query.includes('tomorrow') || query.includes('urgent') || query.includes('asap') || query.includes('soon')) {
      score += 15;
      factors.push('Immediate Visit Intent (+15)');
    }

    // Factor 4: Conversational Engagement Depth (+10 pts)
    if (session.messageCount && session.messageCount >= 2) {
      score += 10;
      factors.push('Active Multi-turn Engagement (+10)');
    }

    // Factor 5: Appointment Slot Selection (+20 pts)
    if (session.slotSelected) {
      score += 20;
      factors.push('Calendar Slot Selected (+20)');
    }

    // Factor 6: Deposit Paid / Payment Verified (+40 pts & Guarantee HOT Paying Patient)
    if (session.depositPaid) {
      score = Math.max(score + 40, 90);
      factors.push('Booking Deposit Paid & Verified (+90 HOT Paying Patient)');
    }

    // Special Override: Acute Emergency is automatically HOT
    if (session.isEmergency) {
      score = Math.max(score, 95);
      factors.push('Clinical Emergency Override (+95)');
    }

    // Cap score at 100
    score = Math.min(100, score);

    // Determine Tier
    let tier = 'COLD';
    let conversionStage = 'INQUIRY';

    if (score >= 70) {
      tier = 'HOT';
      conversionStage = session.depositPaid ? 'APPOINTMENT_CONFIRMED' : (session.slotSelected ? 'PAYMENT_PENDING' : 'READY_TO_BOOK');
    } else if (score >= 40) {
      tier = 'WARM';
      conversionStage = 'SERVICE_SELECTION';
    } else {
      tier = 'COLD';
      conversionStage = 'INITIAL_GREETING';
    }

    return {
      score,
      tier,
      conversionStage,
      factors,
      qualificationSummary: `${tier} Patient Lead (Score: ${score}/100) — Stage: ${conversionStage}`
    };
  }
}

module.exports = new DentalLeadScoringEngine();
