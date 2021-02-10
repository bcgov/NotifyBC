import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  oas,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {
  Administrator,
  PASSWORD_COMPLEXITY_REGEX,
  UserCredential,
} from '../models';
import {
  AdministratorRepository,
  UserCredentialRepository,
} from '../repositories';

@authenticate('ipWhitelist', 'accessToken')
@oas.tags('administrator')
export class AdministratorUserCredentialController {
  constructor(
    @inject(SecurityBindings.USER)
    protected user: UserProfile,
    @repository(AdministratorRepository)
    protected administratorRepository: AdministratorRepository,
    @inject('repositories.UserCredentialRepository', {
      asProxyWithInterceptors: true,
    })
    protected userCredentialRepository: UserCredentialRepository,
  ) {}

  @post('/administrators/{id}/user-credential', {
    responses: {
      '200': {
        description: 'UserCredential model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(UserCredential)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Administrator.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredential, {
            title: 'NewUserCredentialInAdministrator',
            exclude: ['userId'],
          }),
        },
      },
    })
    userCredential: Omit<UserCredential, 'id'>,
  ): Promise<UserCredential> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    const pwdRegEx = new RegExp(PASSWORD_COMPLEXITY_REGEX);
    if (!pwdRegEx.test(userCredential.password)) {
      throw new HttpErrors.BadRequest();
    }
    userCredential.password = await hash(
      userCredential.password,
      await genSalt(),
    );
    await this.administratorRepository.userCredential(id).delete();
    return this.userCredentialRepository.create(
      Object.assign({}, userCredential, {userId: id}),
      undefined,
    );
  }
}
