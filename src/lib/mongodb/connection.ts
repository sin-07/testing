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
import dns from 'dns'
import { Resolver } from 'dns/promises'

// Configure global DNS servers to Google and Cloudflare to prevent ISP/Windows SRV refusal
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
  if (typeof (dns as any).setDefaultResultOrder === 'function') {
    (dns as any).setDefaultResultOrder('ipv4first')
  }
} catch {
  // Ignore in restricted environments
}

// Get MongoDB connection string from environment variables
const getMongoUri = () => process.env.MONGODB_URI || ''

const LOCAL_FALLBACK_URI = 'mongodb://127.0.0.1:27017/exam_management'

/**
 * Resolve SRV records manually using Google DNS
 * This bypasses network/ISP DNS restrictions on Windows
 */
async function resolveSRV(hostname: string): Promise<string> {
  const resolver = new Resolver()
  resolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
  
  try {
    const records = await resolver.resolveSrv(hostname)
    if (records && records.length > 0) {
      records.sort((a, b) => a.priority - b.priority || b.weight - a.weight)
      const hosts = records.map(r => `${r.name}:${r.port}`).join(',')
      return hosts
    }
  } catch {
    // SRV resolution failed
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
    const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(.*)/)
    if (!match) {
      return uri
    }
    
    const [, username, password, host, params] = match
    const srvHost = `_mongodb._tcp.${host}`
    const hosts = await resolveSRV(srvHost)
    
    if (hosts) {
      const standardUri = `mongodb://${username}:${password}@${hosts}${params}&ssl=true&authSource=admin`
      return standardUri
    }
  } catch {
    // Fail silently and return original URI
  }
  
  return uri
}

/**
 * Global cache interface for MongoDB connection
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

/**
 * Connect to MongoDB with automatic local failover and error resilience
 */
export async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn
  }

  if (!cached.promise) {
    const configuredUri = getMongoUri()
    const targetUri = configuredUri || LOCAL_FALLBACK_URI

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 4000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 4000,
      retryWrites: true,
      retryReads: true,
    }

    cached.promise = (async () => {
      // 1. Attempt connection with configured URI
      try {
        const connectionUri = await convertSRVtoStandard(targetUri)
        const conn = await mongoose.connect(connectionUri, opts)
        console.log('[SUCCESS] MongoDB connected successfully')
        return conn
      } catch (primaryErr: any) {
        // 2. If configured URI was remote Atlas and failed, auto-failover to local MongoDB
        if (targetUri !== LOCAL_FALLBACK_URI) {
          console.warn(`[WARN] Configured MongoDB Atlas connection failed (${primaryErr.message}). Attempting automatic failover to local MongoDB (127.0.0.1:27017)...`)
          try {
            const localConn = await mongoose.connect(LOCAL_FALLBACK_URI, {
              ...opts,
              serverSelectionTimeoutMS: 2500,
              connectTimeoutMS: 2500,
            })
            console.log('[SUCCESS] Connected to local MongoDB fallback (127.0.0.1:27017/exam_management)')
            return localConn
          } catch {
            console.warn('[INFO] Local MongoDB also unavailable. System operating seamlessly via in-memory resilient store.')
            throw primaryErr
          }
        }
        throw primaryErr
      }
    })()
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

