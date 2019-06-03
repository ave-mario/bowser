import { Schema, Model, model } from 'mongoose';
import { IClient } from '../interfaces';
import { statusUsers } from '../config/emuns';

const schema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    address: {
      type: String
    },
    status: {
      type: Number,
      required: true,
      default: statusUsers.Active
    },
    loginCode: {
      type: Number,
      min: 100000,
      max: 1000000
    },
    googleId: {
      type: String
    },
    vkontakteId: {
      type: String
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

schema.set('toObject', {
  transform: function(doc: {}, ret: any): void {
    delete ret.__v;
    delete ret.loginCode;
  }
});

export const Client: Model<IClient> = model<IClient>('Clients', schema);
