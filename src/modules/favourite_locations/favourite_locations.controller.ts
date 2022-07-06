import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Res,
} from '@nestjs/common';
import { FavouriteLocationsService } from './favourite_locations.service';
import { CreateFavouriteLocationDto } from './dto/create-favourite_location.dto';
import { UpdateFavouriteLocationDto } from './dto/update-favourite_location.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/shared/http-exception.filter';
import { Response } from 'express';

@ApiTags('favourite-locations')
@Controller('v1/rhc/favourite-locations')
@UseFilters(new HttpExceptionFilter())
export class FavouriteLocationsController {
  constructor(
    private readonly favouriteLocationsService: FavouriteLocationsService,
  ) { }

  @Post()
  async create(@Body() createFavouriteLocationDto: CreateFavouriteLocationDto, @Res() res: Response) {
    const result = await this.favouriteLocationsService.create(createFavouriteLocationDto);
    return res.status(result.status).json(result)
  }

  @Post('update')
  async update(@Body() updateFavouriteLocationDto: UpdateFavouriteLocationDto, @Res() res: Response) {
    // @ts-ignore
    const result = await this.favouriteLocationsService.update(updateFavouriteLocationDto);
    return res.status(result.status).json(result)
  }

  @Get('getbyuserid/:userId')
  async findAll(@Param('userId') userId: string, @Res() res: Response) {
    const result = await this.favouriteLocationsService.getFavouriteLocationByUserId(userId);
    return res.status(result.status).json(result)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.favouriteLocationsService.findOne(id);
    return res.status(result.status).json(result)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.favouriteLocationsService.remove(id);
    return res.status(result.status).json(result)
  }
}
