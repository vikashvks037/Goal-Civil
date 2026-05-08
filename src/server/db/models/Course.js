import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema(
  {
    title:          { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    description:    { type: String },
    shortDesc:      { type: String },
    thumbnail:      { type: String },
    price:          { type: Number, default: 0 },
    isFree:         { type: Boolean, default: false },
    isPublished:    { type: Boolean, default: false },
    category:       { type: String, trim: true },
    language:       { type: String, enum: ['Hindi', 'English'], default: 'Hindi' },
    totalDuration:  { type: Number, default: 0 },
    totalLectures:  { type: Number, default: 0 },
    rating:         { type: Number, default: 0 },
    enrolledCount:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
export default Course;
