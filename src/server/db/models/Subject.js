import mongoose, { Schema } from 'mongoose';

const SubjectSchema = new Schema(
  {
    title:       { type: String, required: true, trim: true },
    courseId:    { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    description: { type: String },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
export default Subject;
