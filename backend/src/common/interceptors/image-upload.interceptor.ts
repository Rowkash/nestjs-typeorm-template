import { extname } from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class ImageUploadInterceptor extends FileInterceptor('file', {
  storage: diskStorage({
    destination: './tmp',
    filename(
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) {
      const fileExt = extname(file.originalname);
      const fileName = uuidv4() + fileExt;
      callback(null, fileName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
}) {}
