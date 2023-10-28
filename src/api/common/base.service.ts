import { Request } from 'express';
import { compact } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { CountDto } from './dto/count.dto';
export class BaseService<T> {
  constructor(protected model: Model<T>) {}

  async create(createDto, req?: (Request & { user?: any }) | null): Promise<T> {
    if (req?.user) {
      createDto.createdBy = req.user;
    }
    return (await new this.model(createDto).save()).toJSON();
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

  findAll(
    filter: any = {},
    req?: Request & { user: UserProfile },
  ): Promise<T[]> {
    let { where, fields, order, skip, limit } = filter;
    if (fields instanceof Array) {
      fields = fields.reduce((p, c) => {
        p[c] = true;
        return p;
      }, {});
    }
    const castedWhere = this.model.find(where).cast();
    return this.model
      .aggregate(
        compact([
          {
            $addFields: {
              id: { $toString: '$_id' },
            },
          },
          where && {
            $match: castedWhere,
          },
          order && {
            $sort: order,
          },
          skip && {
            $skip: skip,
          },
          limit && { $limit: limit },
          {
            $project: { ...fields, _id: false },
          },
        ]),
      )
      .exec();
  }

  async findOne(
    filter: any = {},
    req?: Request & { user: UserProfile },
  ): Promise<T> {
    const res = await this.findAll({ ...filter, limit: 1 });
    return res && res[0];
  }

  updateAll(
    updateDto,
    filter: FilterQuery<T> | null,
    req: (Request & { user?: any }) | null,
  ) {
    if (req?.user) {
      updateDto.updatedBy = req.user;
      updateDto.updated = new Date();
    }

    const castedFilter = this.model.find(filter).cast();
    return this.model
      .aggregate(
        compact([
          {
            $addFields: {
              id: { $toString: '$_id' },
            },
          },
          filter && {
            $match: castedFilter,
          },
          {
            $addFields: updateDto,
          },
          { $unset: 'id' },
          {
            $merge: {
              into: this.model.collection.name,
              on: '_id',
              whenMatched: 'replace',
              whenNotMatched: 'fail',
            },
          },
        ]),
      )
      .exec();
  }

  async findById(id: string): Promise<T> {
    return (await this.model.findById(id).exec()).toJSON();
  }

  updateById(id: string, updateDto, req?: (Request & { user?: any }) | null) {
    if (req?.user) {
      updateDto.updatedBy = req.user;
      updateDto.updated = new Date();
    }
    delete updateDto.id;
    return this.model.findByIdAndUpdate(id, updateDto).exec();
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
  ): Promise<T> {
    if (req?.user) {
      updateDto.updatedBy = req.user;
      updateDto.updated = new Date();
    }
    delete updateDto.id;
    const res = await this.model
      .findOneAndReplace(filter, updateDto, {
        upsert,
        new: true,
        includeResultMetadata: true,
      })
      .exec();
    if (upsert && !res.lastErrorObject.updatedExisting) {
      return this.model
        .findByIdAndUpdate(res.value._id, {
          createdBy: req.user,
        })
        .exec();
    }
    return res.value;
  }

  remove(id: string) {
    this.model.findByIdAndRemove(id).exec();
  }

  async removeAll(
    filter?: FilterQuery<T>,
    req?: Request & { user: UserProfile },
  ) {
    const castedFilter = this.model.countDocuments(filter).cast();
    const res = await this.model
      .aggregate(
        compact([
          {
            $addFields: {
              id: { $toString: '$_id' },
            },
          },
          filter && {
            $match: castedFilter,
          },
          {
            $project: { _id: true },
          },
        ]),
      )
      .exec();
    const ids = res.map((e) => e._id);
    await this.model.deleteMany({ _id: { $in: ids } }).exec();
    return { count: ids.length };
  }
}
