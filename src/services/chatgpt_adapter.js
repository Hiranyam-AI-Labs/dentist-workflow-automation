/**
 * ============================================================================
 * File: src/services/chatgpt_adapter.js
 * Module: ChatGPT LLM Client Adapter for Dental Clinic Intelligence
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: High-reliability OpenAI ChatGPT adapter interfacing with gpt-4o-mini
 *              (with gpt-4o escalation support). Responsible for conversational
 *              understanding of patient dental symptoms, addressing clinical fears,
 *              handling price/deposit objections, and executing lead qualification.
 *              Includes deterministic mock engine, token accounting, and live USD/INR
 *              forex cost calculations.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

/**
 * Class: ChatGPTClientAdapter
 * Purpose: Manages communication with OpenAI Chat Completions API with fallback,
 *          structured parsing, token usage metrics, and real-time INR cost calculation.
 * Manual Debugging Notes:
 *   - If OPENAI_API_KEY is unset or starts with 'MOCK_', runs in deterministic offline mode.
 *   - Live USD/INR rate is cached for 10 minutes to prevent rate-limit blocks from forex APIs.
 */
class ChatGPTClientAdapter {
  /**
   * Method: constructor
   * Purpose: Initializes API keys, default model configurations, and forex cache.
   * Parameters: None.
   * Return: ChatGPTClientAdapter instance.
   * Errors: Logs notice when running in deterministic mock mode.
   * Manual Debugging Notes: Set process.env.OPENAI_API_KEY in .env before live runs.
   */
  constructor() {
    // Read API key from environment with fallback to mock
    this.apiKey = process.env.OPENAI_API_KEY || 'MOCK_OPENAI_KEY';
    
    // Default model: gpt-4o-mini offers exceptional dental reasoning at minimal token cost
    this.defaultModel = process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini';
    
    // Escalation model: used for complex multidisciplinary surgical inquiries
    this.escalationModel = process.env.OPENAI_ESCALATION_MODEL || 'gpt-4o';
    
    // Temperature configured low for consistent, grounded medical and booking information
    this.temperature = 0.3;
    
    // Cache for currency conversion to avoid hammering forex API on every chat request
    this.forexCache = {
      rate: 84.50, // Standard fallback exchange rate: 1 USD = 84.50 INR
      lastFetched: Date.now()
    };
  }

  /**
   * Method: getLiveInrRate
   * Purpose: Retrieves live USD to INR exchange rate with a 10-minute cache window.
   * Parameters: None.
   * Return: Promise<Number> representing current INR per 1 USD.
   * Errors: Catches network errors and safely falls back to last known cached rate.
   * Manual Debugging Notes: Queries open.er-api.com standard rate endpoint.
   */
  async getLiveInrRate() {
    const tenMinutesMs = 10 * 60 * 1000;
    const isCacheExpired = (Date.now() - this.forexCache.lastFetched) > tenMinutesMs;

    // Minute-level check: only refresh if cache is expired
    if (!isCacheExpired) {
      return this.forexCache.rate;
    }

    try {
      if (typeof fetch !== 'undefined') {
        const response = await fetch('https://open.er-api.com/v6/latest/USD', {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3000) // 3 second timeout guard
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.rates && data.rates.INR) {
            this.forexCache.rate = parseFloat(data.rates.INR);
            this.forexCache.lastFetched = Date.now();
          }
        }
      }
    } catch (error) {
      // Graceful degradation: continue with last cached rate on network failure
    }

