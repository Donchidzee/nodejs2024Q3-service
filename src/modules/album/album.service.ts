import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Album } from './interfaces/album.interface';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { db } from '../../data/database';

@Injectable()
export class AlbumService {
  private albums = db.albums;
  private tracks = db.tracks;
  private favorites = db.favorites;

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const albumIndex = this.albums.findIndex((a) => a.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }
    const updatedAlbum = { ...this.albums[albumIndex], ...updateAlbumDto };
    this.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }
    this.albums.splice(index, 1);

    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );

    this.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }
}
