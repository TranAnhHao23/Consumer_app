import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserSessionService } from './user_session.service';
import { CreateUserSessionDto } from './dto/create-user_session.dto';
import { UpdateUserSessionDto } from './dto/update-user_session.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user-sessions')
@Controller('user-sessions')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @Post()
  create(@Body() createUserSessionDto: CreateUserSessionDto) {
    return this.userSessionService.createUserSession(createUserSessionDto);
  }

  @Get()
  findAll() {
    return this.userSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSessionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserSessionDto: UpdateUserSessionDto,
  ) {
    return this.userSessionService.update(id, updateUserSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSessionService.remove(+id);
  }
}
