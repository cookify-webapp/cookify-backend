import constraint from '@config/constraint';
import { model, Schema, Document, Types, AggregatePaginateModel, AggregatePaginateResult } from 'mongoose';
import { AccountInstanceInterface } from './account';
import { RecipeInstanceInterface } from './recipe';
import { SnapshotInstanceInterface } from './snapshot';
import { listComplaint } from '../functions/complaintFunction';

//---------------------
//   CONFIG
//---------------------
export enum ComplaintStatus {
  FILED = 'filed', //Complaint is filed but not chosen
  EXAMINING = 'examining', //Complaint is chosen by admin and is being revised
  REJECTED = 'rejected', //Complaint is rejected
  IN_PROGRESS = 'in progress', //Complaint is sent back to author for action
  VERIFYING = 'verifying', //Complaint is modified and is pending verification
  COMPLETED = 'completed', //Complaint is complete by admin
  DELETED = 'deleted', //Complaint is complete by author deleting
}

//---------------------
//   INTERFACE
//---------------------
export interface ComplaintInterface extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId & (RecipeInstanceInterface | SnapshotInstanceInterface);
  type: 'Recipe' | 'Snapshot';
  reporter: Pick<AccountInstanceInterface, '_id' | 'username'>;
  moderator: Pick<AccountInstanceInterface, '_id' | 'username'>;
  remarks: string[];
  detail: string;
  status: ComplaintStatus;
  expiresAt?: Date;
}

export interface ComplaintInstanceMethods {
  // declare any instance methods here
}

export interface ComplaintInstanceInterface extends ComplaintInterface, ComplaintInstanceMethods {}

export interface ComplaintModelInterface extends AggregatePaginateModel<ComplaintInstanceInterface> {
  // declare any static methods here
  listComplaint: (
    page: number,
    perPage: number,
    searchWord: string,
    status: 'new' | 'processing' | 'done',
    moderator: string
  ) => Promise<AggregatePaginateResult<ComplaintInstanceInterface>>;
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
    moderator: { type: { _id: 'ObjectId', username: String } },
    remarks: [{ type: String, maxlength: constraint.remark.max }],
    detail: { type: String, required: true, maxlength: constraint.detail.max },
    status: { type: String, enum: ComplaintStatus, required: true, default: ComplaintStatus.FILED },
    expiresAt: { type: Date, expires: '30d' },
  },
  {
    autoCreate: process.env.NODE_ENV !== 'production',
    collation: { locale: 'th' },
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

//---------------------
//   STATICS
//---------------------
complaintSchema.statics.listComplaint = listComplaint;

//---------------------
//   MODEL
//---------------------
export const Complaint = model<ComplaintInstanceInterface, ComplaintModelInterface>('Complaint', complaintSchema);
