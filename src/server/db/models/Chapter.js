import mongoose, { Schema } from 'mongoose';

const ChapterSchema = new Schema(
  {
    title:       { type: String, required: true, trim: true },
    subjectId:   { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    description: { type: String },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
export default Chapter;
