import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneBy(where): Promise<User> {
    const user = await this.usersRepository.findOneBy(where);
    return user;
  }

  async _checkNotFound(where): Promise<User> {
    const user = await this.usersRepository.findOneBy(where);
    if (!user) throw new NotFoundException();
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder()
      .select('*')
      .where({ username })
      .getRawOne();
  }

  async update(where, data) {
    const user = await this.findOneBy(where);
    await this.usersRepository.update(where, Object.assign(user, data));
    return this.findOneBy(user.id);
  }

  async createResetPasswordToken(username: string) {
    return this.update({ username }, { resetPasswordToken: uuidv4() });
  }

  async remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
