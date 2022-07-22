import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Article as Entity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Entity)
    private repository: Repository<Entity>,
  ) {}

  async create(data) {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async findAll(): Promise<Entity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<Entity> {
    return this.repository.findOneBy({ id });
  }

  async findOneBy(where): Promise<Entity> {
    const data = await this.repository.findOneBy(where);
    return data;
  }

  async _checkNotFound(where): Promise<Entity> {
    const data = await this.repository.findOneBy(where);
    if (!data) throw new NotFoundException();
    return data;
  }

  async update(where, payload: QueryDeepPartialEntity<Entity>) {
    const data = await this.findOneBy(where);
    await this.repository.update(where, Object.assign(data, payload));
    return this.findOneBy(data.id);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }
}
