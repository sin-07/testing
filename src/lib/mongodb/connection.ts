/**
 * MongoDB Connection Configuration
 * 
 * This file manages the MongoDB connection for the entire application.
 * It uses connection caching to prevent creating multiple connections
 * during development (hot reloads) and production usage.
 * 
 * Key features:
 * - Singleton pattern: Only one connection is maintained globally
 * - Connection pooling: MongoDB driver manages connection pool automatically
 * - Error handling: Proper timeout and retry configuration
 * - Cache management: Prevents connection leak in serverless environments
 */

import mongoose from 'mongoose'
import { Resolver } from 'dns/promises'

// Get MongoDB connection string from environment variables
const getMongoUri = () => process.env.MONGODB_URI || ''

/**
 * Resolve SRV records manually using Google DNS
 * This bypasses network DNS restrictions
 */
async function resolveSRV(hostname: string): Promise<string> {
  const resolver = new Resolver()
  resolver.setServers(['8.8.8.8', '8.8.4.4'])
  
  try {
    const records = await resolver.resolveSrv(hostname)
    if (records && records.length > 0) {
      // Sort by priority and weight
      records.sort((a, b) => a.priority - b.priority || b.weight - a.weight)
      
      // Build standard connection string from SRV records
      const hosts = records.map(r => `${r.name}:${r.port}`).join(',')
      return hosts
    }
  } catch (error) {
    console.error('❌ SRV resolution failed:', error)
  }
  
  return ''
}

/**
 * Convert mongodb+srv:// to mongodb:// by resolving SRV records
 */
async function convertSRVtoStandard(uri: string): Promise<string> {
  if (!uri.startsWith('mongodb+srv://')) {
    return uri
  }
  
  try {
    // Parse the SRV URI
    const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(.*)/)
    if (!match) {
      console.error('❌ Invalid MongoDB SRV URI format')
      return uri
    }
    
    const [, username, password, host, params] = match
    const srvHost = `_mongodb._tcp.${host}`
    
    console.log('[INFO] Resolving SRV records for:', srvHost)
    
    const hosts = await resolveSRV(srvHost)
    
    if (hosts) {
      // Construct standard MongoDB URI
      const standardUri = `mongodb://${username}:${password}@${hosts}${params}&ssl=true&authSource=admin`
      console.log('[SUCCESS] SRV resolved successfully')
      return standardUri
    }
  } catch (error) {
    console.error('❌ Error converting SRV URI:', error)
  }
  
  return uri
}

/**
 * Global cache interface for MongoDB connection
 * This ensures the connection persists across hot reloads in development
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Extend global namespace to store mongoose cache
declare global {
  var mongoose: MongooseCache | undefined
}

// Initialize cached connection
// Use existing global cache if available, otherwise create new one
let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

// Store cache in global scope
if (!global.mongoose) {
  global.mongoose = cached
}

/**
 * Connect to MongoDB Atlas with proper error handling
 * 
 * This function:
 * 1. Checks for existing cached connection
 * 2. Creates new connection if none exists
 * 3. Handles errors gracefully
 * 4. Returns the mongoose instance
 * 
 * @returns Promise<typeof mongoose> - Mongoose connection instance
 * @throws Error if connection fails
 */
export async function connectToDatabase() {
  // Return cached connection if available and connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn
  }

  // Create new connection if promise doesn't exist
  if (!cached.promise) {
    const uri = getMongoUri()
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable in .env.local')
    }
    // Convert SRV URI to standard format if needed
    const connectionUri = await convertSRVtoStandard(uri)
    
    // MongoDB connection options for stability and performance
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      retryReads: true,
    }

    // Start connection attempt
    cached.promise = mongoose.connect(connectionUri, opts)
      .then((mongoose) => {
        console.log('[SUCCESS] MongoDB connected successfully')
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message)
        cached.promise = null
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectToDatabase
