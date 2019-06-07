import { Schema, Model, model } from 'mongoose';
import { ITokenModel } from '../interfaces';

var schema = new Schema({
  tokenId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    required: true,
    default: true
  }
});

export const Token: Model<ITokenModel> = model<ITokenModel>('Token', schema);
