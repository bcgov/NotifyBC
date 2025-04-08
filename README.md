[![img](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=bcgov_des-notifybc&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=bcgov_des-notifybc)

# NotifyBC

A versatile notification API server. See **[full documentation](https://bcgov.github.io/NotifyBC/)**.

## Docker Desktop Kubernetes deployment
To build and run in Kubernetes via Docker Desktop:
Note: Kubernetes must be enabled in Docker Desktop.
```sh
kubectl config use-context docker-desktop
helm install dev helm -f helm/values.yaml -f helm/values.local.yaml
```

## License

    Copyright 2016-present Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

