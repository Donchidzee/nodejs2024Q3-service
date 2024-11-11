import { User } from '../modules/user/interfaces/user.interface';
import { Artist } from '../modules/artist/interfaces/artist.interface';
import { Album } from '../modules/album/interfaces/album.interface';
import { Track } from '../modules/track/interfaces/track.interface';
import { Favorites } from '../modules/favorites/interfaces/favorites.interface';

export const db = {
  users: [] as User[],
  artists: [] as Artist[],
  albums: [] as Album[],
  tracks: [] as Track[],
  favorites: {
    artists: [],
    albums: [],
    tracks: [],
  } as Favorites,
};
