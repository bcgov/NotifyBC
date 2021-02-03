(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{431:function(e,t,s){"use strict";s.r(t);var a=s(42),n=Object(a.a)({},(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[s("h1",{attrs:{id:"installation"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#installation"}},[e._v("#")]),e._v(" Installation")]),e._v(" "),s("p",[s("em",[e._v("NotifyBC")]),e._v(" can be installed in 3 ways:")]),e._v(" "),s("ol",[s("li",[e._v("deploying locally from source code")]),e._v(" "),s("li",[e._v("deploying a Docker container")]),e._v(" "),s("li",[e._v("deploying to OpenShift")])]),e._v(" "),s("p",[e._v("For small-scale production deployment or for evaluation, both source code and docker container will do. For large-scale production deployment that requires horizontal scalability, the recommendation is one of")]),e._v(" "),s("ul",[s("li",[e._v("deploying to OpenShift")]),e._v(" "),s("li",[e._v("setting up a load balanced app cluster from source code build, backed by mongodb.")])]),e._v(" "),s("p",[e._v("To setup a development environment in order to contribute to "),s("em",[e._v("NotifyBC")]),e._v(",\ninstalling from source code is preferred.")]),e._v(" "),s("h2",{attrs:{id:"deploy-locally-from-source-code"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#deploy-locally-from-source-code"}},[e._v("#")]),e._v(" Deploy Locally from Source Code")]),e._v(" "),s("h3",{attrs:{id:"system-requirements"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#system-requirements"}},[e._v("#")]),e._v(" System Requirements")]),e._v(" "),s("ul",[s("li",[e._v("Software\n"),s("ul",[s("li",[e._v("Git")]),e._v(" "),s("li",[s("a",{attrs:{href:"https://nodejs.org",target:"_blank",rel:"noopener noreferrer"}},[e._v("Node.js"),s("OutboundLink")],1),e._v("@>=14.5.0")])])]),e._v(" "),s("li",[e._v("Services\n"),s("ul",[s("li",[e._v("MongoDB, optional but recommended for production")]),e._v(" "),s("li",[e._v("A standard SMTP server to deliver outgoing email, optional but recommended for production. You can use an existing organizational shared service, cloud-based service such as Amazon SES, or setting up your own SMTP server")]),e._v(" "),s("li",[e._v("A tcp proxy server such as "),s("a",{attrs:{href:"http://nginx.org/en/docs/stream/ngx_stream_proxy_module.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("nginx stream proxy"),s("OutboundLink")],1),e._v(" if list-unsubscribe by email is needed and "),s("em",[e._v("NotifyBC")]),e._v(" server cannot expose port 25 to internet")]),e._v(" "),s("li",[e._v("A SMS service provider account if needs to enable SMS channel. The supported service providers are\n"),s("ul",[s("li",[e._v("Twilio (default)")])])]),e._v(" "),s("li",[e._v("SiteMinder, if need to allow authenticated user request")])])]),e._v(" "),s("li",[e._v("Network and Permissions\n"),s("ul",[s("li",[e._v("Minimum runtime firewall requirements:\n"),s("ul",[s("li",[e._v("outbound to your ISP DNS server")]),e._v(" "),s("li",[e._v("outbound to any on port 80, 443 and 22 in order to run build scripts and send SMS messages")]),e._v(" "),s("li",[e._v("outbound to any on SMTP port 25 if using direct mail; for SMTP relay, outbound to your configured SMTP server and port only")]),e._v(" "),s("li",[e._v("inbound to listening port (3000 by default) from other authorized server ips")]),e._v(" "),s("li",[e._v("if "),s("em",[e._v("NotifyBC")]),e._v(" instance will handle anonymous subscription from client browser, the listening port should be open to internet either directly or indirectly through a reverse proxy; If "),s("em",[e._v("NotifyBC")]),e._v(" instance will only handle SiteMinder authenticated webapp requests, the listening port should NOT be open to internet. Instead, it should only open to SiteMinder web agent reverse proxy.")])])]),e._v(" "),s("li",[e._v("If list-unsubscribe by email is needed, then one of the following must be met\n"),s("ul",[s("li",[s("em",[e._v("NotifyBC")]),e._v(" can bind to port 25 opening to internet")]),e._v(" "),s("li",[e._v("a tcp proxy server of which port 25 is open to internet. This proxy server can reach "),s("em",[e._v("NotifyBC")]),e._v(" on a tcp port.")])])])])])]),e._v(" "),s("h3",{attrs:{id:"installation-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#installation-2"}},[e._v("#")]),e._v(" Installation")]),e._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[e._v("ProTips™ install from behind firewall")]),e._v(" "),s("p",[e._v("If you want to install on a server behind firewall which restricts internet connection, you can work around the firewall as long as you have access to a http(s) forward proxy server. Assuming the proxy server is http://my_proxy:8080 which proxies both http and https requests, to use it:")]),e._v(" "),s("ul",[s("li",[s("p",[e._v("For Linux")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("export")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[e._v("http_proxy")]),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v("http://my_proxy:8080\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("export")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token assign-left variable"}},[e._v("https_proxy")]),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v("http://my_proxy:8080\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" config --global url."),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"https://"')]),e._v(".insteadOf git://\n")])])])]),e._v(" "),s("li",[s("p",[e._v("For Windows")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" config --global http.proxy http://my_proxy:8080\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" config --global url."),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"https://"')]),e._v(".insteadOf git://\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" config "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("set")]),e._v(" proxy http://my_proxy:8080\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" i -g "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" config "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("set")]),e._v(" proxy http://my_proxy:8080\n")])])])])])]),e._v(" "),s("p",[e._v("run following commands")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[e._v("~ $ "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\nhttps://github.com/bcgov/NotifyBC.git "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\nnotifyBC\n~ $ "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" notifyBC\n~/notifyBC $ "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" i -g "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("&&")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v("\n~/notifyBC $ "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("npm")]),e._v(" start\n")])])]),s("p",[e._v("If successful, you will see following output")]),e._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("> notification@1.0.0 start .../notification\n> node .\n\n...\nWeb server listening at: http://localhost:3000\n")])])]),s("p",[e._v("Now browse to "),s("a",{attrs:{href:"http://localhost:3000",target:"_blank"}},[e._v("http://localhost:3000")]),e._v(" the page displays NotifyBC Web Console.")]),e._v(" "),s("h4",{attrs:{id:"install-windows-service"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#install-windows-service"}},[e._v("#")]),e._v(" Install Windows Service")]),e._v(" "),s("p",[e._v("After get the app running interactively, if your server is Windows and you want to install the app as a Windows service, run")]),e._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("npm install -g node-windows\nnpm link node-windows\nnode 'windows service.js'\n")])])]),s("p",[e._v("This will create and start service "),s("em",[e._v("notifyBC")]),e._v(". To change service name, modify file "),s("em",[e._v("windows service.js")]),e._v(" before running it. See "),s("a",{attrs:{href:"https://github.com/coreybutler/node-windows",target:"_blank",rel:"noopener noreferrer"}},[e._v("node-windows"),s("OutboundLink")],1),e._v(" for other operations such as uninstalling the service.")]),e._v(" "),s("h2",{attrs:{id:"deploy-docker-container"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#deploy-docker-container"}},[e._v("#")]),e._v(" Deploy Docker Container")]),e._v(" "),s("p",[e._v("If you have git and Docker installed, you can run following command to deploy "),s("em",[e._v("NotifyBC")]),e._v(" Docker container:")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[e._v("~ $ "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\nhttps://github.com/bcgov/NotifyBC.git "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\nnotifyBC\n~ $ "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" notifyBC\n~ $ docker build -t notify-bc "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v(".")]),e._v("\n~ $ docker run -p "),s("span",{pre:!0,attrs:{class:"token number"}},[e._v("3000")]),e._v(":3000 notify-bc\n")])])]),s("p",[e._v("If successful, similar output is displayed as in source code installation.")]),e._v(" "),s("h2",{attrs:{id:"deploy-to-openshift"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#deploy-to-openshift"}},[e._v("#")]),e._v(" Deploy to OpenShift")]),e._v(" "),s("p",[s("em",[e._v("NotifyBC")]),e._v(" supports deployment to OpenShift Origin of minimum version 1.5, or other compatible platforms such as OpenShift Container Platform of matching version. "),s("a",{attrs:{href:"https://github.com/bcgov/NotifyBC/blob/main/.opensift-templates",target:"_blank",rel:"noopener noreferrer"}},[e._v("OpenShift instant app templates"),s("OutboundLink")],1),e._v(" have been created to facilitate build and deployment. This template adopts "),s("a",{attrs:{href:"https://docs.openshift.org/latest/dev_guide/builds.html#using-secrets-s2i-strategy",target:"_blank",rel:"noopener noreferrer"}},[e._v("source-to-image strategy"),s("OutboundLink")],1),e._v(" with "),s("a",{attrs:{href:"https://docs.openshift.org/latest/dev_guide/builds.html#binary-source",target:"_blank",rel:"noopener noreferrer"}},[e._v("binary source"),s("OutboundLink")],1),e._v(" input and supports "),s("a",{attrs:{href:"https://docs.openshift.org/latest/dev_guide/builds.html#incremental-builds",target:"_blank",rel:"noopener noreferrer"}},[e._v("incremental builds"),s("OutboundLink")],1),e._v(".")]),e._v(" "),s("p",[e._v("To deploy to OpenShift, you need to have access to relevant OpenShift projects with minimum edit role. This implies you know and have access to OpenShift web console as identified by "),s("em",[e._v("<openshift-console-url>")]),e._v(" below.")]),e._v(" "),s("p",[e._v("OpenShift is expected to be setup this way:")]),e._v(" "),s("ul",[s("li",[e._v("1 project for build. This project is identified by "),s("em",[e._v("<yourprojectname-tools>")]),e._v(" below. All build related activities take place in this project.")]),e._v(" "),s("li",[e._v("1 or more projects for runtime environments such as "),s("em",[e._v("dev")]),e._v(", "),s("em",[e._v("test")]),e._v(" etc, identified by "),s("em",[e._v("<yourprojectname-<env>>")]),e._v(" below. All deployment activities and runtime artifacts are contained in respective projects to make an environment self-sufficient.")])]),e._v(" "),s("p",[e._v("The deployment can be initiated from localhost or automated by CI service such as Jenkins. Regardless, at the initiator's side following software needs to be installed:")]),e._v(" "),s("ul",[s("li",[e._v("git")]),e._v(" "),s("li",[s("a",{attrs:{href:"https://docs.openshift.org/latest/cli_reference/index.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("OpenShift CLI"),s("OutboundLink")],1)])]),e._v(" "),s("p",[e._v("If using Jenkins, all the software are pre-installed on OpenShift provided Jenkins instant-app template so it is the preferred CI environment. Instructions below assumes OpenShift Jenkins is used. OpenShift Jenkins should be created in project "),s("em",[e._v("<yourprojectname-tools>")]),e._v(".")]),e._v(" "),s("h3",{attrs:{id:"hosting-environment-setup"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hosting-environment-setup"}},[e._v("#")]),e._v(" Hosting Environment Setup")]),e._v(" "),s("ol",[s("li",[s("p",[e._v("Install the templates")]),e._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[e._v("~ $ "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\nhttps://github.com/bcgov/NotifyBC.git "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\nnotifyBC\n~ $ "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("cd")]),e._v(" notifyBC\n~ $ oc login -u "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("username"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" -p "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("password"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("openshift-console-url"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n~ $ oc create -f .openshift-templates/notify-bc-build.yml -n "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-tools"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n~ $ oc create -f .openshift-templates/notify-bc.yml -n "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("env"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">>")]),e._v("\n")])])]),s("p",[e._v("After this step you will find an instant app template called "),s("em",[e._v("notify-bc-build")]),e._v(" available in the "),s("em",[e._v("<yourprojectname-tools>")]),e._v(" project and "),s("em",[e._v("notify-bc")]),e._v(" in the "),s("em",[e._v("<yourprojectname-<env>>")]),e._v(" project.")]),e._v(" "),s("p",[e._v("The template "),s("em",[e._v("notify-bc.yml")]),e._v(" creates a single instance MongoDB. If you want a 3-node MongoDB cluster, use template "),s("em",[e._v("notify-bc-mongodb-cluster.yml")]),e._v(" instead, i.e. replace last command with")]),e._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[e._v("~ $ oc create -f .openshift-templates/notify-bc-mongodb-cluster.yml -n "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("env"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">>")]),e._v("\n")])])]),s("p",[e._v("MongoDB cluster created by this template uses stateful sets. As of OpenShift 1.5, stateful set is in technology preview phase so use the feature with precaution.")])]),e._v(" "),s("li",[s("p",[e._v("create OpenShift apps by clicking "),s("em",[e._v("Add to Project")]),e._v(" in web console of respective projects, select JavaScript in languages catalog, and click either "),s("em",[e._v("notify-bc-build")]),e._v(" or "),s("em",[e._v("notify-bc")]),e._v(" template. Adjust parameters as you see fit.")])]),e._v(" "),s("li",[s("p",[e._v("(optional) create instance-specific "),s("RouterLink",{attrs:{to:"/docs/config-overview/"}},[e._v("configuration")]),e._v(" files by modifying configMap "),s("em",[e._v("notify-bc")]),e._v(". To do so, in web console of a runtime environment project, click "),s("em",[e._v("Resources > Config Maps > notify-bc > Actions > Edit")]),e._v(". Each config file corresponds to an item in configMap with key being the file name. For example, to create config file "),s("em",[e._v("config.local.json")]),e._v(", create an item with key "),s("em",[e._v("config.local.json")]),e._v(".")],1)])]),e._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[e._v("ProTips™ backup config files")]),e._v(" "),s("p",[e._v("Backup config files to a private secured SCM outside of OpenShift is highly recommended, especially for production environment.")])]),e._v(" "),s("h3",{attrs:{id:"build"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#build"}},[e._v("#")]),e._v(" Build")]),e._v(" "),s("p",[e._v("To build runtime image manually from localhost, run")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[e._v("~ $ oc start-build notify-bc --follow --wait --from-dir"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(". -n "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-tools"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n")])])]),s("p",[e._v("If build is successful, you will find image "),s("em",[e._v("<yourprojectname-tools>/notify-bc:latest")]),e._v(" is updated.")]),e._v(" "),s("p",[e._v("To initiate the build from Jenkins, create a new Freestyle project. Set "),s("em",[e._v("Source Code Management")]),e._v(" to Git repository https://github.com/bcgov/NotifyBC.git and add a "),s("em",[e._v("Execute Shell")]),e._v(" build step with the command.")]),e._v(" "),s("p",[e._v("Proper authorization is needed for Jenkins to access OpenShift. The service account used by Jenkins has to be granted edit role in all projects by running")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[e._v("~ $ oc policy add-role-to-user edit "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\nsystem:serviceaccount:"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-tools"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(":"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("jenkins-service-name"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n-n "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-tools"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n~ $ oc policy add-role-to-user edit "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\nsystem:serviceaccount:"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-tools"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(":"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("jenkins-service-name"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n-n "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("env"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">>")]),e._v("\n")])])]),s("p",[e._v("replace "),s("em",[e._v("<jenkins-service-name>")]),e._v(" with the jenkins service name. In some editions of OpenShift, "),s("em",[e._v("<jenkins-service-name>")]),e._v(" is fixed to "),s("em",[e._v("default")]),e._v(". To find exact Jenkins service account, add following line to Jenkins shell build step and inspect its build output")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[e._v("oc "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("whoami")]),e._v("\n")])])]),s("h3",{attrs:{id:"deploy"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#deploy"}},[e._v("#")]),e._v(" Deploy")]),e._v(" "),s("p",[e._v("Deployment is achieved through image tagging. This guarantees the image deployed to different runtime environments are binary identical. To deploy manually from localhost, run")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[e._v("~ $ oc tag "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-tools"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("/notify-bc:latest "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("yourprojectname-"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("env"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">>")]),e._v("/notify-bc:latest\n")])])]),s("p",[e._v("If the deployment is successful, you can launch "),s("em",[e._v("NotifyBC")]),e._v(" from the URL provided in "),s("em",[e._v("<yourprojectname-<env>>")]),e._v(" project.")]),e._v(" "),s("p",[e._v("To initiate the deployment from Jenkins, add the above command to the build command in Jenkins.")]),e._v(" "),s("h3",{attrs:{id:"change-propagation"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#change-propagation"}},[e._v("#")]),e._v(" Change Propagation")]),e._v(" "),s("p",[e._v("To promote runtime image from one environment to another, for example from "),s("em",[e._v("dev")]),e._v(" to "),s("em",[e._v("test")]),e._v(", run")]),e._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[e._v("oc tag <yourprojectname-tools>/notify-bc:latest <yourprojectname-test>/notify-bc:latest <yourprojectname-tools>/notify-bc:test\n")])])]),s("p",[e._v("The above command will deploy the latest (which should also be dev) runtime image to "),s("em",[e._v("test")]),e._v(" env. The purpose of tagging runtime image of "),s("em",[e._v("test")]),e._v(" env in both <yourprojectname-test>/notify-bc:latest and <yourprojectname-tools>/notify-bc:test is to use <yourprojectname-tools>/notify-bc:test as backup such that in case the image stream <yourprojectname-test>/notify-bc, which is used by "),s("em",[e._v("test")]),e._v(" runtime pods, is deleted inadvertently, it can be recovered from <yourprojectname-tools>/notify-bc:test.")]),e._v(" "),s("h2",{attrs:{id:"install-docs-website-optional"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#install-docs-website-optional"}},[e._v("#")]),e._v(" Install Docs Website (Optional)")]),e._v(" "),s("p",[e._v("If you want to contribute to "),s("em",[e._v("NotifyBC")]),e._v(" docs beyond simple fix ups, run")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" --cwd docs "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("yarn")]),e._v(" --cwd docs dev\n")])])]),s("p",[e._v("If everything goes well, the last line of the output will be")]),e._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" VuePress dev server listening at http://localhost:8080/NotifyBC/\n")])])]),s("p",[e._v("You can now browse to the local docs site "),s("a",{attrs:{href:"http://localhost:8080/NotifyBC/",target:"_blank",rel:"noopener noreferrer"}},[e._v("http://localhost:8080/NotifyBC"),s("OutboundLink")],1)])])}),[],!1,null,null,null);t.default=n.exports}}]);