/**
 * MongoDB Seed Script - Database Initialization
 * 
 * Initializes MongoDB with 10 examination centers with rich metadata:
 * - Center code, location, location_order, city, capacity
 * - Preserves existing filled_count if center already has students!
 */

import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { Resolver } from 'dns/promises'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables')
  process.exit(1)
}

async function resolveSRV(hostname: string): Promise<string> {
  const resolver = new Resolver()
  resolver.setServers(['8.8.8.8', '8.8.4.4'])
  try {
    const records = await resolver.resolveSrv(hostname)
    if (records && records.length > 0) {
      records.sort((a, b) => a.priority - b.priority || b.weight - a.weight)
      return records.map((r) => `${r.name}:${r.port}`).join(',')
    }
  } catch (error) {
    console.error('❌ SRV resolution failed:', error)
  }
  return ''
}

async function convertSRVtoStandard(uri: string): Promise<string> {
  if (!uri.startsWith('mongodb+srv://')) {
    return uri
  }
  try {
    const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(.*)/)
    if (!match) return uri
    const [, username, password, host, params] = match
    const srvHost = `_mongodb._tcp.${host}`
    const hosts = await resolveSRV(srvHost)
    if (hosts) {
      return `mongodb://${username}:${password}@${hosts}${params}&ssl=true&authSource=admin`
    }
  } catch (error) {
    console.error('❌ Error converting SRV URI:', error)
  }
  return uri
}

const CenterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    location: { type: String, required: true },
    location_order: { type: Number, required: true },
    city: { type: String, required: true },
    capacity: { type: Number, required: true, default: 8 },
    filled_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const Center = mongoose.models.Center || mongoose.model('Center', CenterSchema)

export const examCenters = [
  {
    name: 'Patna',
    code: 'PAT-01',
    city: 'Patna',
    location: 'Govt. Central Examination Complex, Frazer Road, Near Gandhi Maidan, Patna - 800001',
    location_order: 1,
    capacity: 8,
  },
  {
    name: 'Danapur',
    code: 'DAN-02',
    city: 'Danapur',
    location: 'DAV Public School Campus, Cantt Road, Danapur, Patna - 801503',
    location_order: 2,
    capacity: 8,
  },
  {
    name: 'Patna City',
    code: 'PTC-03',
    city: 'Patna City',
    location: 'Guru Gobind Singh College, Ashok Rajpath, Patna City - 800008',
    location_order: 3,
    capacity: 8,
  },
  {
    name: 'Fatuha',
    code: 'FAT-04',
    city: 'Fatuha',
    location: 'Adarsh High School Complex, Station Road, Fatuha - 803201',
    location_order: 4,
    capacity: 8,
  },
  {
    name: 'Biharsharif',
    code: 'BIH-05',
    city: 'Biharsharif',
    location: 'Kisan College Campus, Ranchi Road, Biharsharif, Nalanda - 803101',
    location_order: 5,
    capacity: 8,
  },
  {
    name: 'Nalanda',
    code: 'NAL-06',
    city: 'Nalanda',
    location: 'Nalanda Open University Hub, Kundalpur Road, Nalanda - 803111',
    location_order: 6,
    capacity: 8,
  },
  {
    name: 'Pawapuri',
    code: 'PAW-07',
    city: 'Pawapuri',
    location: 'Vardhman Institute Examination Hall, NH-31, Pawapuri - 803115',
    location_order: 7,
    capacity: 8,
  },
  {
    name: 'Rajgir',
    code: 'RAJ-08',
    city: 'Rajgir',
    location: 'International Convention Center Wing B, Kund Area, Rajgir - 803116',
    location_order: 8,
    capacity: 8,
  },
  {
    name: 'Gaya',
    code: 'GAY-09',
    city: 'Gaya',
    location: 'Magadh University Examination Block, Bodh Gaya Road, Gaya - 823001',
    location_order: 9,
    capacity: 8,
  },
  {
    name: 'Buxar',
    code: 'BUX-10',
    city: 'Buxar',
    location: 'Maharshi Vishwamitra (MV) College Examination Wing, Station Road, Buxar - 802101',
    location_order: 10,
    capacity: 8,
  },
]

async function seed() {
  try {
    console.log('[INFO] Connecting to MongoDB Atlas...')
    const connectionUri = await convertSRVtoStandard(MONGODB_URI!)
    await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    console.log('[SUCCESS] Connected to MongoDB')

    console.log('\n[INFO] Seeding exam centers with rich data...')
    for (const center of examCenters) {
      // Find existing to preserve filled_count if any
      const existing = await Center.findOne({ name: center.name })
      const filledCount = existing?.filled_count ?? 0

      await Center.findOneAndUpdate(
        { name: center.name },
        {
          ...center,
          filled_count: filledCount,
        },
        { upsert: true, new: true }
      )
      console.log(`  ✓ [${center.code}] ${center.name} - Capacity: ${center.capacity}, Filled: ${filledCount}`)
    }

    console.log('\n[SUCCESS] Successfully seeded all 10 exam centers!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('\n[INFO] Disconnected from MongoDB')
  }
}

if (require.main === module) {
  seed()
}

export default seed
