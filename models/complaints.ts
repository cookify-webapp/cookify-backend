import constraint from '@config/constraint';
import { model, Schema, Model, Document, Types } from 'mongoose';
import { AccountInstanceInterface } from './account';
import { RecipeInstanceInterface } from './recipe';
import { SnapshotInstanceInterface } from './snapshot';

//---------------------
//   CONFIG
//---------------------
export enum ComplaintStatus {
  FILED = 'filed',
  EXAMINING = 'examining',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
}

//---------------------
//   INTERFACE
//---------------------
export interface ComplaintInterface extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId & (RecipeInstanceInterface | SnapshotInstanceInterface);
  type: 'Recipe' | 'Snapshot';
  reporter: Pick<AccountInstanceInterface, '_id' | 'username' | 'image'>;
  moderator: Pick<AccountInstanceInterface, '_id' | 'username' | 'image'>;
  detail: string;
  status: ComplaintStatus;
}

export interface ComplaintInstanceMethods {
  // declare any instance methods here
}

export interface ComplaintInstanceInterface extends ComplaintInterface, ComplaintInstanceMethods {}

export interface ComplaintModelInterface extends Model<ComplaintInstanceInterface, ComplaintQueryHelpers> {
  // declare any static methods here
}

interface ComplaintQueryHelpers {}

//---------------------
//   SCHEMA
//---------------------
export const complaintSchema = new Schema<
  ComplaintInstanceInterface,
  ComplaintModelInterface,
  ComplaintInstanceMethods,
  ComplaintQueryHelpers
>(
  {
    type: { type: String, enum: ['Recipe', 'Snapshot'], required: true },
    post: { type: 'ObjectId', refPath: 'type', required: true },
    reporter: { type: { _id: 'ObjectId', username: String }, required: true },
    moderator: { type: { _id: 'ObjectId', username: String }, required: true },
    detail: { type: String, required: true, maxlength: constraint.detail.max },
    status: { type: String, enum: ComplaintStatus, required: true },
  },
  {
    autoCreate: process.env.NODE_ENV !== 'production',
    collation: { locale: 'th' },
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

//---------------------
//   MODEL
//---------------------
export const Complaint = model<ComplaintInstanceInterface, ComplaintModelInterface>('Complaint', complaintSchema);
