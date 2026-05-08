import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { HomepageContent } from '@/server/db/models/Other';

const DEFAULT_CONTENT = {
  heroBadgeText: 'New Batch Starting Soon',
  heroTitle: "BPSC with Bihar's Best Online Coaching",
  heroSubtitle: 'Expert faculty, structured video lectures, daily current affairs, and full-length mock tests — everything you need to clear BPSC.',
  heroCtaLabel: 'Register Now',
  heroBadge1: 'Free Trial Available',
  heroBadge2: 'Cancel Anytime',
  featuresTitle: 'Course Advantages',
  features: [
    { title: 'BPSC Specific Curriculum', desc: 'Syllabus designed exactly for BPSC Prelims, Mains & Interview stage.' },
    { title: 'Live + Recorded Classes',  desc: 'Attend live sessions or watch recordings at your own pace, anytime.' },
    { title: 'Daily Current Affairs',    desc: 'Daily updates curated by experts, in Hindi & English both.' },
    { title: 'Mock Tests & Analysis',    desc: 'Full-length mock tests with detailed performance analysis & rank.' },
    { title: 'Doubt Clearing Sessions',  desc: 'Regular doubt sessions with faculty to clear all your questions.' },
    { title: 'Study Material PDFs',      desc: 'Comprehensive notes and PDFs for every chapter and subject.' },
  ],
  testimonialsTitle: "Our Students' Success Stories",
  testimonials: [
    { name: 'Priya Singh',   rank: 'BPSC 69th Rank 42',  text: 'Goal Civil ka course bahut helpful tha. Video lectures aur mock tests ne mere confidence ko bahut badhaya.', city: 'Patna' },
    { name: 'Rahul Kumar',   rank: 'BPSC 68th Rank 87',  text: 'Daily current affairs aur live classes ne meri preparation ekdum change kar di. Highly recommended!', city: 'Muzaffarpur' },
    { name: 'Anjali Sharma', rank: 'BPSC 67th Rank 156', text: 'Online platform bahut smooth hai. Mobile pe bhi kaam karta hai. Faculty bahut experienced hai.', city: 'Gaya' },
  ],
  aboutTitle: 'About Goal Civil',
  aboutPara1: 'Goal Civil was founded in 2018 with a simple mission: to make world-class BPSC coaching accessible to every Bihar aspirant, regardless of their location or economic background.',
  aboutPara2: 'We believe talent is evenly distributed, but opportunity is not. Our platform bridges this gap by bringing expert faculty and structured content to every corner of Bihar — and beyond.',
  aboutBullets: [
    'Founded in 2018 in Patna, Bihar',
    'Trusted by 15,000+ BPSC aspirants',
    '500+ students selected till date',
    'Expert panel of 50+ faculty members',
  ],
  aboutStats: [
    { value: '2018', label: 'Year Founded',   color: 'from-blue-500 to-indigo-600' },
    { value: '15K+', label: 'Students',       color: 'from-green-500 to-emerald-600' },
    { value: '500+', label: 'Selections',     color: 'from-amber-500 to-orange-600' },
    { value: '50+',  label: 'Expert Faculty', color: 'from-violet-500 to-purple-600' },
  ],
  values: [
    { title: 'Excellence',    desc: 'We set the highest standards in BPSC preparation content and delivery.' },
    { title: 'Student First', desc: 'Every decision we make is centered around student success and well-being.' },
    { title: 'Accessibility', desc: 'Quality BPSC coaching should not be limited to those with big budgets.' },
    { title: 'Results',       desc: "We measure our success only by our students' selections in BPSC." },
  ],
  contactTitle:   'Contact Us',
  contactAddress: 'Fraser Road, Patna, Bihar 800001',
  contactPhone:   '+91 98765 43210',
  contactEmail:   'info@goalcivil.com',
  contactHours:   'Mon–Sat: 9 AM to 7 PM',
};

export async function GET() {
  try {
    await connectDB();
    let content = await HomepageContent.findOne().lean();
    if (!content) {
      content = await HomepageContent.create(DEFAULT_CONTENT);
      content = content.toObject();
    }
    return NextResponse.json({ content });
  } catch (err) {
    console.error('[homepage GET]', err);
    return NextResponse.json({ content: DEFAULT_CONTENT });
  }
}
