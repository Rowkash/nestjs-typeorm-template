import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

import { IMinioConfig } from '@/configs/minio.config';

export const MINIO_CLIENT = 'MINIO_CLIENT';

export const MinioProvider = {
  provide: MINIO_CLIENT,
  useFactory: (configService: ConfigService) => {
    const minioConfig: IMinioConfig = configService.get<IMinioConfig>('minio', {
      infer: true,
    });
    return new S3Client({
      endpoint: minioConfig.endpoint,
      region: 'us-east-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: minioConfig.rootUser,
        secretAccessKey: minioConfig.rootPassword,
      },
    });
  },
  inject: [ConfigService],
};
