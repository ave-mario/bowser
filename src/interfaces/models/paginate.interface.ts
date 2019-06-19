/* eslint-disable @typescript-eslint/no-empty-interface */
import { PaginateModel, Document } from 'mongoose';

export interface IPaginateModel<T extends Document> extends PaginateModel<T> {}
