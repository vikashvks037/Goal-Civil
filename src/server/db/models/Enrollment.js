import mongoose, { Schema } from 'mongoose';

const EnrollmentSchema = new Schema(
  {
    studentId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId:   { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    paymentId:  { type: Schema.Types.ObjectId, ref: 'Payment' },
    status:     { type: String, enum: ['active', 'expired', 'refunded'], default: 'active' },
    enrolledAt: { type: Date, default: Date.now },
    expiresAt:  { type: Date },
    progress:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
export default Enrollment;
