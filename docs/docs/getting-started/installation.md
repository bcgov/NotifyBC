---
permalink: /docs/installation/
---

# Installation

_NotifyBC_ can be installed in 3 ways:

1. [Deploy locally from Source Code](#deploy-locally-from-source-code)
2. [Deploy to Kubernetes](#deploy-to-kubernetes)
3. [Deploy Docker Container](#deploy-docker-container)

For the purpose of evaluation, both source code and docker container will do. For production, the recommendation is one of

- deploying to Kubernetes
- setting up a load balanced app cluster from source code build, backed by MongoDB.

To setup a development environment in order to contribute to _NotifyBC_,
installing from source code is preferred.

## Deploy locally from Source Code

### System Requirements

- Software
  - Git
  - [Node.js](https://nodejs.org)@{{themeData.packageJson.engines.node}}
  - openssl (if enable HTTPS)
- Services
  - MongoDB with replica set, required for production
  - A standard SMTP server to deliver outgoing email, required for production if email is enabled.
  - A tcp proxy server such as [nginx stream proxy](http://nginx.org/en/docs/stream/ngx_stream_proxy_module.html) if list-unsubscribe by email is needed and _NotifyBC_ server cannot expose port 25 to internet
  - A SMS service provider if needs to enable SMS channel. The supported service providers are
    - Twilio (default)
    - Swift
  - Redis v6, required if email or sms throttling is enabled
  - SiteMinder, if needs SiteMinder authentication
  - An OIDC provider, if needs OIDC authentication
- Network and Permissions
  - Minimum runtime firewall requirements:
    - outbound to your ISP DNS server
    - outbound to any on port 80 and 443 in order to run build scripts and send SMS messages
    - outbound to any on SMTP port 25 if using direct mail; for SMTP relay, outbound to your configured SMTP server and port only
    - inbound to listening port (3000 by default) from other authorized server ips
    - if _NotifyBC_ instance will handle anonymous subscription from client browser, the listening port should be open to internet either directly or indirectly through a reverse proxy; If _NotifyBC_ instance will only handle SiteMinder authenticated webapp requests, the listening port should NOT be open to internet. Instead, it should only open to SiteMinder web agent reverse proxy.
  - If list-unsubscribe by email is needed, then one of the following must be met
    - _NotifyBC_ can bind to port 25 opening to internet
    - a tcp proxy server of which port 25 is open to internet. This proxy server can reach _NotifyBC_ on a tcp port.

### Installation

Run following commands

```sh
git clone https://github.com/bcgov/NotifyBC.git
cd NotifyBC
npm i && npm run build
npm run start
```

If successful, you will see following output

```
...
Server is running at http://0.0.0.0:3000
```

Now open [http://localhost:3000](http://localhost:3000). The page displays NotifyBC Web Console.

The above commands installs the _main_ version, i.e. main branch tip of _NotifyBC_ GitHub repository. To install a specific version, say _v2.1.0_, run

```sh
 git checkout tags/v2.1.0 -b v2.1.0
```

after `cd NotifyBC`. A list of versions can be found [here](https://github.com/bcgov/NotifyBC/tags).

::: tip install from behind firewall
If you want to install on a server behind firewall which restricts internet connection, you can work around the firewall as long as you have access to a http(s) forward proxy server. Assuming the proxy server is http://my_proxy:8080 which proxies both http and https requests, to use it:

- For Linux

  ```sh
  export http_proxy=http://my_proxy:8080
  export https_proxy=http://my_proxy:8080
  git config --global url."https://".insteadOf git://
  ```

- For Windows

  ```sh
  git config --global http.proxy http://my_proxy:8080
  git config --global url."https://".insteadOf git://
  npm config set proxy http://my_proxy:8080
  ```

:::

#### Install Windows Service

After get the app running interactively, if your server is Windows and you want to install the app as a Windows service, run

```
npm install -g node-windows
npm link node-windows
node windows-service.js
```

This will create and start service _notifyBC_. To change service name, modify file _windows-service.js_ before running it. See [node-windows](https://github.com/coreybutler/node-windows) for other operations such as uninstalling the service.

## Deploy to Kubernetes

_NotifyBC_ provides a [container package](https://github.com/orgs/bcgov/packages/container/package/notify-bc) in GitHub Container Registry and a [Helm](https://helm.sh/) chart to facilitate Deploying to Kubernetes. Azure AKS and OpenShift are the two tested platforms. Other Kubernetes platforms are likely to work subject to customizations. Before deploying to AKS, [create an ingress controller
](https://docs.microsoft.com/en-us/azure/aks/ingress-basic#create-an-ingress-controller).

The deployment can be initiated from localhost or automated by CI service such as Jenkins. Regardless, at the initiator's side following software needs to be installed:

- git
- Platform-specific CLI such as [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/) or [OpenShift CLI](https://docs.openshift.org/latest/cli_reference/index.html)
- [Helm CLI](https://helm.sh/docs/intro/install/)

To install,

1. Follow your platform's instruction to login to the platform. For AKS, run `az login` and `az aks get-credentials`; for OpenShift, run `oc login`
2. Run

   ```sh
   git clone https://github.com/bcgov/NotifyBC.git
   cd NotifyBC
   helm install -gf helm/platform-specific/<platform>.yaml helm
   ```

   replace \<platform\> with _openshift_ or _aks_ depending on your platform.

   The above commands create following artifacts:

   - 1 stateful set of 3 pods running a MongoDB replicaset
   - 1 stateful set of 3 pods running a Redis sentinel
   - 2 deployments - _notify-bc-app_ and _notify-bc-cron_
   - 1 HPA - _notify-bc-cron_
   - 5 services - _notify-bc_, _notify-bc-smtp_, _mongodb-headless_, _redis_ and _redis-headless_
   - 3 PVCs each for one MongoDB pod
   - 3 service accounts - _notify-bc_, _mongodb_ and _redis_
   - a few config maps, most importantly _notify-bc_
   - a few secrets, most importantly _mongodb_ and _redis_, containing credentials for Mongodb and Redis respectively
   - On AKS,
     - a _notify-bc_ ingress
   - On OpenShift,
     - 2 routes - _notify-bc-web_ and _notify-bc-smtp_

To upgrade,

```sh
helm upgrade <release-name> -f helm/platform-specific/<platform>.yaml --set mongodb.auth.rootPassword=<mongodb-root-password> --set mongodb.auth.replicaSetKey=<mongodb-replica-set-key> --set mongodb.auth.password=<mongodb-password> helm
```

replace \<release-name\> with installed helm release name and \<platform\> with _openshift_ or _aks_ depending on your platform. MongoDB credentials \<mongodb-root-password\>, \<mongodb-replica-set-key\> and \<mongodb-password\> can be found in secret _\<release-name\>-mongodb_. It is recommended to specify mongodb credentials in a file rather than command line. See [Customizations](#customizations) below.

To uninstall,

```sh
helm uninstall <release-name>
```

replace \<release-name\> with installed helm release name.

### Customizations

Various customizations can be made to chart. Some are platform dependent. To customize, first create a file with extension _.local.yaml_. The rest of the document assumes the file is _helm/values.local.yaml_. Then add customized parameters to the file. See _helm/values.yaml_ and Bitnami MongoDB chart [readme](https://github.com/bitnami/charts/tree/master/bitnami/mongodb) for customizable parameters. Parameters in _helm/values.local.yaml_ overrides corresponding ones in _helm/values.yaml_. In particular, parameters under _mongodb_ of _helm/values.local.yaml_ overrides Bitnami MongoDB chart parameters.

To apply customizations, add `-f helm/values.local.yaml` to the helm command after `-f helm/platform-specific/<platform>.yaml`. For example, to install chart with customization on OpenShift,

```sh
helm install -gf helm/platform-specific/openshift.yaml -f helm/values.local.yaml helm
```

to upgrade an existing release with customization on OpenShift,

```sh
helm upgrade <release-name> -f helm/platform-specific/openshift.yaml -f helm/values.local.yaml helm
```

::: tip Backup <i>helm/values.local.yaml</i>
Backup _helm/values.local.yaml_ to a private secured SCM is highly recommended, especially for production environment.
:::

Following are some common customizations

- Update _config.local.js_ in ConfigMap, for example to define _httpHost_

  ```yaml
  # in file helm/values.local.yaml
  configMap:
    config.local.js: |-
      module.exports = {
        httpHost: 'https://myNotifyBC.myOrg.com',
      }
  ```

- Set hostname on AKS,
  ```yaml
  # in file helm/values.local.yaml
  ingress:
    hosts:
      - host: myNotifyBC.myOrg.com
        paths:
          - path: /
  ```
- Use [Let's Encrypt on AKS](https://docs.microsoft.com/en-us/azure/aks/ingress-tls). After following the instructions in the link, add following ingress customizations to file _helm/values.local.yaml_

  ```yaml
  # in file helm/values.local.yaml
  ingress:
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt
    tls:
      - secretName: tls-secret
        hosts:
          - notify-bc.local
  ```

- Route host names on Openshift are by default auto-generated. To set to fixed values

  ```yaml
  # in file helm/values.local.yaml
  route:
    web:
      host: 'myNotifyBC.myOrg.com'
    smtp:
      host: 'smtp.myNotifyBC.myOrg.com'
  ```

- Add certificates to OpenShift web route

  ```yaml
  # in file helm/values.local.yaml
  route:
    web:
      tls:
        caCertificate: |-
          -----BEGIN CERTIFICATE-----
          ...
          -----END CERTIFICATE-----
        certificate: |-
          -----BEGIN CERTIFICATE-----
          ...
          -----END CERTIFICATE-----
        insecureEdgeTerminationPolicy: Redirect
        key: |-
          -----BEGIN PRIVATE KEY-----
          ...
          -----END PRIVATE KEY-----
  ```

- MongoDb

  _NotifyBC_ chart depends on [Bitnami MongoDB chart](https://github.com/bitnami/charts/tree/master/bitnami/mongodb) for MongoDB database provisioning. All documented parameters are customizable under _mongodb_. For example, to change _architecture_ to _standalone_

  ```yaml
  # in file helm/values.local.yaml
  mongodb:
    architecture: standalone
  ```

  To set credentials,

  ```yaml
  # in file helm/values.local.yaml
  mongodb:
    auth:
      rootPassword: <secret>
      replicaSetKey: <secret>
      passwords:
        - <secret>
  ```

  To install a Helm chart, the above credentials can be randomly defined. To upgrade an existing release, they must match what's defined in secret _\<release-name\>-mongodb_.

- Redis

  _NotifyBC_ chart depends on [Bitnami Redis chart](https://github.com/bitnami/charts/tree/master/bitnami/redis) for Redis provisioning. All documented parameters are customizable under _redis_. For example, to set credential

  ```yaml
  # in file helm/values.local.yaml
  redis:
    auth:
      password: <secret>
  ```

  To install a Helm chart, the above credential can be randomly defined. To upgrade an existing release, It must match what's defined in secret _\<release-name\>-redis_.

- Both Bitnami MongoDB and Redis use Docker Hub for docker registry. Rate limit imposed by Docker Hub can cause runtime problems. If your organization has JFrog artifactory, you can change the registry

```yaml
# in file helm/values.local.yaml
global:
  imageRegistry: <artifactory.myOrg.com>
  imagePullSecrets:
    - <docker-pull-secret>
```

The above settings assume you have setup secret \<docker-pull-secret\> to access \<artifactory.myOrg.com\>. The secret can be created using [kubectl](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line).

- Enable scheduled MongoDB backup CronJob

  ```yaml
  # in file helm/values.local.yaml
  cronJob:
    enabled: true
    schedule: '1 0 * * *'
    retentionDays: 7
    timeZone: UTC
    persistence:
      size: 5Gi
  ```

  where

  - enabled: whether to enable the MongoDB backup CronJob or not; default to `false`
  - schedule: the Unix crontab schedule; default to `'1 0 * * *'` which runs daily at 12:01AM
  - retentionDays: how many days the backup is retained; default to `7`
  - timeZone: the Unix TZ environment variable; default to `UTC`
  - persistence size: size of PVC; default to `5Gi`

  The CronJob backs up MongoDB to a PVC named after the chart with suffix _-cronjob-mongodb-backup_ and purges backups that are older than _retentionDays_.

  To facilitate restoration, mount the PVC to MongoDB pod

  ```yaml
  # in file helm/values.local.yaml
  mongodb:
    extraVolumes:
      - name: export
        persistentVolumeClaim:
          claimName: <PVC_NAME>
    extraVolumeMounts:
      - name: export
        mountPath: /export
        readOnly: true
  ```

  Restoration can then be achieved by running in MongoDB pod

  ```bash
  mongorestore -u "$MONGODB_EXTRA_USERNAMES" -p"$MONGODB_EXTRA_PASSWORDS" \
  --uri="mongodb://$K8S_SERVICE_NAME" --db $MONGODB_EXTRA_DATABASES --gzip --drop \
  --archive=/export/<mongodb-backup-YYMMDD-hhmmss.gz>
  ```

- _NotifyBC_ image tag defaults to _appVersion_ in file _helm/Chart.yaml_. To change to _latest_, i.e. tip of the _main_ branch,

  ```yaml
  # in file helm/values.local.yaml
  image:
    tag: latest
  ```

- Enable autoscaling for app pod

  ```yaml
  # in file helm/values.local.yaml
  autoscaling:
    enabled: true
  ```

## Deploy Docker Container

If you have git and Docker installed, you can run following command to deploy _NotifyBC_ Docker container:

```sh
docker run --platform linux/amd64 --rm -dp 3000:3000 ghcr.io/bcgov/notify-bc
# open http://localhost:3000
```

If successful, similar output is displayed as in source code installation.

<script setup>
import { useThemeData } from '@vuepress/plugin-theme-data/client';
const themeData = useThemeData();
</script>
