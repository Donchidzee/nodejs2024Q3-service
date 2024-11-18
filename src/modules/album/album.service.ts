import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    if (!id) {
      throw new BadRequestException('Invalid UUID');
    }
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = this.albumRepository.create(createAlbumDto);
    return await this.albumRepository.save(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);
    Object.assign(album, updateAlbumDto);
    return await this.albumRepository.save(album);
  }

  async remove(id: string): Promise<void> {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Album not found');
    }
  }
}
