import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({ example: 'My Portfolio', description: `Portfolio's name` })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'This is my Portfolio',
    description: `Portfolio's description`,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
