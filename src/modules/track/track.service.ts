import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async findAll(): Promise<Track[]> {
    return await this.trackRepository.find({ relations: ['artist', 'album'] });
  }

  async findOne(id: string): Promise<Track> {
    if (!id) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const { artistId, albumId, ...rest } = createTrackDto;

    const track = this.trackRepository.create(rest);

    if (artistId) {
      const artist = await this.artistRepository.findOne({
        where: { id: artistId },
      });
      if (!artist) {
        throw new NotFoundException('Artist not found');
      }
      track.artist = artist;
    }

    if (albumId) {
      const album = await this.albumRepository.findOne({
        where: { id: albumId },
      });
      if (!album) {
        throw new NotFoundException('Album not found');
      }
      track.album = album;
    }

    return await this.trackRepository.save(track);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOne(id);

    const { artistId, albumId, ...rest } = updateTrackDto;

    Object.assign(track, rest);

    if (artistId !== undefined) {
      if (artistId === null) {
        track.artist = null;
      } else {
        const artist = await this.artistRepository.findOne({
          where: { id: artistId },
        });
        if (!artist) {
          throw new NotFoundException('Artist not found');
        }
        track.artist = artist;
      }
    }

    if (albumId !== undefined) {
      if (albumId === null) {
        track.album = null;
      } else {
        const album = await this.albumRepository.findOne({
          where: { id: albumId },
        });
        if (!album) {
          throw new NotFoundException('Album not found');
        }
        track.album = album;
      }
    }

    return await this.trackRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Track not found');
    }
  }
}
