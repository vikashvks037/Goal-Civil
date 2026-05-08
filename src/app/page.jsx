import { ENDPOINTS, ROUTES } from '@/constants';
import Link from 'next/link';
import PublicHeader from '@/shared/layout/PublicHeader';
import {
  BookOpen, Users, Trophy, Star, CheckCircle, ArrowRight,
  GraduationCap, Target, Mail, Phone, MapPin, Clock,
  Youtube, Facebook, Instagram, Heart,
} from 'lucide-react';
import ContactForm from '@/shared/components/ContactForm';
import { CourseCard, CourseCarousel } from '@/shared/components';
import PageFooter from '@/shared/components/PageFooter';

const PLACEHOLDER_COURSES = [
  { _id: 'p1', title: 'BPSC Prelims Complete', slug: 'bpsc-prelims', shortDesc: 'Complete course for BPSC 70th Prelims — GS Paper 1 & 2', price: 2999, isFree: false, tag: 'Most Popular' },
  { _id: 'p2', title: 'BPSC Mains Full Course', slug: 'bpsc-mains', shortDesc: 'In-depth coverage of all Mains papers with answer writing', price: 4999, isFree: false, tag: 'Bestseller' },
  { _id: 'p3', title: 'Current Affairs Batch', slug: 'current-affairs', shortDesc: 'Daily current affairs with monthly compiled PDFs', price: 499, isFree: false, tag: 'New' },
];

const VALUE_ICONS = {
  'Excellence':    <Target size={22} />,
  'Student First': <Heart size={22} />,
  'Accessibility': <BookOpen size={22} />,
  'Results':       <Trophy size={22} />,
};

async function getFeaturedCourses() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}${ENDPOINTS.COURSES.LIST}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return (data.courses || []).slice(0, 3);
  } catch { return []; }
}

