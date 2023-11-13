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
  Req,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { Role } from 'src/auth/constants';
import { Roles } from 'src/auth/roles.decorator';
import { FilterDto } from '../common/dto/filter.dto';
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
@Roles(Role.SuperAdmin)
@ApiForbiddenResponse({ description: 'Forbidden' })
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
    @Req() req,
  ) {
    return this.bouncesService.replaceById(id, updateBounceDto, req);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Bounce PATCH success' })
  update(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateBounceDto,
    @Req() req,
  ) {
    return this.bouncesService.updateById(id, updateConfigurationDto, req);
  }

  @Post()
  @ApiOkResponse({
    description: 'Bounce model instance',
    type: Bounce,
  })
  @HttpCode(200)
  create(@Body() createBounceDto: CreateBounceDto, @Req() req) {
    return this.bouncesService.create(createBounceDto, req);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Bounce model instance',
    type: [Bounce],
  })
  findOne(@Param('id') id: string) {
    return this.bouncesService.findById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'bounce DELETE success' })
  remove(@Param('id') id: string) {
    return this.bouncesService.remove(id);
  }

  @Patch()
  @ApiWhereJsonQuery()
  @ApiNoContentResponse({ description: 'Bounce PATCH success' })
  updateAll(
    @Body() updateConfigurationDto: UpdateBounceDto,
    @Req() req,
    @JsonQuery('where') where?: FilterQuery<Bounce>,
  ) {
    return this.bouncesService.updateAll(updateConfigurationDto, where, req);
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
