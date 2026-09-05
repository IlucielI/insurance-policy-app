import * as Minio from 'minio';

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || '100.70.163.113',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'insurance_admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'InsuranceMinIO2026!Secure',
});

export const BUCKETS = {
  DOCUMENTS: 'insurance-documents',
  CLAIMS: 'insurance-claims',
  IDENTITY: 'insurance-identity',
} as const;
