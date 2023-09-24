import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { AuthnStrategy, Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ApiWhereJsonQuery, JsonQuery } from '../common/json-query.decorator';
import { AccessTokenService } from './access-token.service';
import { AdministratorsService } from './administrators.service';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAccessTokenDto } from './dto/update-access-token.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { AccessToken } from './entities/access-token.entity';
import { Administrator } from './entities/administrator.entity';
import { UserCredential } from './entities/user-credential.entity';

@Controller('administrators')
@ApiTags('administrator')
@ApiExtraModels(Administrator)
@ApiExtraModels(UserCredential)
@ApiExtraModels(AccessToken)
@ApiExtraModels(LoginDto)
@ApiExtraModels(UserProfile)
@Roles(Role.SuperAdmin, Role.Admin)
export class AdministratorsController {
  constructor(
    private readonly administratorsService: AdministratorsService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

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
  async login(
    @Body() credentials: LoginDto,
    @Req() req,
  ): Promise<{ token: string }> {
    // ensure the user exists, and the password is correct
    const user = await this.administratorsService.verifyCredentials(
      credentials,
    );
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.administratorsService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const accessToken = await this.accessTokenService.generateToken(
      userProfile,
      req,
      {
        name: credentials.tokenName,
        ttl: credentials.ttl,
      },
    );
    return { token: accessToken.id };
  }

  @Get('whoami')
  @Roles()
  whoAmI(@Req() req): UserProfile {
    return req.user;
  }

  @Post(':id/access-tokens')
  @Roles(Role.SuperAdmin, Role.Admin)
  async createAccessToken(
    @Param('id') id: string,
    @Req() req,
    @Body() accessToken: CreateAccessTokenDto,
  ): Promise<AccessToken> {
    if (
      req.user.authnStrategy === AuthnStrategy.AccessToken &&
      req.user.securityId !== id
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    return (
      await this.accessTokenService.generateToken(
        { securityId: id },
        req,
        accessToken,
      )
    ).toJSON();
  }

  @Patch(':id/access-tokens')
  @ApiWhereJsonQuery()
  @Roles(Role.SuperAdmin, Role.Admin)
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'Administrator.AccessToken PATCH success',
  })
  async patch(
    @Param('id') id: string,
    @Req() req,
    @Body()
    accessToken: UpdateAccessTokenDto,
    @JsonQuery('where') where?: FilterQuery<AccessToken>,
  ) {
    if (
      req.user.authnStrategy === AuthnStrategy.AccessToken &&
      req.user.securityId !== id
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    // updating userId is not allowed.
    if ((<any>accessToken).userId) {
      throw new HttpException(
        'Updating userId is not allowed.',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.accessTokenService.updateAll(
      accessToken,
      { ...where, userId: id },
      req,
    );
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
