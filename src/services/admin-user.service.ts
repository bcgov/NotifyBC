import {UserService} from '@loopback/authentication';
import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
import {Administrator} from '../models';
import {AdministratorRepository} from '../repositories';

export type Credentials = {
  email: string;
  password: string;
};

@injectable()
export class AdminUserService
  implements UserService<Administrator, Credentials> {
  constructor(
    @repository(AdministratorRepository)
    public userRepository: AdministratorRepository,
  ) {}
  async verifyCredentials(credentials: Credentials): Promise<Administrator> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
      include: ['userCredential'],
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const passwordMatched = await compare(
      credentials.password,
      foundUser.userCredential.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: Administrator): UserProfile {
    return {
      [securityId]: (user.id as string).toString(),
      name: user.username,
      id: user.id,
      userId: (user.id as string).toString(),
      email: user.email,
    };
  }
}
