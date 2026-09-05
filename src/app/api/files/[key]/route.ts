import { NextRequest, NextResponse } from 'next/server';
import { minioClient, BUCKETS } from '@/lib/minio';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const searchParams = request.nextUrl.searchParams;
    const bucket = searchParams.get('bucket');

    if (!bucket) {
      return NextResponse.json({ error: 'Bucket parameter required' }, { status: 400 });
    }

    // Validate bucket
    const validBuckets = Object.values(BUCKETS);
    if (!validBuckets.includes(bucket as typeof BUCKETS[keyof typeof BUCKETS])) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
    }

    // Generate presigned URL (valid for 1 hour)
    const presignedUrl = await minioClient.presignedGetObject(bucket as string, key, 3600);

    return NextResponse.json({
      success: true,
      url: presignedUrl,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('Get file error:', error);
    return NextResponse.json(
      { error: 'Failed to get file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
