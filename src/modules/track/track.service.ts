import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { db } from '../../data/database';

@Injectable()
export class TrackService {
  private tracks = db.tracks;
  private favorites = db.favorites;

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = this.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const trackIndex = this.tracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }
    const updatedTrack = { ...this.tracks[trackIndex], ...updateTrackDto };
    this.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }
    this.tracks.splice(index, 1);

    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }
}
