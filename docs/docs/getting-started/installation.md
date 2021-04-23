---
permalink: /docs/installation/
---

# Installation

_NotifyBC_ can be installed in 3 ways:

1. [deploying locally from source code](#deploy-locally-from-source-code)
2. [deploying a Docker container](#deploy-docker-container)
3. [deploying to Kubernetes](#deploy-to-kubernetes)

For small-scale production deployment or for evaluation, both source code and docker container will do. For large-scale production deployment that requires horizontal scalability, the recommendation is one of

- deploying to Kubernetes
- setting up a load balanced app cluster from source code build, backed by MongoDB.

To setup a development environment in order to contribute to _NotifyBC_,
installing from source code is preferred.

## Deploy Locally from Source Code

### System Requirements

- Software
  - Git
  - [Node.js](https://nodejs.org)@>=14.5.0
  - openssl (if enable HTTPS)
- Services
  - MongoDB, optional but recommended for production
  - A standard SMTP server to deliver outgoing email, optional but recommended for production.
  - A tcp proxy server such as [nginx stream proxy](http://nginx.org/en/docs/stream/ngx_stream_proxy_module.html) if list-unsubscribe by email is needed and _NotifyBC_ server cannot expose port 25 to internet
  - A SMS service provider account if needs to enable SMS channel. The supported service providers are
    - Twilio (default)
    - Swift
  - SiteMinder, if need to allow SiteMinder authenticated user request
  - OIDC provide, if need to allow OIDC authenticated user request
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
npm i -g yarn && yarn install && yarn build
yarn start
```

If successful, you will see following output

```
...
Server is running at http://0.0.0.0:3000
```

Now browse to <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> the page displays NotifyBC Web Console.

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
  npm i -g yarn
  yarn config set proxy http://my_proxy:8080
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

## Deploy Docker Container

If you have git and Docker installed, you can run following command to deploy _NotifyBC_ Docker container:

```sh
git clone https://github.com/bcgov/NotifyBC.git
cd NotifyBC
docker build -t notify-bc .
docker run -p 3000:3000 notify-bc
```

If successful, similar output is displayed as in source code installation.

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

   - A MongoDB cluster with 2 nodes and 1 arbiter, each implemented as a stateful set
   - Two deployments - _notify-bc-app_ and _notify-bc-cron_
   - Three services - _notify-bc_, _mongodb-headless_ and _mongodb-arbiter-headless_
   - Two PVCs each for one MongoDB node
   - Two config maps - _notify-bc_ and _mongodb-scripts_
   - Two service accounts - _notify-bc_ and _mongodb_
   - One more more secrets, with the most important one being _mongodb_, containing MongoDB connection credentials
   - On AKS,
     - a _notify-bc-smtp_ service of type _LoadBalancer_ for [inbound smtp server](../config/inboundSmtpServer.md)
     - a _notify-bc_ ingress
   - On OpenShift,
     - 2 routes - _notify-bc-web_ and _notify-bc-smtp_

To upgrade,

```sh
helm upgrade <release-name> -f helm/platform-specific/<platform>.yaml --set mongodb.auth.rootPassword=<mongodb-root-password> --set mongodb.auth.replicaSetKey=<mongodb-replica-set-key> --set mongodb.auth.password=<mongodb-password> helm
```

replace \<release-name\> with installed helm release name and \<platform\> with _openshift_ or _aks_ depending on your platform. \<mongodb-root-password\>, \<mongodb-replica-set-key\> and \<mongodb-password\> can be found in _mongodb_ secret.

To uninstall,

```sh
helm uninstall <release-name>
```

replace \<release-name\> with installed helm release name.

### Customizations

Various customizations can be made to chart. Some are platform dependent. To customize, first create a file with extension _.local.yaml_. The rest of the document assumes the file is _helm/values.local.yaml_. Then add customized values to the file. To apply customization, add `-f helm/values.local.yaml` to the helm command after `-f helm/platform-specific/<platform>.yaml`. For example, to run `helm install` with customization,

```sh
helm install -gf helm/platform-specific/<platform>.yaml -f helm/values.local.yaml helm
```

::: tip Backup <i>helm/values.local.yaml</i>
Backup _helm/values.local.yaml_ to a private secured SCM is highly recommended, especially for production environment.
:::

Following are some example customizations.

- To set hostname on AKS,
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

- Route host names on Openshift are by default auto-generated. To set to fix values

  ```yaml
  # in file helm/values.local.yaml
  route:
    web:
      host: 'myNotifyBC.myOrg.com'
    smtp:
      host: 'smtp.myNotifyBC.myOrg.com'
  ```

- To add certificates to OpenShift web route

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

- To update _config.local.js_ in config map,

  ```yaml
  # in file helm/values.local.yaml
  configMap:
    config.local.js: |-
      module.exports = {
        httpHost: 'https://myNotifyBC.myOrg.com',
        internalHttpHost: 'http://{{include "NotifyBC.fullname" .}}:{{ .Values.service.web.port }}',
        inboundSmtpServer: {
          listeningSmtpPort: 2525,
          options: {
            {{- if not (.Values.service.smtp.enabled) }}
            secure: true
            {{- end }}
          }
        }
      }
  ```

- MongoDb

  _NotifyBC_ chart depends on [Bitnami MongoDB chart](https://github.com/bitnami/charts/tree/master/bitnami/mongodb) for MongoDB database provisioning. All documented parameters are customizable by adding _mongodb._ prefix. For example, to change _architecture_ to _standalone_

  ```yaml
  # in file helm/values.local.yaml
  mongodb:
    architecture: standalone
  ```

* _NotifyBC_ image tag defaults to latest published version. To change to _latest_, i.e. tip of the _main branch_,

  ```yaml
  # in file helm/values.local.yaml
  image:
    tag: latest
  ```

## Deploy to OpenShift (deprecated)

::: warning Use Helm for OpenShift
The OpenShift template documented in the rest of this section is deprecated and will be removed in next major release. Please follow [Deploy to Kubernetes](#deploy-to-kubernetes) to install using Helm. To migrate from OpenShift template, follow [OpenShift template to Helm](../miscellaneous/migration.md#openshift-template-to-helm).
:::

_NotifyBC_ supports deployment to OpenShift Origin of minimum version 1.5, or other compatible platforms such as OpenShift Container Platform of matching version. [OpenShift instant app templates](https://github.com/bcgov/NotifyBC/blob/main/.opensift-templates) have been created to facilitate build and deployment. This template adopts [source-to-image strategy](https://docs.openshift.org/latest/dev_guide/builds.html#using-secrets-s2i-strategy) with [binary source](https://docs.openshift.org/latest/dev_guide/builds.html#binary-source) input and supports [incremental builds](https://docs.openshift.org/latest/dev_guide/builds.html#incremental-builds).

To deploy to OpenShift, you need to have access to relevant OpenShift projects with minimum edit role. This implies you know and have access to OpenShift web console as identified by _\<openshift-console-url\>_ below.

OpenShift is expected to be setup this way:

- 1 project for build. This project is identified by _\<yourprojectname-tools\>_ below. All build related activities take place in this project.
- 1 or more projects for runtime environments such as _dev_, _test_ etc, identified by _\<yourprojectname-\<env\>>_ below. All deployment activities and runtime artifacts are contained in respective projects to make an environment self-sufficient.

The deployment can be initiated from localhost or automated by CI service such as Jenkins. Regardless, at the initiator's side following software needs to be installed:

- git
- [OpenShift CLI](https://docs.openshift.org/latest/cli_reference/index.html)

If using Jenkins, all the software are pre-installed on OpenShift provided Jenkins instant-app template so it is the preferred CI environment. Instructions below assumes OpenShift Jenkins is used. OpenShift Jenkins should be created in project _\<yourprojectname-tools\>_.

### Hosting Environment Setup

1. Install the templates

   ```sh
   git clone https://github.com/bcgov/NotifyBC.git
   cd NotifyBC
   oc login -u <username> -p <password> <openshift-console-url>
   oc create -f .openshift-templates/notify-bc-build.yml -n <yourprojectname-tools>
   oc create -f .openshift-templates/notify-bc.yml -n <yourprojectname-<env>>
   ```

   After this step you will find an instant app template called _notify-bc-build_ available in the _\<yourprojectname-tools\>_ project and _notify-bc_ in the _\<yourprojectname-\<env\>>_ project.

2) create OpenShift apps by clicking _Add to Project_ in web console of respective projects, select JavaScript in languages catalog, and click either _notify-bc-build_ or _notify-bc_ template. Adjust parameters as you see fit.
3) (optional) update instance-specific [configuration](../config-overview/) files by modifying configMap _notify-bc_. To do so, in web console of a runtime environment project, click _Resources > Config Maps > notify-bc > Actions > Edit_. Each config file corresponds to an item in configMap with key being the file name.

::: tip backup config files
Backup config files to a private secured SCM outside of OpenShift is highly recommended, especially for production environment.
:::

### Build

To build runtime image manually from localhost, run

```sh
oc start-build notify-bc --follow --wait --from-dir=. -n <yourprojectname-tools>
```

If build is successful, you will find image _\<yourprojectname-tools\>/notify-bc:latest_ is updated.

To initiate the build from Jenkins, create a new Freestyle project. Set _Source Code Management_ to Git repository https://github.com/bcgov/NotifyBC.git and add a _Execute Shell_ build step with the command.

Proper authorization is needed for Jenkins to access OpenShift. The service account used by Jenkins has to be granted edit role in all projects by running

```sh
oc policy add-role-to-user edit system:serviceaccount:<yourprojectname-tools>:<jenkins-service-name> -n <yourprojectname-tools>
oc policy add-role-to-user edit system:serviceaccount:<yourprojectname-tools>:<jenkins-service-name> -n <yourprojectname-<env>>
```

replace _\<jenkins-service-name\>_ with the jenkins service name. In some editions of OpenShift, _\<jenkins-service-name\>_ is fixed to _default_. To find exact Jenkins service account, add following line to Jenkins shell build step and inspect its build output

```sh
oc whoami
```

### Deploy

Deployment is achieved through image tagging. This guarantees the image deployed to different runtime environments are binary identical. To deploy manually from localhost, run

```sh
oc tag <yourprojectname-tools>/notify-bc:latest <yourprojectname-<env>>/notify-bc:latest
```

If the deployment is successful, you can launch _NotifyBC_ from the URL provided in _\<yourprojectname-\<env\>>_ project.

To initiate the deployment from Jenkins, add the above command to the build command in Jenkins.

### Change Propagation

To promote runtime image from one environment to another, for example from _dev_ to _test_, run

```
oc tag <yourprojectname-tools>/notify-bc:latest <yourprojectname-test>/notify-bc:latest <yourprojectname-tools>/notify-bc:test
```

The above command will deploy the latest (which should also be dev) runtime image to _test_ env. The purpose of tagging runtime image of _test_ env in both \<yourprojectname-test\>/notify-bc:latest and \<yourprojectname-tools\>/notify-bc:test is to use \<yourprojectname-tools\>/notify-bc:test as backup such that in case the image stream \<yourprojectname-test\>/notify-bc, which is used by _test_ runtime pods, is deleted inadvertently, it can be recovered from \<yourprojectname-tools\>/notify-bc:test.
