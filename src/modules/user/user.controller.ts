import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from '../auth/decorators/user.decerator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  findAll(@User() user) {
    return this.userService.findAllUsers();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() user: UserDto,
  ): Promise<CreateUserDto> {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string): Promise<CreateUserDto> {
    return this.userService.deleteUser(id);
  }
}
