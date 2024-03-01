## Creating new versions of this chart
1. Update the `version` property in `helm/Chart.yaml` to the desired version number.
2. From the `helm/` directory, run the command `helm package ./` to create a `.tgz` package for the new version.
3. Move the new `.tgz` file to the `docs/` directory (`mv notify-bc-[version].tgz ../docs/helm`).
4. Update `docs/helm/index.yaml` to list the new package (`helm repo index ../docs/helm`).

## Deploying to OpenShift
1. In this example we will be deploying to `dev`, so a file named `values.dev.local.yaml` should exist and contain values specific to the `dev` instance.
1. Run `helm install dev -f platform-specific/openshift.yaml -f values.yaml -f values.dev.local.yaml ./`
    - If a deployment already exists, run `helm uninstall dev` to remove it, then repeat the command above.
1. To deploy to `test`, replace `dev` with `test` in the above example.

## Deploying BuildConfig and ImageStream for NotifyBC application
```bash
# Step 1 - Go to helm/ directory of repo
cd helm
# Step 2 - Login to OpenShift oc command line
oc login --token=secret-token --server=https://myopnshift.com
# Step 3 - Choose the tools folder
oc project 12345-tools
# step 4 - Apply deployment file
oc apply -f deployments/openshift/notify-build.yaml
```

## Restoring from database backups
If database backups are enabled (`notify-bc.cronJob.enabled: true`), backups will be created automatically on a schedule set in `notify-bc.cronJob.schedule`. Backups are saved as date-stamped .gz (gzip) files to a PersistentVolumeClaim `...notify-bc-cronjob-mongodb-backup`.
To restore from a backup:
1. Copy your OpenShift login command and paste into a terminal. Switch to the desired project (`oc project ...`).
2. Find the `RELEASE_NAME` of the app you want to restore to. This should match the name of the PersistentVolumeClaim that contains the database backups, for example if your PVC is called `example-notifybc-dev-notify-bc-cronjob-mongodb-backup`, the `RELEASE_NAME` should be `example-notifybc-dev`.
3. Determine the `BACKUP_DATE`, the date of the backup you want to restore from. For example if you want to restore from a backup created on January 25th, 2024, the `BACKUP_DATE` should be `20240125`.
   - Depending on the backup schedule there may be multiple backups performed per day in which case the latest backup from the given `BACKUP_DATE` will be used.
4. From the root of this project, run the following command:
    ```bash
    oc process -f helm/deployments/openshift/backup-restore.yaml -p RELEASE_NAME="example-notifybc-dev" -p BACKUP_DATE="20240125" | oc apply -f -
    ```
    (replacing the example values `example-notifybc-dev` and `20240125` with the values found earlier) to run the database restore job.
5. A Job and a Pod will be created to perform the restore process which can be monitored in OpenShift. Both will be cleaned up automatically a few minutes after the process is complete.
