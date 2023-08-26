import { Injectable } from '@nestjs/common';
import { CreateBounceDto } from './dto/create-bounce.dto';
import { UpdateBounceDto } from './dto/update-bounce.dto';

@Injectable()
export class BouncesService {
  create(createBounceDto: CreateBounceDto) {
    return 'This action adds a new bounce';
  }

  findAll() {
    return `This action returns all bounces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bounce`;
  }

  update(id: number, updateBounceDto: UpdateBounceDto) {
    return `This action updates a #${id} bounce`;
  }

  remove(id: number) {
    return `This action removes a #${id} bounce`;
  }
}
