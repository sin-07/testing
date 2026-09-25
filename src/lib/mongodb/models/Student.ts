/**
 * Student Model - MongoDB Schema for Student Registrations
 * 
 * This model stores all student registration data including:
 * - Personal information (name, email, mobile, date of birth)
 * - Registration details (roll number, center assignment)
 * - Smart proximity routing history (was_reallocated, preferred_center)
 * - Status tracking (registration status, email sent)
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

// TypeScript interface for type safety
export interface IStudent extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  mobile: string
  dob: Date
  roll_no: string
  selected_center: string
  allotted_center_id: mongoose.Types.ObjectId
  allotted_center_name?: string
  was_reallocated?: boolean
  preferred_center?: string
  reallocation_reason?: string
  registration_status: 'pending' | 'confirmed' | 'cancelled'
  email_sent: boolean
  created_at: Date
  updated_at: Date
}

// MongoDB schema definition
const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    roll_no: {
      type: String,
    },
    selected_center: {
      type: String,
      required: [true, 'Center selection is required'],
    },
    allotted_center_id: {
      type: Schema.Types.ObjectId,
      ref: 'Center',
      required: [true, 'Center allotment is required'],
    },
    was_reallocated: {
      type: Boolean,
      default: false,
    },
    preferred_center: {
      type: String,
      default: '',
    },
    reallocation_reason: {
      type: String,
      default: '',
    },
    registration_status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
    email_sent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

// Database indexes for query optimization and uniqueness enforcement
StudentSchema.index({ email: 1 }, { unique: true })
StudentSchema.index({ mobile: 1 }, { unique: true })
StudentSchema.index({ roll_no: 1 }, { unique: true, sparse: true })
StudentSchema.index({ allotted_center_id: 1 })
StudentSchema.index({ selected_center: 1 })

// Prevent model recompilation error in Next.js development mode
const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema)

export default Student
