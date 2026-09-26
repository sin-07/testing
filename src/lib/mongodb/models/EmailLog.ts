/**
 * EmailLog Model
 * MongoDB schema for tracking sent emails
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEmailLog extends Document {
  _id: mongoose.Types.ObjectId
  student_id: mongoose.Types.ObjectId
  email_type: string
  recipient_email: string
  status: 'pending' | 'sent' | 'failed'
  error_message?: string
  sent_at: Date
}

const EmailLogSchema = new Schema<IEmailLog>({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  email_type: {
    type: String,
    required: true,
  },
  recipient_email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  error_message: {
    type: String,
  },
  sent_at: {
    type: Date,
    default: Date.now,
  },
})

// Create indexes
EmailLogSchema.index({ student_id: 1 })
EmailLogSchema.index({ status: 1 })

// Prevent model recompilation in development
const EmailLog: Model<IEmailLog> =
  mongoose.models.EmailLog || mongoose.model<IEmailLog>('EmailLog', EmailLogSchema)

export default EmailLog
