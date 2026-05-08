import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Course from '@/server/db/models/Course';

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const courses = await Course.find().sort({ createdAt: -1 });
  return NextResponse.json({ courses });
}

export async function POST(req) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { title, description, shortDesc, thumbnail, price, isFree, category, language } = body;

    if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });

    await connectDB();

    let slug = slugify(title);
    const existing = await Course.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const course = await Course.create({
      title: title.trim(),
      slug,
      description,
      shortDesc,
      thumbnail,
      price: isFree ? 0 : (price || 0),
      isFree: !!isFree,
      category,
      language,
    });

    return NextResponse.json({ message: 'Course created.', course }, { status: 201 });
  } catch (err) {
    console.error('[ADMIN COURSE CREATE]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
