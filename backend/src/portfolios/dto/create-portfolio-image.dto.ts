import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreatePortfolioImageDto {
  @ApiProperty({
    example: 'First portfolio image',
    description: `Portfolio image name`,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'This is my portfolio image',
    description: `Portfolio image description`,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
