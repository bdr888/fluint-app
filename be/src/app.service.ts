import { Injectable, NotFoundException } from '@nestjs/common';
import { DataDao } from './data.dao';
import { CreateDataDto, UpdateDataDto } from './data.dto';
import { Data } from './data.db';

@Injectable()
export class AppService {
  constructor(private readonly dataDao: DataDao) {}

  async getAll(): Promise<Data[]> {
    return this.dataDao.getAll();
  }

  async findOne(id: string): Promise<Data> {
    const data = await this.dataDao.get(id);
    if (!data) {
      throw new NotFoundException(`Data with ID ${id} not found`);
    }
    return data;
  }

  async create(createDataDto: CreateDataDto): Promise<void> {
    return this.dataDao.create(createDataDto);
  }

  async update(id: string, updateDataDto: UpdateDataDto): Promise<Data> {
    const updatedData = await this.dataDao.patch(id, updateDataDto);
    if (!updatedData) {
      throw new NotFoundException(`Data with ID ${id} not found`);
    }
    return updatedData;
  }

  async remove(id: string): Promise<void> {
    const result = await this.dataDao.delete(id);
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Data with ID ${id} not found or already deleted`,
      );
    }
  }
}
