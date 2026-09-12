/**
 * ============================================================================
 * File: src/services/channel_adapters.js
 * Module: Decoupled Multi-Channel Adapter Layer (Web & WhatsApp)
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: Architectural abstraction decoupling the dental intelligence core
 *              from presentation channels. Provides a rich WebChannelAdapter for
 *              immediate web pilots and demos, and a Meta Graph API v21.0 compliant
 *              WhatsAppChannelAdapter interface for seamless post-onboarding transition
 *              without rewriting core logic.
 * ============================================================================
 */

/**
 * Interface / Base Class: BaseChannelAdapter
 * Purpose: Defines contract required by all communication channels (Web, WhatsApp, SMS).
 */
class BaseChannelAdapter {
  parseInbound(rawPayload) {
    throw new Error('METHOD_NOT_IMPLEMENTED: parseInbound must be implemented by adapter.');
  }

  formatOutbound(unifiedResponse) {
    throw new Error('METHOD_NOT_IMPLEMENTED: formatOutbound must be implemented by adapter.');
  }
}

/**
 * Class: WebChannelAdapter
 * Purpose: Adapts web chat frontend interactions, rendering markdown, interactive chips,
 *          embedded calendar slot pickers, and checkout triggers.
 * Manual Debugging Notes:
 *   - Unified payload contains text, actionButtons, slotPickerData, paymentData.
 */
class WebChannelAdapter extends BaseChannelAdapter {
  /**
   * Method: parseInbound
   * Purpose: Standardizes incoming HTTP payload from the web chat frontend.
   * Parameters:
   *   - body: Express request body { message, sessionId, adCampaign, patientDetails }.
   * Return: Unified inbound event object.
   * Errors: None.
   */
  parseInbound(body = {}) {
    return {
      channel: 'web',
      sessionId: body.sessionId || `SESSION-${Date.now()}`,
      userId: body.sessionId || 'anonymous-web-user',
      queryText: (body.message || '').trim(),
      buttonPayload: body.buttonPayload || null,
      adCampaign: body.adCampaign || 'GENERAL_INTAKE',
      patientDetails: {
        name: body.patientName || 'Valued Patient',
        phone: body.patientPhone || '',
        email: body.patientEmail || ''
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Method: formatOutbound
   * Purpose: Formats the workflow engine's response into a rich web client envelope.
   * Parameters:
   *   - unifiedResponse: Internal response object from workflow orchestrator.
   * Return: Web-optimized JSON payload.
   * Errors: None.
   */
  formatOutbound(unifiedResponse) {
    return {
      channel: 'web',
      sessionId: unifiedResponse.sessionId,
      replyText: unifiedResponse.text,
      quickReplies: unifiedResponse.suggestedActions || [],
      leadStatus: unifiedResponse.leadScore || null,
      isEmergency: unifiedResponse.isEmergency || false,
      slotPicker: unifiedResponse.slotPicker || null,
      paymentCheckout: unifiedResponse.paymentCheckout || null,
      appointmentConfirmation: unifiedResponse.appointmentConfirmation || null,
      telemetry: unifiedResponse.telemetry || null,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Class: WhatsAppChannelAdapter
 * Purpose: Prepared adapter matching Meta Graph API v21.0 Cloud API specifications.
 *          Formats interactive buttons, list pickers, and payment messages.
 * Manual Debugging Notes:
 *   - Ready for activation when clinic onboards their phone number to Meta Business Manager.
 */
class WhatsAppChannelAdapter extends BaseChannelAdapter {
  /**
   * Method: parseInbound
   * Purpose: Parses Meta Graph API v21.0 incoming webhook payload.
   * Parameters:
   *   - webhookPayload: Meta Cloud API webhook body.
   * Return: Unified inbound event object.
   * Errors: Safely handles empty or non-message webhook events.
   */
  parseInbound(webhookPayload = {}) {
    const entry = webhookPayload.entry && webhookPayload.entry[0];
    const changes = entry && entry.changes && entry.changes[0];
    const value = changes && changes.value;
    const message = value && value.messages && value.messages[0];

    if (!message) {
      return { channel: 'whatsapp', isValid: false };
    }

    const contact = value.contacts && value.contacts[0];
    let queryText = '';
    let buttonPayload = null;

    if (message.type === 'text') {
      queryText = message.text.body;
    } else if (message.type === 'interactive') {
      if (message.interactive.type === 'button_reply') {
        queryText = message.interactive.button_reply.title;
        buttonPayload = message.interactive.button_reply.id;
      } else if (message.interactive.type === 'list_reply') {
        queryText = message.interactive.list_reply.title;
        buttonPayload = message.interactive.list_reply.id;
      }
    }

    return {
      channel: 'whatsapp',
      sessionId: `WA-${message.from}`,
      userId: message.from,
      queryText,
      buttonPayload,
      patientDetails: {
        name: contact ? contact.profile.name : 'WhatsApp Patient',
        phone: `+${message.from}`,
        email: ''
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Method: formatOutbound
   * Purpose: Formats unified orchestrator response into Meta Cloud API v21.0 JSON payloads.
   * Parameters:
   *   - unifiedResponse: Unified engine response.
   * Return: Meta Graph API v21.0 compatible message body.
   * Errors: None.
   */
  formatOutbound(unifiedResponse) {
    const recipientPhone = (unifiedResponse.userId || '').replace(/\D/g, '');

    // Case 1: Simple Quick Reply Buttons
    if (unifiedResponse.suggestedActions && unifiedResponse.suggestedActions.length > 0 && unifiedResponse.suggestedActions.length <= 3) {
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: unifiedResponse.text },
          action: {
            buttons: unifiedResponse.suggestedActions.map((action, idx) => ({
              type: 'reply',
              reply: {
                id: `BTN_${idx}_${action.replace(/\s+/g, '_').toUpperCase()}`,
                title: action.substring(0, 20)
              }
            }))
          }
        }
      };
    }

    // Default Case: Standard formatted text message
    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipientPhone,
      type: 'text',
      text: {
        preview_url: false,
        body: unifiedResponse.text
      }
    };
  }
}

module.exports = {
  webAdapter: new WebChannelAdapter(),
  whatsappAdapter: new WhatsAppChannelAdapter()
};
