import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find({ relations: ['artist'] });
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const { artistId, ...rest } = createAlbumDto;
    const album = this.albumRepository.create(rest);

    if (artistId) {
      const artist = await this.artistRepository.findOne({
        where: { id: artistId },
      });
      if (!artist) {
        throw new NotFoundException('Artist not found');
      }
      album.artist = artist;
    }

    return await this.albumRepository.save(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);
    const { artistId, ...rest } = updateAlbumDto;

    Object.assign(album, rest);

    if (artistId !== undefined) {
      if (artistId === null) {
        album.artist = null;
      } else {
        const artist = await this.artistRepository.findOne({
          where: { id: artistId },
        });
        if (!artist) {
          throw new NotFoundException('Artist not found');
        }
        album.artist = artist;
      }
    }

    return await this.albumRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    // Set albumId to null in related tracks
    await this.trackRepository.update({ album: { id } }, { album: null });

    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Album not found');
    }
  }
}
