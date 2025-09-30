import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  Patch,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthGuard } from '@/auth/guards/auth.guard';
import type {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
import { FileImageValidationPipe } from '@/common/pipes/file.validation.pipe';
import { UpdatePortfolioImageDto } from '@/portfolios/dto/update-portfolio-image.dto';
import { CreatePortfolioImageDto } from '@/portfolios/dto/create-portfolio-image.dto';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';
import { ImageUploadInterceptor } from '@/common/interceptors/image-upload.interceptor';
import { PortfolioImageEntity } from '@/portfolios/entities/portfolio-image.entity';

@ApiTags('Portfolio Images')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('portfolios')
export class PortfolioImagesController {
  constructor(
    private readonly portfolioImagesService: PortfolioImagesService,
  ) {}

  @ApiOperation({ summary: 'Add image to portfolio' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Portfolio image name' },
        description: {
          type: 'string',
          description: 'Portfolio image description',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'description', 'file'],
    },
  })
  @UseInterceptors(ImageUploadInterceptor)
  @Post(':id/images')
  async create(
    @Req() { user }: ICustomRequest,
    @Param('id', ParseIntPipe) portfolioId: number,
    @UploadedFile(new FileImageValidationPipe(true)) file: Express.Multer.File,
    @Body() dto: CreatePortfolioImageDto,
  ) {
    const { id: userId } = user as IRequestUser;

    const image = await this.portfolioImagesService.create({
      ...dto,
      portfolioId,
      userId,
      file,
    });

    return plainToInstance(PortfolioImageEntity, image, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Update portfolio image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Portfolio image name',
        },
        description: {
          type: 'string',
          description: 'Portfolio image description',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(ImageUploadInterceptor)
  @Patch(':portfolioId/images/:imageId')
  async update(
    @Req() { user }: ICustomRequest,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
    @UploadedFile(new FileImageValidationPipe(false)) file: Express.Multer.File,
    @Body() dto: UpdatePortfolioImageDto,
  ) {
    const { id: userId } = user as IRequestUser;
    await this.portfolioImagesService.update({
      ...dto,
      id: imageId,
      userId,
      portfolioId,
      file,
    });
  }

  @ApiOperation({ summary: 'Get portfolio image by id' })
  @ApiOkResponse({
    description: 'Return portfolio image by id',
    type: PortfolioImageEntity,
  })
  @Get(':portfolioId/images/:imageId')
  async findById(
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    const image = await this.portfolioImagesService.findOne({
      id: imageId,
      portfolioId,
    });

    return plainToInstance(PortfolioImageEntity, image, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Delete portfolio image' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete(':portfolioId/images/:imageId')
  async remove(
    @Req() { user }: ICustomRequest,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    const { id: userId } = user as IRequestUser;
    await this.portfolioImagesService.remove({ imageId, portfolioId, userId });
  }
}
