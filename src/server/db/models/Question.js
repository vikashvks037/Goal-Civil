import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema(
  {
    testId:        { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    text:          { type: String, required: true },
    type:          { type: String, enum: ['mcq', 'subjective'], required: true },
    options:       [{ type: String }],
    correctAnswer: { type: Number },
    explanation:   { type: String },
    marks:         { type: Number, default: 1 },
    difficulty:    { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    order:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
export default Question;
