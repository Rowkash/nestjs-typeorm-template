import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import type {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
import { UserEntity } from '@/users/entities/user.entity';
import { DeleteUserDto } from '@/users/dto/delete-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UsersService } from '@/users/services/users.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Return self user' })
  @Get('me')
  async getSelfUser(@Req() { user }: ICustomRequest) {
    const { id } = user as IRequestUser;
    const userDoc = await this.usersService.getOne({ id });

    return plainToInstance(UserEntity, userDoc, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Return user by id' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getOne({ id });

    return plainToInstance(UserEntity, user, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Update self user' })
  @Patch('me')
  async update(@Req() { user }: ICustomRequest, @Body() dto: UpdateUserDto) {
    const { id } = user as IRequestUser;
    await this.usersService.update({ id, ...dto });
  }

  @ApiOperation({ summary: 'Delete self user' })
  @Delete()
  async remove(
    @Req() { user }: ICustomRequest,
    @Body() { password }: DeleteUserDto,
  ) {
    const { id } = user as IRequestUser;
    await this.usersService.remove({ id, password });
  }
}
