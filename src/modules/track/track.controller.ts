import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<Track[]> {
    return await this.trackService.findAll();
  }

  @Get(':trackId')
  @HttpCode(HttpStatus.OK)
  async getOne(
    @Param('trackId', ParseUUIDPipe) trackId: string,
  ): Promise<Track> {
    return await this.trackService.findOne(trackId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.trackService.create(createTrackDto);
  }

  @Put(':trackId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('trackId', ParseUUIDPipe) trackId: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    return await this.trackService.update(trackId, updateTrackDto);
  }

  @Delete(':trackId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('trackId', ParseUUIDPipe) trackId: string,
  ): Promise<void> {
    await this.trackService.remove(trackId);
  }
}
