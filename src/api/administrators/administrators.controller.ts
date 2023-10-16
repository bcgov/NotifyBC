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
import { genSalt, hash } from 'bcryptjs';
import { omit } from 'lodash';
import { FilterQuery } from 'mongoose';
import { AuthnStrategy, Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { Roles } from 'src/auth/roles.decorator';
import { CountDto } from '../common/dto/count.dto';
import { FilterDto } from '../common/dto/filter.dto';
import {
  ApiFilterJsonQuery,
  ApiWhereJsonQuery,
  JsonQuery,
} from '../common/json-query.decorator';
import { AccessTokenService } from './access-token.service';
import { AdministratorsService } from './administrators.service';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { CreateUserCredentialReturnDto } from './dto/create-user-credential-return.dto';
import { CreateUserCredentialDto } from './dto/create-user-credential.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAccessTokenDto } from './dto/update-access-token.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { AccessToken } from './entities/access-token.entity';
import { Administrator } from './entities/administrator.entity';
import {
  PASSWORD_COMPLEXITY_REGEX,
  UserCredential,
} from './entities/user-credential.entity';
import { UserCredentialService } from './user-credential.service';

@Controller('administrators')
@ApiTags('administrator')
@ApiExtraModels(Administrator)
@ApiExtraModels(UserCredential)
@ApiExtraModels(AccessToken)
@ApiExtraModels(LoginDto)
@ApiExtraModels(UserProfile)
@Roles(Role.SuperAdmin, Role.Admin)
@ApiForbiddenResponse({ description: 'Forbidden' })
export class AdministratorsController {
  constructor(
    private readonly administratorsService: AdministratorsService,
    private readonly accessTokenService: AccessTokenService,
    private readonly userCredentialService: UserCredentialService,
  ) {}

  @Get('count')
  @ApiWhereJsonQuery()
  @ApiOkResponse({
    description: 'Administrator count',
    type: Number,
  })
  count(@Req() req, @JsonQuery('where') where?: FilterQuery<Administrator>) {
    if (req?.user?.authnStrategy === AuthnStrategy.AccessToken) {
      where = { $and: [where ?? {}, { id: req.user.securityId }] };
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
  @HttpCode(200)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiOkResponse({
    description: 'Administrator model instance',
    type: AccessToken,
  })
  async createAccessToken(
    @Param('id') id: string,
    @Req() req,
    @Body() accessToken: CreateAccessTokenDto,
  ): Promise<AccessToken> {
    if (
      req?.user?.authnStrategy === AuthnStrategy.AccessToken &&
      req?.user?.securityId !== id
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    return await this.accessTokenService.generateToken(
      { securityId: id },
      req,
      accessToken,
    );
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
      req?.user?.authnStrategy === AuthnStrategy.AccessToken &&
      req?.user?.securityId !== id
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

  @Get(':id/access-tokens')
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiFilterJsonQuery()
  async find(
    @Param('id') id: string,
    @Req() req,
    @JsonQuery('filter')
    filter?: FilterDto<AccessToken>,
  ): Promise<AccessToken[]> {
    if (
      req?.user?.authnStrategy === AuthnStrategy.AccessToken &&
      req?.user?.securityId !== id
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    const modifiedFilter = filter ?? { where: {} };
    modifiedFilter.where = {
      ...modifiedFilter.where,
      userId: id,
    };
    return this.accessTokenService.findAll(modifiedFilter);
  }

  @Delete(':id/access-tokens')
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiWhereJsonQuery()
  async delete(
    @Param('id') id: string,
    @Req() req,
    @JsonQuery('where') where?: FilterQuery<AccessToken>,
  ): Promise<CountDto> {
    if (
      req?.user?.authnStrategy === AuthnStrategy.AccessToken &&
      req?.user?.securityId !== id
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    return this.accessTokenService.removeAll({ ...where, userId: id });
  }

  @Post(':id/user-credential')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'UserCredential model instance',
    type: CreateUserCredentialReturnDto,
  })
  async createCredential(
    @Param('id') userId: string,
    @Req() req,
    @Body()
    userCredential: CreateUserCredentialDto,
  ): Promise<CreateUserCredentialReturnDto> {
    if (
      req?.user?.authnStrategy === AuthnStrategy.AccessToken &&
      req?.user?.securityId !== userId
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    const pwdRegEx = new RegExp(PASSWORD_COMPLEXITY_REGEX);
    if (!pwdRegEx.test(userCredential.password)) {
      throw new HttpException(undefined, HttpStatus.BAD_REQUEST);
    }
    userCredential.password = await hash(
      userCredential.password,
      await genSalt(),
    );

    return await this.userCredentialService.findOneAndReplace(
      { ...userCredential, userId },
      { userId },
      req,
      true,
    );
  }

  @Put(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Administrator PUT success' })
  async replaceById(
    @Param('id') id: string,
    @Req() req,
    @Body()
    administrator: UpdateAdministratorDto,
  ): Promise<void> {
    if (
      req.user.authnStrategy === AuthnStrategy.AccessToken &&
      req.user.securityId !== id
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    if (administrator.password) {
      await this.createCredential(id, req, {
        password: administrator.password,
      });
      delete administrator.password;
    }
    await this.administratorsService.replaceById(id, administrator, req);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Administrator Patch success' })
  async update(
    @Param('id') id: string,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
    @Req() req,
  ) {
    if (
      req.user.authnStrategy === AuthnStrategy.AccessToken &&
      req.user.securityId !== id
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    if (updateAdministratorDto.password) {
      await this.createCredential(id, req, {
        password: updateAdministratorDto.password,
      });
      delete updateAdministratorDto.password;
    }
    return this.administratorsService.updateById(
      id,
      updateAdministratorDto,
      req,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req): Promise<Administrator> {
    if (
      req.user.authnStrategy === AuthnStrategy.AccessToken &&
      req.user.securityId !== id
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    return this.administratorsService.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    if (
      req.user.authnStrategy === AuthnStrategy.AccessToken &&
      req.user.securityId !== id
    ) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    await this.accessTokenService.removeAll({ userId: id });
    await this.userCredentialService.removeAll({ userId: id });
    this.administratorsService.remove(id);
  }

  @Post()
  @HttpCode(200)
  @Roles(Role.SuperAdmin)
  @ApiOkResponse({
    description: 'User',
    type: Administrator,
  })
  async signUp(
    @Body() createAdministratorDto: CreateAdministratorDto,
    @Req() req,
  ): Promise<Administrator> {
    const savedUser = await this.administratorsService.create(
      omit(createAdministratorDto, 'password'),
      req,
    );
    await this.createCredential(savedUser.id, req, {
      password: createAdministratorDto.password,
    });
    return savedUser;
  }

  @Get()
  @ApiFilterJsonQuery()
  @ApiOkResponse({
    description: 'Array of Administrator model instances',
    type: [Administrator],
  })
  findAll(
    @JsonQuery('filter')
    filter: FilterDto<Administrator>,
    @Req() req,
  ) {
    if (req.user.authnStrategy === AuthnStrategy.AccessToken) {
      filter = filter ?? {};
      filter.where = {
        $and: [filter.where ?? {}, { id: req.user.securityId }],
      };
    }
    return this.administratorsService.findAll(filter);
  }
}
