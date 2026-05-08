import mongoose, { Schema } from 'mongoose';

// CurrentAffairs
const CurrentAffairsSchema = new Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    content:     { type: String, required: true },
    category:    { type: String, trim: true },
    thumbnail:   { type: String },
    isPublished: { type: Boolean, default: false },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);
export const CurrentAffairs = mongoose.models.CurrentAffairs || mongoose.model('CurrentAffairs', CurrentAffairsSchema);

// LiveClass
const LiveClassSchema = new Schema(
  {
    title:        { type: String, required: true, trim: true },
    description:  { type: String },
    link:         { type: String, required: true },
    platform:     { type: String, enum: ['youtube', 'zoom', 'meet', 'other'], default: 'youtube' },
    courseId:     { type: Schema.Types.ObjectId, ref: 'Course' },
    scheduledAt:  { type: Date, required: true },
    duration:     { type: Number },
    status:       { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
    recordingUrl: { type: String },
  },
  { timestamps: true }
);
export const LiveClass = mongoose.models.LiveClass || mongoose.model('LiveClass', LiveClassSchema);

// Coupon
const CouponSchema = new Schema(
  {
    code:         { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percent', 'flat'], required: true },
    discount:     { type: Number, required: true },
    maxUses:      { type: Number, default: 100 },
    usedCount:    { type: Number, default: 0 },
    courseId:     { type: Schema.Types.ObjectId, ref: 'Course' },
    expiresAt:    { type: Date },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

// Notice
const NoticeSchema = new Schema(
  {
    title:     { type: String, required: true, trim: true },
    content:   { type: String, required: true },
    audience:  { type: String, enum: ['all', 'admin', 'student'], default: 'all' },
    isActive:  { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
export const Notice = mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);

// Settings
const SettingsSchema = new Schema(
  {
    siteName:   { type: String, default: 'Goal Civil' },
    logo:       { type: String },
    email:      { type: String },
    phone:      { type: String },
    address:    { type: String },
    facebook:   { type: String },
    twitter:    { type: String },
    youtube:    { type: String },
    instagram:  { type: String },
    bannerText: { type: String },
  },
  { timestamps: true }
);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

// HomepageContent
const HomepageContentSchema = new Schema(
  {
    // Hero Section
    heroBadgeText: { type: String, default: 'New Batch Starting Soon' },
    heroTitle:     { type: String, default: "BPSC with Bihar's Best Online Coaching" },
    heroSubtitle:  { type: String, default: 'Expert faculty, structured video lectures, daily current affairs, and full-length mock tests — everything you need to clear BPSC.' },
    heroCtaLabel:  { type: String, default: 'Register Now' },
    heroBadge1:    { type: String, default: 'Free Trial Available' },
    heroBadge2:    { type: String, default: 'Cancel Anytime' },

    // Features Section
    featuresTitle: { type: String, default: 'Course Advantages' },
    features: [{ title: { type: String }, desc: { type: String } }],

    // Testimonials
    testimonialsTitle: { type: String, default: "Our Students' Success Stories" },
    testimonials: [{ name: String, rank: String, text: String, city: String }],

    // About Section
    aboutTitle:   { type: String, default: 'About Goal Civil' },
    aboutPara1:   { type: String, default: 'Goal Civil was founded in 2018 with a simple mission: to make world-class BPSC coaching accessible to every Bihar aspirant, regardless of their location or economic background.' },
    aboutPara2:   { type: String, default: 'We believe talent is evenly distributed, but opportunity is not. Our platform bridges this gap by bringing expert faculty and structured content to every corner of Bihar — and beyond.' },
    aboutBullets: [{ type: String }],
    aboutStats:   [{ value: String, label: String, color: String }],
    values:       [{ title: String, desc: String }],

    // Contact Section
    contactTitle:   { type: String, default: 'Contact Us' },
    contactAddress: { type: String, default: 'Fraser Road, Patna, Bihar 800001' },
    contactPhone:   { type: String, default: '+91 98765 43210' },
    contactEmail:   { type: String, default: 'info@goalcivil.com' },
    contactHours:   { type: String, default: 'Mon–Sat: 9 AM to 7 PM' },
  },
  { timestamps: true }
);
export const HomepageContent = mongoose.models.HomepageContent || mongoose.model('HomepageContent', HomepageContentSchema);
