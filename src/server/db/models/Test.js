import mongoose, { Schema } from 'mongoose';

const TestSchema = new Schema(
  {
    title:         { type: String, required: true, trim: true },
    type:          { type: String, enum: ['mcq', 'subjective', 'mock', 'chapter'], required: true },
    courseId:      { type: Schema.Types.ObjectId, ref: 'Course' },
    chapterId:     { type: Schema.Types.ObjectId, ref: 'Chapter' },
    duration:      { type: Number, required: true },
    totalMarks:    { type: Number, required: true },
    passingMarks:  { type: Number, default: 0 },
    isPublished:   { type: Boolean, default: false },
    startTime:     { type: Date },
    endTime:       { type: Date },
    instructions:  { type: String },
    negativeMarks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);
export default Test;
