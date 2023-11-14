import { Request } from 'express';
import { compact } from 'lodash';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { CountDto } from './dto/count.dto';
export class BaseService<T> {
  constructor(protected model: Model<T>) {}

  async create(
    createDto,
    req?: (Request & { user?: any }) | null,
    options?,
  ): Promise<T> {
    if (req?.user) {
      createDto.createdBy = req.user;
    }
    return (await new this.model(createDto).save(options)).toJSON();
  }

  async count(where?: FilterQuery<T>): Promise<CountDto> {
    const castedFilter = this.model.countDocuments(where).cast();
    const res = await this.model
      .aggregate(
        compact([
          {
            $addFields: {
              id: { $toString: '$_id' },
            },
          },
          where && {
            $match: castedFilter,
          },
          {
            $count: 'count',
          },
        ]),
      )
      .exec();
    return res[0] ?? { count: 0 };
  }

  async findAll(
    filter: any = {},
    req?: Request & { user: UserProfile },
  ): Promise<T[]> {
    let { where, fields, order, skip, limit, include } = filter;
    let qry = this.model.find(this.model.translateAliases(where));
    order && qry.sort(this.model.translateAliases(order));
    skip && qry.skip(skip);
    limit && qry.limit(limit);
    fields && qry.select(this.model.translateAliases(fields));
    include && qry.populate(include);
    return await qry.exec();
  }

  async findOne(
    filter: any = {},
    req?: Request & { user: UserProfile },
  ): Promise<T> {
    const res = await this.findAll({ ...filter, limit: 1 });
    return res && res[0];
  }

  async updateAll(
    updateDto,
    filter: FilterQuery<T> | null,
    req: (Request & { user?: any }) | null,
  ) {
    if (req?.user) {
      updateDto.updatedBy = req.user;
      updateDto.updated = new Date();
    }
    const res = await this.model
      .updateMany(this.model.translateAliases(filter), updateDto)
      .exec();
    return { count: res.modifiedCount };
  }

  async findById(id: string, options?): Promise<T> {
    const q = this.model.findById(id);
    if (options?.include) {
      q.populate(options.include);
    }
    return (await q.exec()).toJSON({ virtuals: !!options?.include });
  }

  async updateById(
    id: string,
    updateDto,
    req?: (Request & { user?: any }) | null,
    options?: QueryOptions<T>,
  ) {
    if (req?.user) {
      updateDto.updatedBy = req.user;
      updateDto.updated = new Date();
    }
    delete updateDto.id;
    return this.model.findByIdAndUpdate(id, updateDto, options).exec();
  }

  replaceById(
    _id: string,
    updateDto,
    req: (Request & { user?: any }) | null,
    upsert: boolean = false,
  ): Promise<T> {
    delete updateDto.id;
    return this.findOneAndReplace(updateDto, { _id }, req, upsert);
  }

  async findOneAndReplace(
    updateDto,
    filter: FilterQuery<T> | null,
    req: (Request & { user?: any }) | null,
    upsert: boolean = false,
    options?: QueryOptions<T>,
  ): Promise<T> {
    if (req?.user) {
      updateDto.updatedBy = req.user;
      updateDto.updated = new Date();
    }
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
    return this.model.findByIdAndRemove(id, options).exec();
  }

  async removeAll(
    filter?: FilterQuery<T>,
    req?: Request & { user: UserProfile },
    options?: QueryOptions,
  ) {
    const res = await this.model
      .deleteMany(this.model.translateAliases(filter), options)
      .exec();
    return { count: res.deletedCount };
  }
}
