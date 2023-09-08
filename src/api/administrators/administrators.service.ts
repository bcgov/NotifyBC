import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Administrator } from './entities/administrator.entity';

@Injectable()
export class AdministratorsService {
  constructor(
    @InjectModel(Administrator.name)
    private administratorModel: Model<Administrator>,
  ) {}

  create(createAdministratorDto: CreateAdministratorDto) {
    return 'This action adds a new administrator';
  }

  count(filter?: FilterQuery<Administrator>) {
    return this.administratorModel.count(filter).exec();
  }

  findAll() {
    return `This action returns all administrators`;
  }

  findOne(id: number) {
    return `This action returns a #${id} administrator`;
  }

  update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    return `This action updates a #${id} administrator`;
  }

  remove(id: number) {
    return `This action removes a #${id} administrator`;
  }
}
