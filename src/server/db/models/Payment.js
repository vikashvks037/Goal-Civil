import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema(
  {
    studentId:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId:          { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    amount:            { type: Number, required: true },
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status:            { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
    couponCode:        { type: String },
    discountAmount:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export default Payment;
