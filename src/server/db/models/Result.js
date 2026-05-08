import mongoose, { Schema } from 'mongoose';

const ResultSchema = new Schema(
  {
    studentId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    testId:     { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    score:      { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    rank:       { type: Number },
    timeTaken:  { type: Number, required: true },
    answers: [
      {
        questionId:  { type: Schema.Types.ObjectId, ref: 'Question' },
        selected:    { type: Number, default: null },
        isCorrect:   { type: Boolean, default: false },
        marksEarned: { type: Number, default: 0 },
      },
    ],
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);
export default Result;
