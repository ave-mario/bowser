import { Schema, Model, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IEmployee } from '../interfaces';
import { Validate, statusUsers } from '../enums';
import { logicErr } from '../errors';

export interface IEmployeeModel extends IEmployee, Document {
  comparePassword(candidatePassword: string): Promise<Error | boolean>;
}

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
    patronymic: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      validate: Validate.password
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      validate: Validate.phoneNumber
    },
    address: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      required: true,
      default: statusUsers.ChangePassword
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

function hashPassword(next: () => void) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
}

schema.pre('save', hashPassword);
schema.pre('update', hashPassword);

schema.post(
  'save',
  (error: any, doc: any, next: (error: Error) => void): void => {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error(logicErr.userIsAlreadyRegistered.msg));
    } else {
      next(error);
    }
  }
);

schema.methods.comparePassword = function(candidatePassword: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, success) => {
      if (err) return reject(err);
      return resolve(success);
    });
  });
};

schema.set('toObject', {
  transform: function(doc: {}, ret: any): void {
    delete ret.__v;
    delete ret.password;
  }
});

export const Employee: Model<IEmployeeModel> = model<IEmployeeModel>('Employees', schema);
