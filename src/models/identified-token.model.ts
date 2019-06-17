import { Schema, Model, model } from 'mongoose';
import { ITokenIdentified } from '../interfaces';

var schema = new Schema({
  token: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Employees',
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    expires: '8h',
    default: Date.now
  }
});

export const IdentifiedToken: Model<ITokenIdentified> = model<ITokenIdentified>(
  'IdentifiedToken',
  schema
);
