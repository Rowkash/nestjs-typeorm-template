import {
  CreateBucketCommand,
  PutBucketPolicyCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ObjectIdentifier,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { IMinioConfig } from '@/configs/minio.config';
import { MINIO_CLIENT } from '@/minio/services/minio.provider';

export interface IUploadImage {
  key: string;
  file: Express.Multer.File;
}

@Injectable()
export class MinioService {
  private readonly bucketName: string;

  constructor(
    @Inject(MINIO_CLIENT)
    private readonly minioClient: S3Client,
    private readonly configService: ConfigService<IMinioConfig, true>,
  ) {
    this.bucketName = this.configService.get<string>('minio.bucketName', {
      infer: true,
    });
  }

  async createBucket(name: string) {
    const command = new CreateBucketCommand({
      Bucket: name,
    });
    await this.minioClient.send(command);
  }

  async updatePolicy(name: string) {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${name}/*`],
          Principal: '*',
        },
      ],
    };

    const command = new PutBucketPolicyCommand({
      Bucket: name,
      Policy: JSON.stringify(policy),
    });
    await this.minioClient.send(command);
  }

  async uploadFile(data: IUploadImage) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: data.key,
      Body: data.file.buffer,
      ContentType: data.file.mimetype,
    });
    await this.minioClient.send(command);
  }

  async uploadFileStream(data: IUploadImage) {
    const fileStream = createReadStream(data.file.path);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: data.key,
      Body: fileStream,
      ContentType: data.file.mimetype,
    });

    try {
      await this.minioClient.send(command);
    } finally {
      fileStream.destroy();
    }
  }

  async getFileBuffer(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const { Body } = await this.minioClient.send(command);
    const chunks: Uint8Array[] = [];
    for await (const chunk of Body as Readable) {
      // chunks.push(chunk);
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.minioClient.send(command);
  }

  async deleteFiles(keys: string[]) {
    const keysObjArr: ObjectIdentifier[] = [];
    for (const key of keys) {
      keysObjArr.push({ Key: key });
    }
    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: keysObjArr,
      },
    });
    await this.minioClient.send(command);
  }
}
