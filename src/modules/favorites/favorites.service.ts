import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorites } from './entities/favorites.entity';
import { Repository } from 'typeorm';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  private async getFavorites(): Promise<Favorites> {
    let favorites = await this.favoritesRepository.findOne({
      relations: ['artists', 'albums', 'tracks'],
    });
    if (!favorites) {
      favorites = this.favoritesRepository.create();
      await this.favoritesRepository.save(favorites);
    }
    return favorites;
  }

  async getAll() {
    const favorites = await this.getFavorites();
    return {
      artists: favorites.artists,
      albums: favorites.albums,
      tracks: favorites.tracks,
    };
  }

  async addTrack(id: string) {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException("Track with id doesn't exist.");
    }
    const favorites = await this.getFavorites();
    if (!favorites.tracks.find((t) => t.id === id)) {
      favorites.tracks.push(track);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeTrack(id: string) {
    const favorites = await this.getFavorites();
    const trackIndex = favorites.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track was not found.');
    }
    favorites.tracks.splice(trackIndex, 1);
    await this.favoritesRepository.save(favorites);
  }

  async addAlbum(id: string) {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException("Album with id doesn't exist.");
    }
    const favorites = await this.getFavorites();
    if (!favorites.albums.find((a) => a.id === id)) {
      favorites.albums.push(album);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeAlbum(id: string) {
    const favorites = await this.getFavorites();
    const albumIndex = favorites.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album was not found.');
    }
    favorites.albums.splice(albumIndex, 1);
    await this.favoritesRepository.save(favorites);
  }

  async addArtist(id: string) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException("Artist with id doesn't exist.");
    }
    const favorites = await this.getFavorites();
    if (!favorites.artists.find((a) => a.id === id)) {
      favorites.artists.push(artist);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtist(id: string) {
    const favorites = await this.getFavorites();
    const artistIndex = favorites.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1) {
      throw new NotFoundException('Artist was not found.');
    }
    favorites.artists.splice(artistIndex, 1);
    await this.favoritesRepository.save(favorites);
  }
}
