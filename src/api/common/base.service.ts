import { compact } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
export class BaseService<T> {
  constructor(private model: Model<T>) {}

  create(createDto) {
    const createdConfiguration = new this.model(createDto);
    return createdConfiguration.save();
  }

  count(filter?: FilterQuery<T>) {
    return this.model.count(filter).exec();
  }

  findAll(filter: any = {}) {
    const { where, fields, order, skip, limit } = filter;
    return this.model
      .aggregate(
        compact([
          {
            $addFields: {
              id: { $toString: '$_id' },
            },
          },
          where && {
            $match: where,
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

  updateAll(updateDto, filter?: FilterQuery<T>) {
    return this.model.updateMany(filter, updateDto).exec();
  }

  findOne(id: string) {
    return this.model.findById(id).exec();
  }

  update(id: string, updateDto) {
    return this.model.findByIdAndUpdate(id, updateDto).exec();
  }

  replaceById(_id: string, updateDto) {
    return this.model.findOneAndReplace({ _id }, updateDto).exec();
  }

  remove(id: string) {
    this.model.findByIdAndRemove(id).exec();
  }
}
