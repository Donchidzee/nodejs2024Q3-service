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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<Album[]> {
    return await this.albumService.findAll();
  }

  @Get(':albumId')
  @HttpCode(HttpStatus.OK)
  async getOne(
    @Param('albumId', ParseUUIDPipe) albumId: string,
  ): Promise<Album> {
    return await this.albumService.findOne(albumId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.albumService.create(createAlbumDto);
  }

  @Put(':albumId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('albumId', ParseUUIDPipe) albumId: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    return await this.albumService.update(albumId, updateAlbumDto);
  }

  @Delete(':albumId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('albumId', ParseUUIDPipe) albumId: string,
  ): Promise<void> {
    await this.albumService.remove(albumId);
  }
}
