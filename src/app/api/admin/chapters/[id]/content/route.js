import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Content from '@/server/db/models/Content';
import Chapter from '@/server/db/models/Chapter';
import Course from '@/server/db/models/Course';
import Subject from '@/server/db/models/Subject';

export async function GET(_req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const contents = await Content.find({ chapterId: id }).sort({ order: 1 });
    return NextResponse.json({ contents });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const { title, type, url, cloudinaryId, duration, isFree, order } = await req.json();

    if (!title || !type) return NextResponse.json({ error: 'Title and type are required.' }, { status: 400 });

    await connectDB();
    const count = await Content.countDocuments({ chapterId: id });
    const content = await Content.create({
      title: title.trim(), type, url, cloudinaryId, chapterId: id,
      duration, isFree: !!isFree, order: order ?? count,
    });

    // Update course totalLectures and totalDuration
    const chapter = await Chapter.findById(id);
    if (chapter) {
      const subject = await Subject.findById(chapter.subjectId);
      if (subject) {
        const allContents = await Content.find({
          chapterId: { $in: await Chapter.find({ subjectId: { $in: await Subject.find({ courseId: subject.courseId }).distinct('_id') } }).distinct('_id') }
        });
        await Course.findByIdAndUpdate(subject.courseId, {
          totalLectures: allContents.length,
          totalDuration: allContents.reduce((sum, c) => sum + (c.duration || 0), 0),
        });
      }
    }

    return NextResponse.json({ message: 'Content added.', content }, { status: 201 });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
