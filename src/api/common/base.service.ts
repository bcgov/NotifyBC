import { Request } from 'express';
import { compact } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
import { CountDto } from './dto/count.dto';
export class BaseService<T> {
  constructor(protected model: Model<T>) {}

  create(createDto, req: (Request & { user?: any }) | null) {
    if (req?.user) {
      createDto.createdBy = req.user;
    }
    return new this.model(createDto).save();
  }

  async count(filter?: FilterQuery<T>): Promise<CountDto> {
    const castedFilter = this.model.countDocuments(filter).cast();
    const res = await this.model
      .aggregate(
        compact([
          {
            $addFields: {
              id: '$_id',
            },
          },
          filter && {
            $match: castedFilter,
          },
          {
            $count: 'count',
          },
        ]),
      )
      .exec();
    return res[0];
  }

  findAll(filter: any = {}) {
    const { where, fields, order, skip, limit } = filter;
    const castedWhere = this.model.find(where).cast();
    return this.model
      .aggregate(
        compact([
          {
            $addFields: {
              id: '$_id',
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
              id: '$_id',
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

  findOne(id: string) {
    return this.model.findById(id).exec();
  }

  update(id: string, updateDto, req: (Request & { user?: any }) | null) {
    if (req?.user) {
      updateDto.updatedBy = req.user;
      updateDto.updated = new Date();
    }
    return this.model.findByIdAndUpdate(id, updateDto).exec();
  }

  replaceById(
    _id: string,
    updateDto,
    req: (Request & { user?: any }) | null,
    upsert: boolean = false,
  ) {
    return this.findOneAndReplace(updateDto, { _id }, req, upsert);
  }

  async findOneAndReplace(
    updateDto,
    filter: FilterQuery<T> | null,
    req: (Request & { user?: any }) | null,
    upsert: boolean = false,
  ) {
    if (req?.user) {
      updateDto.updatedBy = req.user;
      updateDto.updated = new Date();
    }
    const res = await this.model
      .findOneAndUpdate(filter, updateDto, {
        upsert,
        new: true,
        includeResultMetadata: true,
      })
      .exec();
    if (upsert && !res.lastErrorObject.updatedExisting) {
      await this.model.findByIdAndUpdate(res.value._id, {
        createdBy: req.user,
      });
    }
    return res.value;
  }

  remove(id: string) {
    this.model.findByIdAndRemove(id).exec();
  }

  async removeAll(filter?: FilterQuery<T>) {
    const castedFilter = this.model.countDocuments(filter).cast();
    const res = await this.model
      .aggregate(
        compact([
          {
            $addFields: {
              id: '$_id',
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
