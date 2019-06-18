import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { IRoom, IPaginateModel } from '../interfaces';
import { StatusService } from '../enums';

const schema = new Schema(
  {
    numberOfRoom: {
      type: Number,
      required: true,
      unique: true
    },
    floor: {
      type: Number,
      required: true
    },
    countRooms: {
      type: Number,
      required: true
    },
    countDoubleBeds: {
      type: Number,
      required: true
    },
    countSingleBeds: {
      type: Number,
      required: true
    },
    totalNumberBeds: {
      type: Number,
      required: true
    },
    services: {
      type: [
        {
          _id: {
            type: Schema.Types.ObjectId,
            ref: 'RoomServices',
            required: true
          },
          status: {
            type: String,
            default: StatusService.Available,
            required: true
          }
        }
      ],
      required: true,
      minlength: 2
    },
    price: {
      type: Number,
      required: true
    },
    photos: {
      type: [
        {
          urlName: {
            type: String,
            required: true
          },
          name: {
            type: String,
            required: true
          }
        }
      ],
      maxlength: 15,
      minlength: 2
    },
    status: {
      type: String,
      required: true,
      default: StatusService.Available
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

schema.post('save', function(error: any, doc: any, next: (err: Error) => void): void {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Room already exist'));
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

export const Room: IPaginateModel<IRoom> = model<IRoom>('Rooms', schema);
