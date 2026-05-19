/**
 * Supabase Storage via S3-compatible API
 * Uses @aws-sdk/client-s3 — no service role key needed, just Access Key + Secret.
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const BUCKET   = 'media';
const REGION   = process.env.SUPABASE_S3_REGION   || 'ap-southeast-2';
const ENDPOINT = process.env.SUPABASE_S3_ENDPOINT  || 'https://iqhtsjmrnmjudeoerjmj.storage.supabase.co/storage/v1/s3';
const BASE_PUBLIC_URL = `https://iqhtsjmrnmjudeoerjmj.supabase.co/storage/v1/object/public/${BUCKET}`;

const s3 = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId:     process.env.SUPABASE_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // required for Supabase S3
});

/**
 * Upload a file buffer to Supabase Storage (S3-compatible)
 *
 * @param {Buffer}  buffer   - raw file bytes
 * @param {string}  folder   - 'videos' | 'pdfs' | 'images' | 'profiles'
 * @param {string}  filename - original filename (used to get extension)
 * @param {string}  mimeType - e.g. 'video/mp4', 'application/pdf', 'image/jpeg'
 * @returns {{ url: string, path: string }}
 */
export async function uploadToSupabase(buffer, folder, filename, mimeType) {
  const ext      = filename.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const key      = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: mimeType,
  }));

  // Supabase public URL format
  const url = `${BASE_PUBLIC_URL}/${key}`;
  return { url, path: key };
}

/**
 * Delete a file from Supabase Storage by its key/path
 *
 * @param {string} path - e.g. 'videos/1234-abcd.mp4'
 */
export async function deleteFromSupabase(path) {
  await s3.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key:    path,
  }));
}
