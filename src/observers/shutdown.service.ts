import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import http from 'http';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  private httpServers: http.Server[] = [];
  private mongoDbServers: MongoMemoryServer[] = [];

  public addHttpServer(server: http.Server): void {
    this.httpServers.push(server);
  }

  public addMongoDBServer(server): void {
    this.mongoDbServers.push(server);
  }

  public async onApplicationShutdown(): Promise<void> {
    await Promise.all(
      this.httpServers.map(
        (server) =>
          new Promise((resolve, reject) => {
            server.close((error) => {
              if (error) {
                reject(error);
              } else {
                resolve(null);
              }
            });
          }),
      ),
    );
    await Promise.all(
      this.mongoDbServers.map(async (server) => await server.stop()),
    );
  }
}
