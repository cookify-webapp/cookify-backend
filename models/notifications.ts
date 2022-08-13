import { model, Schema, Model, Document, Types } from 'mongoose';
import { AccountInstanceInterface } from './account';

//---------------------
//   INTERFACE
//---------------------
export interface NotificationInterface extends Document {
  _id: Types.ObjectId;
  type: 'complaint' | 'follow' | 'comment';
  caption: string;
  link: string;
  receiver: Types.ObjectId & AccountInstanceInterface;
  read: boolean;
}

export interface NotificationInstanceMethods {
  // declare any instance methods here
}

export interface NotificationInstanceInterface extends NotificationInterface, NotificationInstanceMethods {}

export interface NotificationModelInterface extends Model<NotificationInstanceInterface, NotificationQueryHelpers> {
  // declare any static methods here
}

interface NotificationQueryHelpers {}

//---------------------
//   SCHEMA
//---------------------
export const notificationSchema = new Schema<
  NotificationInstanceInterface,
  NotificationModelInterface,
  NotificationInstanceMethods,
  NotificationQueryHelpers
>(
  {
    type: { type: String, enum: ['complaint', 'follow', 'comment'], required: true },
    caption: { type: String, required: true },
    link: { type: String, required: true },
    receiver: { type: 'ObjectId', ref: 'Account', required: true },
    read: { type: Boolean, required: true, default: false },
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
export const Notification = model<NotificationInstanceInterface, NotificationModelInterface>(
  'Notification',
  notificationSchema
);
