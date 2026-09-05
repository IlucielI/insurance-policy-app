import { NextRequest, NextResponse } from 'next/server';
import { minioClient, BUCKETS } from '@/lib/minio';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate bucket
    const validBuckets = Object.values(BUCKETS);
    if (!validBuckets.includes(bucket as typeof BUCKETS[keyof typeof BUCKETS])) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to MinIO
    await minioClient.putObject(bucket as string, fileName, buffer, buffer.length, {
      'Content-Type': file.type,
      'Original-Name': file.name,
    });

    return NextResponse.json({
      success: true,
      key: fileName,
      bucket,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
