import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import { User } from './user.entity';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async listUser(): Promise<User[]> {
    return await this.appService.listUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    try {
      return await this.appService.getUser(id);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          code: 'NOT_FOUND',
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post()
  async createUser(@Body() user: UserDto): Promise<User> {
    try {
      return await this.appService.createUser(user);
    } catch (err) {
      if (err.driverError.code == `SQLITE_CONSTRAINT`) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            code: 'BAD_REQUEST',
            message: err,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          code: 'BAD_REQUEST',
          message: 'User already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() user: UserDto,
  ): Promise<User> {
    try {
      return await this.appService.updateUser(id, user);
    } catch (err) {
      if (err.driverError && err.driverError.code == `SQLITE_CONSTRAINT`) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            code: 'BAD_REQUEST',
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          code: 'NOT_FOUND',
          message: err.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<User> {
    try {
      return await this.appService.deleteUser(id);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          code: 'NOT_FOUND',
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