    return this.forexCache.rate;
  }

  /**
   * Method: calculateCost
   * Purpose: Computes exact cost in USD and INR for prompt and completion tokens.
   * Parameters:
   *   - promptTokens: Number of input prompt tokens.
   *   - completionTokens: Number of generated tokens.
   *   - model: OpenAI model identifier.
   * Return: Promise<Object> containing { usdCost, inrCost, inrRate }.
   * Errors: None.
   * Manual Debugging Notes: Uses gpt-4o-mini rates ($0.15/1M input, $0.60/1M output).
   */
  async calculateCost(promptTokens, completionTokens, model = 'gpt-4o-mini') {
    const rate = await this.getLiveInrRate();

    // Rates based on OpenAI pricing per million tokens
    let promptRate = 0.00000015; // $0.15 per 1,000,000 prompt tokens
    let completionRate = 0.00000060; // $0.60 per 1,000,000 completion tokens

    if (model === 'gpt-4o') {
      promptRate = 0.00000250; // $2.50 per 1,000,000 prompt tokens
      completionRate = 0.00001000; // $10.00 per 1,000,000 completion tokens
    }

    const usdCost = (promptTokens * promptRate) + (completionTokens * completionRate);
    const inrCost = usdCost * rate;

    return {
      usdCost: parseFloat(usdCost.toFixed(6)),
      inrCost: parseFloat(inrCost.toFixed(4)),
      inrRate: rate
    };
  }

  /**
   * Method: generateResponse
   * Purpose: Orchestrates AI inference for patient inquiry, parses structured output,
   *          applies dental empathy guardrails, and records telemetry.
   * Parameters:
   *   - options: Object containing:
   *       - systemPrompt: Base persona and clinical instructions.
   *       - userMessage: Raw query entered by the patient.
   *       - conversationHistory: Array of previous turn messages.
   *       - adContext: Ingress ad campaign details (offer, treatment, price).
   *       - model: Optional model override string.
   * Return: Promise<Object> containing { reply, intent, suggestedActions, telemetry }.
   * Errors: Catches OpenAI API timeouts or JSON failures, gracefully invokes deterministic fallback.
   * Manual Debugging Notes: Check returned object for 'engine' field ('openai-live' vs 'deterministic-mock').
   */
  async generateResponse({
    systemPrompt,
    userMessage,
    conversationHistory = [],
    adContext = null,
    model = this.defaultModel
  }) {
    const startTime = Date.now();
    const isMock = !this.apiKey || this.apiKey === 'MOCK_OPENAI_KEY' || this.apiKey.startsWith('MOCK_') || process.env.NODE_ENV === 'test';

    // Estimate input tokens for telemetry
    const estimatedPromptTokens = Math.max(150, Math.ceil((systemPrompt.length + userMessage.length) / 4));

    if (isMock) {
      // Execute high-accuracy deterministic dental intelligence engine
      const mockResult = this._generateDeterministicDentalResponse(userMessage, adContext);
      const estimatedCompletionTokens = Math.max(80, Math.ceil(mockResult.reply.length / 4));
      const costMetrics = await this.calculateCost(estimatedPromptTokens, estimatedCompletionTokens, model);

      return {
        reply: mockResult.reply,
        intent: mockResult.intent,
        detectedTreatment: mockResult.detectedTreatment,
        suggestedActions: mockResult.suggestedActions,
        isQualifiedLead: mockResult.isQualifiedLead,
        telemetry: {
          engine: 'deterministic-dental-ai-mock',
          model,
          prompt_tokens: estimatedPromptTokens,
          completion_tokens: estimatedCompletionTokens,
          total_tokens: estimatedPromptTokens + estimatedCompletionTokens,
          usd_cost: costMetrics.usdCost,
          inr_cost: costMetrics.inrCost,
          latency_ms: Date.now() - startTime
        }
      };
    }

    // Live OpenAI Chat Completions API invocation
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(item => ({
          role: item.sender === 'user' ? 'user' : 'assistant',
          content: item.text
        })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: this.temperature,
          max_tokens: 500,
          response_format: { type: 'json_object' }
        }),
        signal: AbortSignal.timeout(12000) // 12 second network timeout
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const choice = data.choices && data.choices[0];
      const parsedContent = JSON.parse(choice.message.content);

      const promptTokens = data.usage ? data.usage.prompt_tokens : estimatedPromptTokens;
      const completionTokens = data.usage ? data.usage.completion_tokens : 100;
      const costMetrics = await this.calculateCost(promptTokens, completionTokens, model);

      return {
        reply: parsedContent.reply || 'Thank you for reaching out to Dr. XYZ Dental Care.',
        intent: parsedContent.intent || 'GENERAL_INQUIRY',
        detectedTreatment: parsedContent.detected_treatment || null,
        suggestedActions: parsedContent.suggested_actions || ['Book Appointment', 'Ask a Question'],
        isQualifiedLead: parsedContent.is_qualified_lead || false,
        telemetry: {
          engine: 'openai-chatgpt-live',
          model: data.model || model,
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
          usd_cost: costMetrics.usdCost,
          inr_cost: costMetrics.inrCost,
          latency_ms: Date.now() - startTime
        }
      };
    } catch (error) {
      // In case of API failure, seamlessly degrade to deterministic dental knowledge
      const mockResult = this._generateDeterministicDentalResponse(userMessage, adContext);
      const costMetrics = await this.calculateCost(estimatedPromptTokens, 80, model);

      return {
        reply: mockResult.reply,
        intent: mockResult.intent,
        detectedTreatment: mockResult.detectedTreatment,
        suggestedActions: mockResult.suggestedActions,
        isQualifiedLead: mockResult.isQualifiedLead,
        telemetry: {
          engine: 'fallback-deterministic-mock',
          model,
          prompt_tokens: estimatedPromptTokens,
          completion_tokens: 80,
          total_tokens: estimatedPromptTokens + 80,
          usd_cost: costMetrics.usdCost,
          inr_cost: costMetrics.inrCost,
          latency_ms: Date.now() - startTime,
          error_note: error.message
        }
      };
    }
  }

  /**
   * Method: _generateDeterministicDentalResponse
   * Purpose: Internal deterministic rule and knowledge synthesis engine for offline
   *          demonstrations, unit testing, and OpenAI API fallback scenarios.
   * Parameters:
   *   - query: User query string.
   *   - adContext: Optional active ad campaign context object.
   * Return: Object with { reply, intent, detectedTreatment, suggestedActions, isQualifiedLead }.
   * Errors: None.
   * Manual Debugging Notes: Contains clinical mappings for cleaning, RCT, implants, extractions, etc.
   */
  _generateDeterministicDentalResponse(query, adContext) {
    const q = (query || '').toLowerCase().trim();

    // 1. Pain / Fear Objection Handling
    if (q.includes('pain') || q.includes('hurt') || q.includes('afraid') || q.includes('scared') || q.includes('fear')) {
      return {
        intent: 'OBJECTION_PAIN_FEAR',
        detectedTreatment: adContext ? adContext.service_key : null,
        reply: "We completely understand your concern! At Dr. XYZ Multispeciality Dental Clinic, our priority is 100% pain-free treatment. We use computerized local anesthesia and ultra-gentle rotary techniques so you will barely feel a mosquito bite. Over 98% of our patients report zero discomfort during procedures. Would you like to consult Dr. XYZ for an initial painless evaluation?",
        suggestedActions: ['Check Available Slots', 'Ask About Anesthesia', 'Book Consultation'],
        isQualifiedLead: true
      };
    }

    // 2. Price / Cost / Fee / EMI Inquiries
    if (q.includes('cost') || q.includes('price') || q.includes('fee') || q.includes('charge') || q.includes('emi') || q.includes('rate') || q.includes('discount')) {
      let pricingReply = "At Dr. XYZ Dental Care, we maintain 100% transparent pricing with zero surprise charges. Our standard comprehensive consultation is ₹800 (with digital RVG X-ray included).";
      
      if (adContext && adContext.offer_price) {
        pricingReply = `Your social media promo discount is active! You are eligible for our promotional rate of ₹${adContext.offer_price} (Regular: ₹${adContext.regular_price}). For extensive treatments, we also provide 0% interest EMI options starting at ₹2,999/month.`;
      }

      return {
        intent: 'INQUIRY_PRICING',
        detectedTreatment: adContext ? adContext.service_key : null,
        reply: `${pricingReply}\n\nTo lock in this promotional rate, would you like to view Dr. XYZ's open appointment slots?`,
        suggestedActions: ['View Available Slots', 'Check Payment Options', 'Talk to Clinic'],
        isQualifiedLead: true
      };
    }

    // 3. Teeth Cleaning / Scaling Inquiries
    if (q.includes('clean') || q.includes('scaling') || q.includes('polish') || q.includes('yellow') || q.includes('tartar') || q.includes('stain')) {
      return {
        intent: 'INQUIRY_TEETH_CLEANING',
        detectedTreatment: 'teeth_cleaning',
        reply: "Our Ultrasonic Scaling and Air-Flow Polishing removes tough plaque, tartar, tobacco, and tea/coffee stains in a quick 30-minute session without weakening enamel. Your teeth will feel refreshed and look noticeably brighter! With our active promotional offer, it is only ₹499 (50% off regular ₹1,500). Shall I show you available time slots for today or tomorrow?",
        suggestedActions: ['Book ₹499 Cleaning Slot', 'Is Cleaning Painful?', 'Clinic Timings'],
        isQualifiedLead: true
      };
    }

    // 4. Root Canal Treatment (RCT) Inquiries
    if (q.includes('root canal') || q.includes('rct') || q.includes('cavity') || q.includes('tooth decay') || q.includes('nerve') || q.includes('infection')) {
      return {
        intent: 'INQUIRY_ROOT_CANAL',
        detectedTreatment: 'root_canal',
        reply: "Dr. XYZ specializes in Pain-Free Single Sitting Root Canal Treatments (RCT) using high-precision rotary instruments. It permanently eliminates infection while preserving your natural tooth. The procedure takes only 45 minutes under gentle local anesthesia. Promotional RCT packages start at ₹3,500 including digital X-rays. Would you like to schedule a slot to relieve the pain?",
        suggestedActions: ['Book RCT Evaluation', 'How Long Does RCT Take?', 'Check Available Slots'],
        isQualifiedLead: true
      };
    }

    // 5. Dental Implants Inquiries
    if (q.includes('implant') || q.includes('missing tooth') || q.includes('missing teeth') || q.includes('fixed teeth') || q.includes('denture')) {
      return {
        intent: 'INQUIRY_DENTAL_IMPLANTS',
        detectedTreatment: 'dental_implants',
        reply: "Dental Implants are the gold-standard, permanent solution for missing teeth that look, feel, and function just like your natural teeth with full biting strength. Dr. XYZ uses US-FDA and CE certified German/Swiss titanium fixtures with a lifetime warranty. Our promo includes a Free 3D Digital Scan & Consultation. Would you like to schedule an implant consultation with Dr. XYZ?",
        suggestedActions: ['Book Implant Consult', 'Implant Cost & Warranty', 'View Available Slots'],
        isQualifiedLead: true
      };
    }

    // 6. Dental X-Rays / Diagnostics
    if (q.includes('x-ray') || q.includes('xray') || q.includes('rvg') || q.includes('opg') || q.includes('scan')) {
      return {
        intent: 'INQUIRY_DENTAL_XRAY',
        detectedTreatment: 'dental_xray',
        reply: "Our clinic is equipped with instant High-Definition Digital RVG and Panoramic OPG X-ray systems with 90% reduced radiation compared to conventional film. Results appear chairside within seconds for immediate diagnosis. Our digital X-ray package is only ₹299 today. When would you prefer to visit?",
        suggestedActions: ['Book X-Ray Slot', 'Clinic Location', 'Doctor Availability'],
        isQualifiedLead: true
      };
    }

    // 7. Tooth Extraction / Wisdom Tooth Inquiries
    if (q.includes('extract') || q.includes('wisdom') || q.includes('remove tooth') || q.includes('pull out')) {
      return {
        intent: 'INQUIRY_EXTRACTION',
        detectedTreatment: 'tooth_extraction',
        reply: "Dr. XYZ performs atraumatic, gentle tooth extractions and surgical wisdom tooth removals with profound anesthesia to ensure zero sensation during the procedure. We provide full post-extraction care instructions and medication. Simple extractions start from ₹1,500. Shall we check Dr. XYZ's next available slot?",
        suggestedActions: ['Schedule Extraction Visit', 'Is Extraction Painful?', 'View Timings'],
        isQualifiedLead: true
      };
    }

    // 8. Cosmetic Dentistry / Aligners / Whitening Inquiries
    if (q.includes('whitening') || q.includes('aligner') || q.includes('invisalign') || q.includes('braces') || q.includes('cosmetic') || q.includes('crooked') || q.includes('smile')) {
      return {
        intent: 'INQUIRY_COSMETIC_ALIGNERS',
        detectedTreatment: 'clear_aligners',
        reply: "We offer complete Digital Smile Designing, including Laser Teeth Whitening (up to 8 shades lighter in 45 mins) and Invisible Wire-Free Clear Aligners with zero dietary restrictions. 0% EMI financing is available from ₹2,999/month. Dr. XYZ can generate a 3D digital simulation of your new smile during your consult. Would you like to book a 3D scan?",
        suggestedActions: ['Book 3D Smile Scan', 'Aligners Pricing', 'Check Slots'],
        isQualifiedLead: true
      };
    }

    // 9. Deposit & Booking Questions
    if (q.includes('deposit') || q.includes('advance') || q.includes('booking fee') || q.includes('refundable')) {
      return {
        intent: 'INQUIRY_DEPOSIT_POLICY',
        detectedTreatment: adContext ? adContext.service_key : null,
        reply: "Great question! The ₹500 booking deposit is strictly to guarantee Dr. XYZ's dedicated chair time and eliminate waiting room delays. The entire ₹500 is 100% adjusted toward your clinic bill when you arrive. If you need to reschedule or cancel with at least 4 hours notice, it is fully refundable.",
        suggestedActions: ['View Available Slots', 'Pay Deposit & Book', 'Clinic Timings'],
        isQualifiedLead: true
      };
    }

    // 10. Booking Intent / Slot Check
    if (q.includes('book') || q.includes('schedule') || q.includes('slot') || q.includes('appointment') || q.includes('time') || q.includes('today') || q.includes('tomorrow')) {
      return {
        intent: 'INTENT_SCHEDULE_BOOKING',
        detectedTreatment: adContext ? adContext.service_key : 'general_consultation',
        reply: "I would be happy to help you schedule your appointment with Dr. XYZ! Our clinic is open Monday to Saturday (09:30 AM - 01:30 PM and 04:30 PM - 08:30 PM) and Sunday mornings. Let me pull up real-time available slots for you right now.",
        suggestedActions: ['View Available Slots', 'Morning Slots', 'Evening Slots'],
        isQualifiedLead: true
      };
    }

    // Default Fallback / Ad Hook Continuation
    const treatmentName = adContext ? adContext.headline : 'Comprehensive Dental Care';
    return {
      intent: 'GENERAL_INQUIRY',
      detectedTreatment: adContext ? adContext.service_key : 'general_consultation',
      reply: `Thank you for reaching out! You're connected with Dr. XYZ Multispeciality Dental & Implant Clinic in Bandra West. Whether you are interested in our current special on ${treatmentName}, need a quick checkup, or have a specific dental concern, I am here to help. What symptoms are you experiencing or what treatment would you like to explore?`,
      suggestedActions: ['Check Available Slots', 'Teeth Cleaning Offer', 'Toothache Relief', 'Clinic Location'],
      isQualifiedLead: false
    };
  }
}

module.exports = new ChatGPTClientAdapter();
