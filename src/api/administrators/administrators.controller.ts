import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { ApiWhereJsonQuery, JsonQuery } from '../common/json-query.decorator';
import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Administrator } from './entities/administrator.entity';

@Controller('administrators')
@ApiTags('administrator')
@ApiExtraModels(Administrator)
@ApiExtraModels(UserCredential)
@ApiExtraModels(AccessToken)
@ApiExtraModels(LoginDto)
@ApiExtraModels(UserProfile)
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) {}

  @Get('count')
  @ApiWhereJsonQuery()
  @ApiOkResponse({
    description: 'Administrator count',
    type: Number,
  })
  count(@JsonQuery('where') where?: FilterQuery<Administrator>) {
    return this.administratorsService.count(where);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Token',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async login(@Body() credentials: LoginDto): Promise<{ token: string }> {
    // ensure the user exists, and the password is correct
    const user = await this.administratorsService.verifyCredentials(
      credentials,
    );
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.administratorsService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.accessTokenService.generateToken(userProfile, {
      name: credentials.tokenName,
      ttl: credentials.ttl,
    });
    return { token };
  }

  @Get('whoami')
  whoAmI(@Req() req): UserProfile {
    return req.user;
  }

  @Post()
  create(@Body() createAdministratorDto: CreateAdministratorDto) {
    return this.administratorsService.create(createAdministratorDto);
  }

  @Get()
  findAll() {
    return this.administratorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.administratorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ) {
    return this.administratorsService.update(id, updateAdministratorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.administratorsService.remove(id);
  }
}
