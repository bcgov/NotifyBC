import {TokenService} from '@loopback/authentication';
import {injectable, service} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import cryptoRandomString from 'crypto-random-string';
import {AccessToken} from '../models';
import {AccessTokenRepository, AdministratorRepository} from '../repositories';
import {AdminUserService} from './admin-user.service';

@injectable()
export class AccessTokenService implements TokenService {
  constructor(
    @repository(AccessTokenRepository)
    public accessTokenRepository: AccessTokenRepository,
    @repository(AdministratorRepository)
    public userRepository: AdministratorRepository,
    @service(AdminUserService)
    public adminUserService: AdminUserService,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      const accessToken = await this.accessTokenRepository.findById(token);
      if (
        Date.parse(accessToken.created as string) +
          1000 * <number>accessToken.ttl <
        Date.now()
      ) {
        throw new Error();
      }
      const user = await this.userRepository.findById(accessToken.userId);
      userProfile = this.adminUserService.convertToUserProfile(user);
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(
    userProfile: UserProfile,
    options?: AnyObject,
  ): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }
    let id: string;
    try {
      id = cryptoRandomString({length: 64, type: 'alphanumeric'});
      const opts = options ?? {};
      const accessToken = new AccessToken(
        Object.assign({}, opts, {
          id,
          userId: userProfile[securityId],
        }),
      );
      await this.accessTokenRepository.create(accessToken);
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }
    return id;
  }
}
