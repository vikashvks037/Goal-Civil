import mongoose, { Schema } from 'mongoose';

const ContentSchema = new Schema(
  {
    title:        { type: String, required: true, trim: true },
    type:         { type: String, enum: ['video', 'pdf', 'live'], required: true },
    url:          { type: String },
    cloudinaryId: { type: String },
    chapterId:    { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
    duration:     { type: Number },
    isFree:       { type: Boolean, default: false },
    order:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);
export default Content;
