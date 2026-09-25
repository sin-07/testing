/**
 * Center Model - MongoDB Schema for Examination Centers
 * 
 * This model represents an examination center with:
 * - name: Unique center name (e.g., "Patna", "Gaya")
 * - code: Center code (e.g., "PAT-01")
 * - location: Full address / venue details
 * - location_order: Sequence number (1 to 10)
 * - city: City name
 * - capacity: Maximum students allowed (fixed at 8)
 * - filled_count: Current number of registered students
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

// TypeScript interface for type safety
export interface ICenter extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  code?: string
  location?: string
  location_order?: number
  city?: string
  capacity: number
  filled_count: number
  created_at: Date
  updated_at: Date
}

// MongoDB schema definition
const CenterSchema = new Schema<ICenter>(
  {
    name: {
      type: String,
      required: [true, 'Center name is required'],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: function (this: ICenter) {
        return (this.name || 'CEN').substring(0, 3).toUpperCase() + '-01'
      },
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    location_order: {
      type: Number,
      default: 1,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    capacity: {
      type: Number,
      required: true,
      default: 8,
      min: [1, 'Capacity must be at least 1'],
    },
    filled_count: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Filled count cannot be negative'],
      validate: {
        validator: function (this: ICenter, value: number) {
          return value >= 0 && value <= this.capacity
        },
        message: 'Filled count must be between 0 and capacity',
      },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

// Database indexes for query optimization
CenterSchema.index({ name: 1 }, { unique: true })
CenterSchema.index({ filled_count: 1, capacity: 1 })
CenterSchema.index({ location_order: 1 })

// Prevent model recompilation error in Next.js development mode
const Center: Model<ICenter> =
  mongoose.models.Center || mongoose.model<ICenter>('Center', CenterSchema)

export default Center
