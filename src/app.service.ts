import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async listUsers(): Promise<User[]> {
    return this.userRepository.find(); // SELECT * FROM user;
  }
  async getUser(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id);
      return user;
    } catch (err) {
      throw err;
      // SELECT * FROM user where id='1234';
    }
  }
  async createUser(user: User): Promise<User> {
    try {
      const newUser = this.userRepository.create(user);
      return this.userRepository.save(newUser); // INSERT INTO user (name, email) VALUES ('John','john@gmail.com');
    } catch (err) {
      throw err;
    }
  }

  async updateUser(id: number, user: User): Promise<User> {
    let existingUser = await this.getUser(id);
    existingUser = user;
    return this.userRepository.save(existingUser); // UPDATE user SET name='John' WHERE id='1234';
  }

  async deleteUser(id: number): Promise<User> {
    const existingUser = await this.getUser(id);
    return this.userRepository.remove(existingUser); // UPDATE user SET name='John' WHERE id='1234';
  }

  /*
    You can also create your custom queries in the repository. Generally we use this when we have a very custom query which we can't do using standard repository methods.
    customQuery(): any {
      return this.userRepository.createQueryBuilder('user').leftJoinAndSelect('user.posts', 'posts').getMany();
  }
  */

  getHello(): string {
    return 'Hello World!';
  }
}
