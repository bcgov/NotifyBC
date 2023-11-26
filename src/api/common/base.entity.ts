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

import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserProfile } from 'src/auth/dto/user-profile.dto';

@Schema()
export class BaseEntity {
  id?: string;

  @Prop({ default: Date.now })
  created?: Date;

  @Prop({ default: Date.now })
  updated?: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  createdBy?: UserProfile;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  updatedBy?: UserProfile;
}

export const BaseSchemaOptions = {
  strict: false,
  versionKey: false,
  toJSON: {
    transform: (doc: unknown, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
};
