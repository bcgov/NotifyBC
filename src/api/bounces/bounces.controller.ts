import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { FilterDto } from '../common/dto/filter.dto';
import { UpdateManyResultDto } from '../common/dto/update-many-result.dto';
import {
  ApiFilterJsonQuery,
  ApiWhereJsonQuery,
  JsonQuery,
} from '../common/json-query.decorator';
import { BouncesService } from './bounces.service';
import { CreateBounceDto } from './dto/create-bounce.dto';
import { UpdateBounceDto } from './dto/update-bounce.dto';
import { Bounce } from './entities/bounce.entity';

@Controller('bounces')
@ApiTags('bounce')
@ApiExtraModels(Bounce)
export class BouncesController {
  constructor(private readonly bouncesService: BouncesService) {}

  @Get('count')
  @ApiWhereJsonQuery()
  @ApiOkResponse({
    description: 'Bounce model count',
    type: Number,
  })
  count(@JsonQuery('where') where?: FilterQuery<Bounce>) {
    return this.bouncesService.count(where);
  }

  @Put(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Bounce PUT success' })
  replaceById(
    @Param('id') id: string,
    @Body() updateBounceDto: CreateBounceDto,
  ) {
    return this.bouncesService.replaceById(id, updateBounceDto);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Bounce PATCH success' })
  update(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateBounceDto,
  ) {
    return this.bouncesService.update(id, updateConfigurationDto);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Bounce model instance',
    type: Bounce,
  })
  create(@Body() createBounceDto: CreateBounceDto) {
    return this.bouncesService.create(createBounceDto);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Bounce model instance',
    type: [Bounce],
  })
  findOne(@Param('id') id: string) {
    return this.bouncesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'bounce DELETE success' })
  remove(@Param('id') id: string) {
    return this.bouncesService.remove(id);
  }

  @Patch()
  @ApiWhereJsonQuery()
  @ApiOkResponse({
    description: 'Bounce PATCH result',
    type: UpdateManyResultDto,
  })
  updateAll(
    @Body() updateConfigurationDto: UpdateBounceDto,
    @JsonQuery('where') where?: FilterQuery<Bounce>,
  ) {
    return this.bouncesService.updateAll(updateConfigurationDto, where);
  }

  @Get()
  @ApiFilterJsonQuery()
  @ApiOkResponse({
    description: 'Array of Bounce model instances',
    type: [Bounce],
  })
  findAll(
    @JsonQuery('filter')
    filter: FilterDto<Bounce>,
  ) {
    return this.bouncesService.findAll(filter);
  }
}
