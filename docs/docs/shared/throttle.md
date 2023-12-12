Throttle is implemented using [Bottleneck](https://github.com/SGrondin/bottleneck) and [ioredis](https://github.com/luin/ioredis). See their documentations for more configurations. The only deviation made by _NotifyBC_ is using _jobExpiration_ to denote Bottleneck _expiration_ job option with a default value of 2min as defined in [config.ts](https://github.com/bcgov/NotifyBC/blob/main/src/config.ts).

When _NotifyBC_ is deployed to Kubernetes using Helm, by default throttle, if enabled, uses Redis Sentinel therefore rate limit applies to whole cluster.
