import { Schema, Model, model } from 'mongoose';
import { IClient } from '../interfaces';

const schema: Schema = new Schema(
  {
    fullName: {
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
      type: String,
      required: true
    },
    status: {
      type: Number,
      required: true
    },
    loginCode: {
      type: String,
      min: 8,
      max: 10
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
