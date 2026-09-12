/**
 * ============================================================================
 * File: src/services/triage_gate.js
 * Module: Dental Clinical Emergency Triage Gate
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: Clinical safety inspection gate that evaluates inbound patient
 *              complaints for life-threatening or acute dental emergencies.
 *              Detects high-risk symptoms (facial cellulitis, uncontrollable bleeding,
 *              severe dental trauma/fractures, locked jaw) and immediately elevates
 *              priority to P0_EMERGENCY with direct clinic hotline dispatch.
 * ============================================================================
 */

/**
 * Class: DentalTriageGate
 * Purpose: Evaluates patient symptom text against high-risk dental clinical indicators,
 *          classifying inquiries into P0_EMERGENCY (immediate attention) or P2_ROUTINE.
 * Manual Debugging Notes:
 *   - Any query containing facial swelling or bleeding is instantly routed to P0.
 *   - Generates emergency instructions (cold compress, upright posture, direct doctor phone).
 */
class DentalTriageGate {
  /**
   * Method: constructor
   * Purpose: Initializes clinical keywords, triage threshold rules, and hotline contact.
   * Parameters: None.
   * Return: DentalTriageGate instance.
   * Errors: None.
   * Manual Debugging Notes: Emergency hotline defaults to +91 98765 43219.
   */
  constructor() {
    // Red flag emergency indicators according to dental trauma and emergency protocols
    this.emergencyPatterns = [
      {
        type: 'FACIAL_SWELLING',
        keywords: ['swelling', 'swollen', 'swollen cheek', 'swollen face', 'eye swelling', 'jaw swollen', 'गाल सुजला', 'सूजन'],
        severity: 'HIGH',
        advice: 'Keep your head elevated and do NOT apply hot fomentation (use ice packs externally only).'
      },
      {
        type: 'ACUTE_TRAUMA',
        keywords: ['accident', 'broken tooth', 'knocked out', 'hit my face', 'fall down', 'fall', 'दात तुटला', 'दांत टूट गया'],
        severity: 'HIGH',
        advice: 'If the tooth was completely knocked out, place it gently in cold milk or saliva and bring it immediately within 60 minutes!'
      },
      {
        type: 'ACTIVE_BLEEDING',
        keywords: ['heavy bleeding', 'continuous bleeding', 'blood not stopping', 'gushing blood', 'रक्तस्त्राव', 'खून बह रहा है'],
        severity: 'HIGH',
        advice: 'Bite firmly on a clean, moist piece of cotton gauze for 30 minutes without spitting.'
      },
      {
        type: 'LOCKJAW_DYSPHAGIA',
        keywords: ['cannot open mouth', 'unable to open mouth', 'difficulty swallowing', 'difficulty breathing', 'lockjaw', 'जबड़ा बंद'],
        severity: 'CRITICAL',
        advice: 'Do not force your mouth open. Seek immediate emergency evaluation to prevent airway compromise.'
      },
      {
        type: 'UNBEARABLE_NOCTURNAL_PAIN',
        keywords: ['unbearable pain', 'cannot sleep', 'extreme pain', 'killing me', 'severe throbbing', 'असह्य वेदना', 'बहुत तेज दर्द'],
        severity: 'HIGH',
        advice: 'Rinse gently with warm salt water and avoid lying completely flat until you reach the clinic.'
      }
    ];

    this.emergencyHotline = process.env.CLINIC_EMERGENCY_PHONE || '+91 98765 43219';
    this.doctorName = 'Dr. XYZ';
  }

  /**
   * Method: evaluate
   * Purpose: Scans patient message for clinical red flags, calculates triage priority,
   *          and generates immediate emergency patient guidance.
   * Parameters:
   *   - queryText: Raw text submitted by the patient.
   * Return: Object containing:
   *       - isEmergency: Boolean (true if any emergency pattern matches).
   *       - priority: 'P0_EMERGENCY' or 'P2_ROUTINE'.
   *       - matchedTriggers: Array of matched emergency rule types.
   *       - emergencyNotice: Immediate formatted guidance string (or null).
   * Errors: None. Safe string handling with null-coalescing.
   * Manual Debugging Notes: Check 'matchedTriggers' array to identify specific symptoms detected.
   */
  evaluate(queryText) {
    const text = (queryText || '').toLowerCase().trim();
    const matchedTriggers = [];
    const guidancePoints = [];

    // Minute-level scan: check every emergency pattern
    for (const rule of this.emergencyPatterns) {
      for (const kw of rule.keywords) {
        if (text.includes(kw.toLowerCase())) {
          matchedTriggers.push(rule.type);
          guidancePoints.push(rule.advice);
          break; // Avoid duplicating same rule multiple times
        }
      }
    }

    const isEmergency = matchedTriggers.length > 0;

    if (isEmergency) {
      const uniqueAdvice = [...new Set(guidancePoints)].join(' ');
      const emergencyNotice = `🚨 URGENT CLINICAL DENTAL NOTICE:\nBased on your reported symptoms (${matchedTriggers.join(', ')}), this requires prompt clinical attention from Dr. XYZ.\n\nImmediate First-Aid Measures: ${uniqueAdvice}\n\n📞 Direct Doctor Hotline: ${this.emergencyHotline}\nPlease call immediately or select the emergency priority slot below for immediate chairside relief.`;

      return {
        isEmergency: true,
        priority: 'P0_EMERGENCY',
        matchedTriggers,
        emergencyNotice,
        suggestedActions: ['Call Emergency Hotline', 'Book Priority Emergency Slot', 'Directions to Clinic']
      };
    }

    return {
      isEmergency: false,
      priority: 'P2_ROUTINE',
      matchedTriggers: [],
      emergencyNotice: null,
      suggestedActions: []
    };
  }
}

module.exports = new DentalTriageGate();
