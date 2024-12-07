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

import { Request } from 'express';
import { FilterQuery, HydratedDocument, Model, QueryOptions } from 'mongoose';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { CountDto } from './dto/count.dto';
export class BaseService<T> {
  constructor(protected model: Model<T>) {}

  async create(createDto, req?: (Request & { user?: any }) | null, options?) {
    if (req?.user) {
      createDto.createdBy = req.user;
    }
    return (await new this.model(createDto).save(options)).toJSON();
  }

  async count(where?: FilterQuery<T>): Promise<CountDto> {
    const count = await this.model.countDocuments(
      this.model.translateAliases(where),
    );
    return { count };
  }

  async findAll(
    filter: any = {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _req?: Request & { user: UserProfile },
  ): Promise<HydratedDocument<T>[]> {
    const { where, fields, order, skip, limit, include } = filter;
    const qry = this.model.find(this.model.translateAliases(where));
    order && qry.sort(this.model.translateAliases(order));
    skip && qry.skip(skip);
    limit && qry.limit(limit);
    fields && qry.select(this.model.translateAliases(fields));
    include && qry.populate(include);
    return await qry.exec();
  }

  async findOne(
    filter: any = {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _req?: Request & { user: UserProfile },
  ) {
    const res = await this.findAll({ ...filter, limit: 1 });
    return res && res?.[0]?.toJSON();
  }

  async updateAll(
    updateDto,
    filter: FilterQuery<T> | null,
    req: (Request & { user?: any }) | null,
  ) {
    if (req?.user) {
      updateDto.updatedBy = req.user;
    }
    updateDto.updated = new Date();
    const res = await this.model
      .updateMany(this.model.translateAliases(filter), updateDto)
      .exec();
    return { count: res.modifiedCount };
  }

  async findById(id: string, options?) {
    const q = this.model.findById(id);
    if (options?.include) {
      q.populate(options.include);
    }
    return (await q.exec()).toJSON();
  }

  async updateById(
    id: string,
    updateDto,
    req?: (Request & { user?: any }) | null,
    options?: QueryOptions<T>,
  ) {
    if (req?.user) {
      updateDto.updatedBy = req.user;
    }
    updateDto.updated = new Date();
    delete updateDto.id;
    delete updateDto.createdBy;
    delete updateDto.created;
    return this.model.findByIdAndUpdate(id, updateDto, options).exec();
  }

  replaceById(
    _id: string,
    updateDto,
    req: (Request & { user?: any }) | null,
    upsert = false,
  ): Promise<T> {
    delete updateDto.id;
    return this.findOneAndReplace(updateDto, { _id }, req, upsert);
  }

  async findOneAndReplace(
    updateDto,
    filter: FilterQuery<T> | null,
    req: (Request & { user?: any }) | null,
    upsert = false,
    options?: QueryOptions<T>,
  ): Promise<T> {
    if (req?.user) {
      updateDto.updatedBy = req.user;
    }
    updateDto.updated = new Date();
    delete updateDto.id;
    const res = await this.model
      .findOneAndReplace(filter, updateDto, {
        ...options,
        upsert,
        new: true,
        includeResultMetadata: true,
      })
      .exec();
    if (upsert && !res.lastErrorObject.updatedExisting) {
      return this.model
        .findByIdAndUpdate(
          res.value._id,
          {
            createdBy: req.user,
          },
          options,
        )
        .exec();
    }
    return res.value;
  }

  async remove(id: string, options?: QueryOptions) {
    return this.model.findByIdAndDelete(id, options).exec();
  }

  async removeAll(
    filter?: FilterQuery<T>,
    req?: Request & { user: UserProfile },
    options?,
  ) {
    const res = await this.model
      .deleteMany(this.model.translateAliases(filter), options)
      .exec();
    return { count: res.deletedCount };
  }
}
