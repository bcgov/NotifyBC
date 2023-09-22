import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { Roles } from 'src/auth/roles.decorator';
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
@Roles(Role.SuperAdmin, Role.Admin)
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) {}

  @Get('count')
  @ApiWhereJsonQuery()
  @ApiOkResponse({
    description: 'Administrator count',
    type: Number,
  })
  count(@Req() req, @JsonQuery('where') where?: FilterQuery<Administrator>) {
    if (req?.user?.authnStrategy === AuthnStrategy.AccessToken) {
      where = { and: [where ?? {}, { id: req.user.securityId }] };
    }
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
  @Roles(Role.Anonymous, Role.AuthenticatedUser)
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
  @Roles()
  whoAmI(@Req() req): UserProfile {
    return req.user;
  }

  @Post()
  @Roles(Role.SuperAdmin)
  create(@Body() createAdministratorDto: CreateAdministratorDto, @Req() req) {
    return this.administratorsService.create(createAdministratorDto, req);
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
    @Req() req,
  ) {
    return this.administratorsService.update(id, updateAdministratorDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.administratorsService.remove(id);
  }
}
