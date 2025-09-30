import { registerAs } from '@nestjs/config';

export interface IMinioConfig {
  rootUser: string;
  rootPassword: string;
  endpoint: string;
  bucketName: string;
}

export default registerAs(
  'minio',
  (): IMinioConfig => ({
    rootUser: process.env.MINIO_ROOT_USER || 'admin',
    rootPassword: process.env.MINIO_ROOT_PASSWORD || 'password',
    endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
    bucketName: process.env.MINIO_BUCKET_NAME || 'storage',
  }),
);
