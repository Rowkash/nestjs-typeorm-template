import * as fs from 'fs';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileImageValidationPipe implements PipeTransform {
  constructor(private readonly isRequired: boolean = false) {}
  transform(file: Express.Multer.File) {
    if (this.isRequired && !file)
      throw new BadRequestException('Missing image');
    if (file) {
      const fileType = file.mimetype;
      if (!fileType.startsWith('image/')) {
        fs.unlinkSync(file.path);
        throw new BadRequestException(
          'Invalid image type. Only images formats are allowed.',
        );
      }
      return file;
    }
    return;
  }
}
