import {
  inject,
  Application,
  CoreBindings,
  lifeCycleObserver, // The decorator
  LifeCycleObserver,
  CoreTags, // The interface
} from '@loopback/core';

interface SmtpServer {
  listen(port: number): void;
  close(callback?: Function): void;
}

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('server')
export class SmtpServerObserver implements LifeCycleObserver {
  smtpServer: SmtpServer;
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    const appConfig = await this.app.get<any>(CoreBindings.APPLICATION_CONFIG);
    const smtpSvr = appConfig.inboundSmtpServer;
    if (!smtpSvr.enabled) {
      return;
    }
    // get a handle of server in order to be able to stop
    this.smtpServer = await require('./smtp-server').app(appConfig);
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    return new Promise(resolve => {
      this.smtpServer.close(() => resolve());
    });
  }
}
