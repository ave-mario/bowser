import { Schema, Model, model } from 'mongoose';
import { ITokenIdenfied } from '../interfaces';

var schema = new Schema({
  token: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Employees',
    required: true
  }
});

export const IdentifiedToken: Model<ITokenIdenfied> = model<ITokenIdenfied>(
  'IdentifiedToken',
  schema
);