async function getHomepageContent() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${base}${ENDPOINTS.HOMEPAGE}`, { next: { revalidate: 600 } });
    const data = await res.json();
    return data.content || null;
  } catch { return null; }
}

export default async function HomePage() {
  const [courses, hp] = await Promise.all([getFeaturedCourses(), getHomepageContent()]);

  const heroBadgeText = hp?.heroBadgeText || 'New Batch Starting Soon';
  const heroTitle     = hp?.heroTitle     || "BPSC with Bihar's Best Online Coaching";
  const heroSubtitle  = hp?.heroSubtitle  || 'Expert faculty, structured video lectures, daily current affairs, and full-length mock tests — everything you need to clear BPSC.';
  const heroCtaLabel  = hp?.heroCtaLabel  || 'Register Now';
  const heroBadge1    = hp?.heroBadge1    || 'Free Trial Available';
  const heroBadge2    = hp?.heroBadge2    || 'Cancel Anytime';

  const featuresTitle = hp?.featuresTitle || 'Course Advantages';
  const features = hp?.features?.length ? hp.features : [
    { title: 'BPSC Specific Curriculum', desc: 'Syllabus designed exactly for BPSC Prelims, Mains & Interview stage.' },
    { title: 'Live + Recorded Classes',  desc: 'Attend live sessions or watch recordings at your own pace, anytime.' },
    { title: 'Daily Current Affairs',    desc: 'Daily updates curated by experts, in Hindi & English both.' },
    { title: 'Mock Tests & Analysis',    desc: 'Full-length mock tests with detailed performance analysis & rank.' },
    { title: 'Doubt Clearing Sessions',  desc: 'Regular doubt sessions with faculty to clear all your questions.' },
    { title: 'Study Material PDFs',      desc: 'Comprehensive notes and PDFs for every chapter and subject.' },
  ];

  const testimonialsTitle = hp?.testimonialsTitle || "Our Students' Success Stories";
  const testimonials = hp?.testimonials?.length ? hp.testimonials : [
    { name: 'Priya Singh',   rank: 'BPSC 69th Rank 42',  text: 'Goal Civil ka course bahut helpful tha. Video lectures aur mock tests ne mere confidence ko bahut badhaya.', city: 'Patna' },
    { name: 'Rahul Kumar',   rank: 'BPSC 68th Rank 87',  text: 'Daily current affairs aur live classes ne meri preparation ekdum change kar di. Highly recommended!', city: 'Muzaffarpur' },
    { name: 'Anjali Sharma', rank: 'BPSC 67th Rank 156', text: 'Online platform bahut smooth hai. Mobile pe bhi kaam karta hai. Faculty bahut experienced hai.', city: 'Gaya' },
  ];

  const aboutTitle  = hp?.aboutTitle || 'About Goal Civil';
  const aboutPara1  = hp?.aboutPara1 || 'Goal Civil was founded in 2018 with a simple mission: to make world-class BPSC coaching accessible to every Bihar aspirant, regardless of their location or economic background.';
  const aboutPara2  = hp?.aboutPara2 || 'We believe talent is evenly distributed, but opportunity is not. Our platform bridges this gap by bringing expert faculty and structured content to every corner of Bihar — and beyond.';
  const aboutBullets = hp?.aboutBullets?.length ? hp.aboutBullets : [
    'Founded in 2018 in Patna, Bihar', 'Trusted by 15,000+ BPSC aspirants',
    '500+ students selected till date', 'Expert panel of 50+ faculty members',
  ];
  const aboutStats = hp?.aboutStats?.length ? hp.aboutStats : [
    { value: '2018', label: 'Year Founded',   color: 'from-blue-500 to-indigo-600' },
    { value: '15K+', label: 'Students',       color: 'from-green-500 to-emerald-600' },
    { value: '500+', label: 'Selections',     color: 'from-amber-500 to-orange-600' },
    { value: '50+',  label: 'Expert Faculty', color: 'from-violet-500 to-purple-600' },
  ];
  const values = hp?.values?.length ? hp.values : [
    { title: 'Excellence',    desc: 'We set the highest standards in BPSC preparation content and delivery.' },
    { title: 'Student First', desc: 'Every decision we make is centered around student success and well-being.' },
    { title: 'Accessibility', desc: 'Quality BPSC coaching should not be limited to those with big budgets.' },
    { title: 'Results',       desc: "We measure our success only by our students' selections in BPSC." },
  ];

  const contactTitle   = hp?.contactTitle   || 'Contact Us';
  const contactAddress = hp?.contactAddress || 'Fraser Road, Patna, Bihar 800001';
  const contactPhone   = hp?.contactPhone   || '+91 98765 43210';
  const contactEmail   = hp?.contactEmail   || 'info@goalcivil.com';
  const contactHours   = hp?.contactHours   || 'Mon–Sat: 9 AM to 7 PM';

  const contactInfo = [
    { icon: <MapPin size={20} />, label: 'Address',      value: contactAddress },
    { icon: <Phone size={20} />,  label: 'Phone',        value: contactPhone },
    { icon: <Mail size={20} />,   label: 'Email',        value: contactEmail },
    { icon: <Clock size={20} />,  label: 'Office Hours', value: contactHours },
  ];

  return (
    <>
      <PublicHeader />

      {/* HERO */}
      <section id="home" className="relative flex items-center pt-16 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"/>
          <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"/>
          <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',backgroundSize:'40px 40px'}}/>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-blue-300 text-sm font-semibold">{heroBadgeText}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">BPSC</span>{' '}
              {heroTitle.replace(/^BPSC\s*/i, '')}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">{heroSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href={ROUTES.SIGNUP} className="flex items-center justify-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-base shadow-xl shadow-blue-500/30 transition-all hover:scale-105">
                {heroCtaLabel} <ArrowRight size={18}/>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {[heroBadge1, heroBadge2].filter(Boolean).map(t => (
                <div key={t} className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <CheckCircle size={14} className="text-green-400"/><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <CourseCarousel
              courses={courses.length === 0 ? PLACEHOLDER_COURSES : courses}
              loginHref={`${ROUTES.LOGIN}?redirect=${ROUTES.STUDENT.COURSES}`}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xl font-semibold uppercase tracking-[0.24em] text-blue-600 mb-3">{featuresTitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ title, desc }, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-colors">
                  <CheckCircle size={18} className="text-blue-600 group-hover:text-white transition-colors"/>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section id="courses" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xl font-semibold uppercase tracking-[0.24em] text-blue-600 mb-3">Featured Courses</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {(courses.length === 0 ? PLACEHOLDER_COURSES : courses).map(c => (
              <CourseCard key={c._id} course={c} href={`${ROUTES.LOGIN}?redirect=${ROUTES.STUDENT.COURSES}`} ctaLabel="Login to Enroll"/>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href={ROUTES.LOGIN} className="inline-flex items-center gap-1.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
              View More →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xl font-semibold uppercase tracking-[0.24em] text-blue-600 mb-3">{testimonialsTitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, rank, text, city }, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-amber-400 text-amber-400"/>)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {name?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-blue-600 font-semibold">{rank} · {city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-16">
            <div>
              <p className="text-xl font-semibold uppercase tracking-[0.24em] text-blue-600 mb-3">{aboutTitle}</p>
              <p className="text-gray-600 leading-relaxed mb-4">{aboutPara1}</p>
              <p className="text-gray-600 leading-relaxed mb-6">{aboutPara2}</p>
              <ul className="space-y-2">
                {aboutBullets.map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-gray-700">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0"/>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {aboutStats.map(({ value, label, color }) => (
                <div key={label} className={`rounded-2xl bg-gradient-to-br ${color} p-5 text-white`}>
                  <div className="text-3xl font-black">{value}</div>
                  <div className="text-sm opacity-80 font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {VALUE_ICONS[title] || <Target size={22}/>}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xl font-semibold uppercase tracking-[0.24em] text-blue-600 mb-3">{contactTitle}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
              <div className="space-y-8 p-8">
                {contactInfo.map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">{icon}</div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                      <p className="font-semibold text-gray-800 mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3 mt-6">
                  {[{icon:<Youtube size={16}/>,href:'#'},{icon:<Facebook size={16}/>,href:'#'},{icon:<Instagram size={16}/>,href:'#'}].map((s,i)=>(
                    <a key={i} href={s.href} className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white flex items-center justify-center text-gray-500 transition-colors">
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <PageFooter />
    </>
  );
}
