// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import http from 'http';
import { MongoMemoryServer } from 'mongodb-memory-server';
import RedisMemoryServer from 'redis-memory-server';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  private httpServers: http.Server[] = [];
  private mongoDbServers: MongoMemoryServer[] = [];
  private redisServers: RedisMemoryServer[] = [];

  public addHttpServer(server: http.Server): void {
    this.httpServers.push(server);
  }

  public addMongoDBServer(server): void {
    this.mongoDbServers.push(server);
  }

  public addRedisServer(server): void {
    this.redisServers.push(server);
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
    await Promise.all(
      this.redisServers.map(async (server) => await server.stop()),
    );
  }
}
