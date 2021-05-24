import {inject} from '@loopback/core';
import {
  arg,
  GraphQLBindings,
  query,
  resolver,
  ResolverData,
} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {Configuration} from '../models';
import {ConfigurationRepository} from '../repositories';

@resolver(of => Configuration)
export class ConfigurationResolver {
  constructor(
    // constructor injection of service
    @repository('ConfigurationRepository')
    private readonly configurationRepo: ConfigurationRepository,
    // It's possible to inject the resolver data
    @inject(GraphQLBindings.RESOLVER_DATA) private resolverData: ResolverData,
  ) {}

  @query(returns => Configuration, {nullable: true})
  async configuration(@arg('configurationId') configurationId: string) {
    return this.configurationRepo.findById(configurationId);
  }

  @query(returns => [Configuration])
  async configurations(): Promise<Configuration[]> {
    return this.configurationRepo.find();
  }
}
