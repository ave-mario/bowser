import { Schema, model } from 'mongoose';
import { IRoomService, IPaginateModel } from '../interfaces';
import mongoosePaginate from 'mongoose-paginate';

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    min: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

schema.post('save', function(error: any, doc: any, next: (err: Error) => void): void {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Service alredy exist'));
  } else {
    next(error);
  }
});

schema.set('toObject', {
  transform: function(doc: {}, ret: any): void {
    delete ret.__v;
  }
});

schema.plugin(mongoosePaginate);

export const RoomServices: IPaginateModel<IRoomService> = model<IRoomService>(
  'RoomsServices',
  schema
);
