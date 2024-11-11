import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { db } from '../../data/database';

@Injectable()
export class ArtistService {
  private artists = db.artists;
  private albums = db.albums;
  private tracks = db.tracks;
  private favorites = db.favorites;

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artistIndex = this.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }
    const updatedArtist = { ...this.artists[artistIndex], ...updateArtistDto };
    this.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }
    this.artists.splice(index, 1);

    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );

    this.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    this.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  }
}
