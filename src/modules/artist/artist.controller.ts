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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<Artist[]> {
    return await this.artistService.findAll();
  }

  @Get(':artistId')
  @HttpCode(HttpStatus.OK)
  async getOne(
    @Param('artistId', ParseUUIDPipe) artistId: string,
  ): Promise<Artist> {
    return await this.artistService.findOne(artistId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    return await this.artistService.create(createArtistDto);
  }

  @Put(':artistId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('artistId', ParseUUIDPipe) artistId: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    return await this.artistService.update(artistId, updateArtistDto);
  }

  @Delete(':artistId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('artistId', ParseUUIDPipe) artistId: string,
  ): Promise<void> {
    await this.artistService.remove(artistId);
  }
}
