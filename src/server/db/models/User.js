import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name:             { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:            { type: String, trim: true },
    password:         { type: String, required: true, select: false },
    role:             { type: String, enum: ['admin', 'student'], default: 'student' },
    profilePic:       { type: String },
    qualification:    { type: String, enum: ['10th', '12th', 'Graduate', 'Post-Graduate', 'Other'] },
    dob:              { type: Date },
    gender:           { type: String, enum: ['male', 'female', 'other'] },
    city:             { type: String, trim: true },
    state:            { type: String, trim: true },
    isActive:         { type: Boolean, default: true },
    isEmailVerified:  { type: Boolean, default: false },
    otpCode:          { type: String, select: false },
    otpExpiry:        { type: Date, select: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
