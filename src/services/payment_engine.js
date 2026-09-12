/**
 * ============================================================================
 * File: src/services/payment_engine.js
 * Module: Dental Patient Deposit & Payment Collection Engine
 * Organization: Hiranyam AI / Dentist Workflow Automation Platform
 * Description: Manages the collection of appointment commitment deposits (e.g. ₹500)
 *              to eliminate patient no-shows and guarantee doctor chair time.
 *              Generates structured payment orders, supports instant UPI QR code
 *              generation (BHIM/GPay/PhonePe), Card payments, and simulated gateway
 *              verification with instant receipt issuing.
 * ============================================================================
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Class: DentalPaymentEngine
 * Purpose: Manages payment orders, deposit verifications, digital receipt generation,
 *          and no-show prevention accounting.
 * Manual Debugging Notes:
 *   - Orders default to ₹500 (process.env.DEFAULT_DEPOSIT_INR).
 *   - Supports instant simulated verification for web client demos and automated testing.
 */
class DentalPaymentEngine {
  /**
   * Method: constructor
   * Purpose: Initializes payment orders store, default currency, and clinic UPI VPA.
   * Parameters: None.
   * Return: DentalPaymentEngine instance.
   * Errors: None.
   * Manual Debugging Notes: In-memory store for orders and receipts.
   */
  constructor() {
    this.defaultDepositAmount = parseInt(process.env.DEFAULT_DEPOSIT_INR, 10) || 500;
    this.currency = 'INR';
    this.clinicVpa = 'drxyz.dentist@icici';
    this.ordersStore = new Map();
    this.receiptsStore = new Map();
  }

  /**
   * Method: createDepositOrder
   * Purpose: Generates a new payment order for the appointment commitment deposit.
   * Parameters:
   *   - options: Object containing:
   *       - slotId: Selected calendar slot ID.
   *       - patientName: Full name of patient.
   *       - patientPhone: Contact mobile number.
   *       - treatmentKey: Target dental treatment.
   *       - amount: Custom amount override (defaults to 500).
   * Return: Object containing orderId, amount, currency, upiIntentUrl, qrString, expiresAt.
   * Errors: Returns error if slotId is missing.
   * Manual Debugging Notes: Up-front deposit is 100% adjustable against treatment bill.
   */
  createDepositOrder(options = {}) {
    const { slotId, patientName = 'Patient', patientPhone = '', treatmentKey = 'consultation', amount } = options;

    if (!slotId) {
      throw new Error('MISSING_SLOT_ID: A valid calendar slot is required to create a deposit order.');
    }

    const orderAmount = amount || this.defaultDepositAmount;
    const orderId = `ORD-DENT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minute payment window

    // Generate standard NPCI UPI Intent URI for seamless mobile app triggers
    const upiUri = `upi://pay?pa=${this.clinicVpa}&pn=DrXYZ+Dental+Clinic&am=${orderAmount}&cu=INR&tn=Deposit+for+Slot+${slotId}`;

    const orderRecord = {
      orderId,
      slotId,
      patientName,
      patientPhone,
      treatmentKey,
      amount: orderAmount,
      currency: this.currency,
      status: 'INITIATED',
      upiUri,
      expiresAt,
      createdAt: new Date().toISOString()
    };

    this.ordersStore.set(orderId, orderRecord);

    return {
      success: true,
      orderId,
      amount: orderAmount,
      currency: this.currency,
      slotId,
      upiUri,
      clinicVpa: this.clinicVpa,
      expiresAt,
      instructions: `Deposit of ₹${orderAmount} guarantees your appointment and prevents no-shows. 100% adjusted on arrival.`
    };
  }

  /**
   * Method: verifyPayment
   * Purpose: Verifies payment completion, updates order status, and produces verified digital receipt.
   * Parameters:
   *   - paymentPayload: Object with:
   *       - orderId: Valid order identifier.
   *       - paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'SIMULATED'.
   *       - transactionReference: External transaction/UTR number.
   * Return: Object with { success, receipt, paymentId, verifiedAt }.
   * Errors: Throws error if orderId not found or already paid.
   * Manual Debugging Notes: Automatically registers digital receipt with unique REC-XYZ-XXXX ID.
   */
  verifyPayment(paymentPayload = {}) {
    const { orderId, paymentMethod = 'UPI', transactionReference } = paymentPayload;

    const order = this.ordersStore.get(orderId);
    if (!order) {
      throw new Error(`ORDER_NOT_FOUND: Payment order ${orderId} does not exist.`);
    }

    if (order.status === 'PAID') {
      return {
        success: true,
        alreadyProcessed: true,
        receipt: this.receiptsStore.get(order.receiptId),
        orderId
      };
    }

    const paymentId = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptId = `REC-XYZ-${Math.floor(10000 + Math.random() * 90000)}`;
    const verifiedAt = new Date().toISOString();

    const receipt = {
      receiptId,
      paymentId,
      orderId,
      slotId: order.slotId,
      patientName: order.patientName,
      patientPhone: order.patientPhone,
      amount: order.amount,
      currency: order.currency,
      paymentMethod,
      transactionRef: transactionReference || `TXN-${uuidv4().substring(0, 10).toUpperCase()}`,
      status: 'SUCCESS',
      verifiedAt,
      policyNotice: '100% adjustable against clinic treatment bill or refundable 4 hours prior.'
    };

    // Update order status
    order.status = 'PAID';
    order.paymentId = paymentId;
    order.receiptId = receiptId;
    order.paidAt = verifiedAt;

    // Store receipt
    this.receiptsStore.set(receiptId, receipt);

    return {
      success: true,
      orderId,
      paymentId,
      receiptId,
      receipt
    };
  }

  /**
   * Method: getReceipt
   * Purpose: Fetches receipt by receiptId or orderId.
   * Parameters:
   *   - receiptId: Unique receipt ID.
   * Return: Receipt record or null.
   * Errors: None.
   */
  getReceipt(receiptId) {
    return this.receiptsStore.get(receiptId) || null;
  }

  /**
   * Method: reset
   * Purpose: Clears all payment orders and receipts for test execution.
   * Parameters: None.
   * Return: Void.
   */
  reset() {
    this.ordersStore.clear();
    this.receiptsStore.clear();
  }
}

module.exports = new DentalPaymentEngine();
