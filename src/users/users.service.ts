import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      return { ok: true, user };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        where: {
          isActived: true
        }
      });

      return users.length > 0
        ? { ok: true, users }
        : { ok: false, message: 'Data not found' };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
          isActived: true
        }
      });

      return user
        ? { ok: true, user }
        : { ok: false, message: 'user dont found' };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { name, lastName, email, password } = updateUserDto;

      let user = await this.userRepository.findOne({
        where: { id, isActived: true }
      });

      if (!user)
        throw new NotFoundException(`The user with id: ${id} don't found`);

      user.name = name;
      user.lastName = lastName;
      user.email = email;
      user.password = password;

      await this.userRepository.save(user);

      return { ok: true, message: 'User update' };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs'
    );
  }
}
