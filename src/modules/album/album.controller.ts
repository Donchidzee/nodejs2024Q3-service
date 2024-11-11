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
import { AlbumService } from './album.service';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Album[] {
    return this.albumService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Album {
    return this.albumService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Album {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.albumService.remove(id);
  }
}
