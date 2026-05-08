import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/server/db/models/Course';
import Subject from '@/server/db/models/Subject';
import Chapter from '@/server/db/models/Chapter';
import Content from '@/server/db/models/Content';

export async function GET(_req, { params }) {
  try {
    const { slug } = await params;
    await connectDB();

    const course = await Course.findOne({ slug, isPublished: true });
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });

    const subjects = await Subject.find({ courseId: course._id }).sort({ order: 1 });
    const curriculum = await Promise.all(
      subjects.map(async (subject) => {
        const chapters = await Chapter.find({ subjectId: subject._id }).sort({ order: 1 });
        const chaptersWithContent = await Promise.all(
          chapters.map(async (chapter) => {
            const contents = await Content.find({ chapterId: chapter._id })
              .sort({ order: 1 })
              .select('title type duration isFree order');
            return { ...chapter.toObject(), contents };
          })
        );
        return { ...subject.toObject(), chapters: chaptersWithContent };
      })
    );

    return NextResponse.json({ course, curriculum });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
