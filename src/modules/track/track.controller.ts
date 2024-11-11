import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Track[] {
    return this.trackService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Track {
    return this.trackService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto): Track {
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Track {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.trackService.remove(id);
  }
}
