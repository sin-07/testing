/**
 * Exam Centers Proximity and Geographic Routing Engine
 * 
 * Provides:
 * - Rich metadata for all 10 Bihar examination centers
 * - Inter-center distance matrix (in kilometers)
 * - Intelligent nearest-neighbor routing when a preferred center reaches maximum capacity
 */

export interface CenterGeoMetadata {
  id: string;
  name: string;
  code: string;
  city: string;
  location: string;
  landmark: string;
  location_order: number;
  capacity: number;
  lat: number;
  lng: number;
  amenities: string[];
  contactPhone: string;
}

export const CENTER_METADATA_LIST: CenterGeoMetadata[] = [
  {
    id: 'patna',
    name: 'Patna',
    code: 'PAT-01',
    city: 'Patna',
    location: 'Govt. Central Examination Complex, Frazer Road, Near Gandhi Maidan, Patna - 800001',
    landmark: 'Opposite Biscomaun Bhawan',
    location_order: 1,
    capacity: 8,
    lat: 25.6127,
    lng: 85.1589,
    amenities: ['CCTV Monitored', 'Biometric Check-in', 'AC Hall', 'Parking Available'],
    contactPhone: '+91 612 2201940',
  },
  {
    id: 'danapur',
    name: 'Danapur',
    code: 'DAN-02',
    city: 'Danapur',
    location: 'DAV Public School Campus, Cantt Road, Danapur, Patna - 801503',
    landmark: 'Near Danapur Railway Station',
    location_order: 2,
    capacity: 8,
    lat: 25.6322,
    lng: 85.0441,
    amenities: ['CCTV Monitored', 'Wheelchair Accessible', 'Spacious Desks'],
    contactPhone: '+91 612 2783011',
  },
  {
    id: 'patna-city',
    name: 'Patna City',
    code: 'PTC-03',
    city: 'Patna City',
    location: 'Guru Gobind Singh College, Ashok Rajpath, Patna City - 800008',
    landmark: 'Near Mangal Talao',
    location_order: 3,
    capacity: 8,
    lat: 25.596,
    lng: 85.2285,
    amenities: ['CCTV Monitored', 'Cloak Room', 'First Aid Center'],
    contactPhone: '+91 612 2641029',
  },
  {
    id: 'fatuha',
    name: 'Fatuha',
    code: 'FAT-04',
    city: 'Fatuha',
    location: 'Adarsh High School Complex, Station Road, Fatuha - 803201',
    landmark: 'Near Fatuha Junction',
    location_order: 4,
    capacity: 8,
    lat: 25.5085,
    lng: 85.3114,
    amenities: ['CCTV Monitored', 'Power Backup', 'Water Cooler'],
    contactPhone: '+91 612 2384910',
  },
  {
    id: 'biharsharif',
    name: 'Biharsharif',
    code: 'BIH-05',
    city: 'Biharsharif',
    location: 'Kisan College Campus, Ranchi Road, Biharsharif, Nalanda - 803101',
    landmark: 'Near Ramchandrapur Bus Stand',
    location_order: 5,
    capacity: 8,
    lat: 25.1982,
    lng: 85.5149,
    amenities: ['CCTV Monitored', 'Auditorium Testing Bay', 'Transit Friendly'],
    contactPhone: '+91 6112 234120',
  },
  {
    id: 'nalanda',
    name: 'Nalanda',
    code: 'NAL-06',
    city: 'Nalanda',
    location: 'Nalanda Open University Hub, Kundalpur Road, Nalanda - 803111',
    landmark: 'Near Ancient University Ruins Site',
    location_order: 6,
    capacity: 8,
    lat: 25.1357,
    lng: 85.4439,
    amenities: ['CCTV Monitored', 'Digital Hall', 'Campus Security'],
    contactPhone: '+91 6112 255201',
  },
  {
    id: 'pawapuri',
    name: 'Pawapuri',
    code: 'PAW-07',
    city: 'Pawapuri',
    location: 'Vardhman Institute Examination Hall, NH-31, Pawapuri - 803115',
    landmark: 'Near Jal Mandir Crossing',
    location_order: 7,
    capacity: 8,
    lat: 25.1011,
    lng: 85.5392,
    amenities: ['CCTV Monitored', 'Quiet Environment', 'Medical Support'],
    contactPhone: '+91 6112 262330',
  },
  {
    id: 'rajgir',
    name: 'Rajgir',
    code: 'RAJ-08',
    city: 'Rajgir',
    location: 'International Convention Center Wing B, Kund Area, Rajgir - 803116',
    landmark: 'Near Ropeway Base Station',
    location_order: 8,
    capacity: 8,
    lat: 25.018,
    lng: 85.422,
    amenities: ['CCTV Monitored', 'Air Conditioned', 'Full Accessibility'],
    contactPhone: '+91 6112 255400',
  },
  {
    id: 'gaya',
    name: 'Gaya',
    code: 'GAY-09',
    city: 'Gaya',
    location: 'Magadh University Examination Block, Bodh Gaya Road, Gaya - 823001',
    landmark: 'Opposite Airport Crossing',
    location_order: 9,
    capacity: 8,
    lat: 24.7955,
    lng: 85.0002,
    amenities: ['CCTV Monitored', 'High Capacity Desks', 'Ample Parking'],
    contactPhone: '+91 631 2220412',
  },
  {
    id: 'buxar',
    name: 'Buxar',
    code: 'BUX-10',
    city: 'Buxar',
    location: 'Maharshi Vishwamitra (MV) College Examination Wing, Station Road, Buxar - 802101',
    landmark: 'Near Charitravan Area',
    location_order: 10,
    capacity: 8,
    lat: 25.5647,
    lng: 83.9777,
    amenities: ['CCTV Monitored', 'Waiting Hall', '24/7 Power Backup'],
    contactPhone: '+91 6183 222150',
  },
];

/**
 * Calculated approximate road distances (km) between center pairs
 */
export const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  'Patna': {
    'Danapur': 11,
    'Patna City': 12,
    'Fatuha': 25,
    'Biharsharif': 72,
    'Nalanda': 81,
    'Pawapuri': 88,
    'Rajgir': 102,
    'Gaya': 108,
    'Buxar': 128,
  },
  'Danapur': {
    'Patna': 11,
    'Patna City': 22,
    'Fatuha': 34,
    'Biharsharif': 82,
    'Nalanda': 91,
    'Pawapuri': 98,
    'Rajgir': 112,
    'Gaya': 114,
    'Buxar': 118,
  },
  'Patna City': {
    'Patna': 12,
    'Fatuha': 14,
    'Danapur': 22,
    'Biharsharif': 62,
    'Nalanda': 72,
    'Pawapuri': 79,
    'Rajgir': 93,
    'Gaya': 115,
    'Buxar': 138,
  },
  'Fatuha': {
    'Patna City': 14,
    'Patna': 25,
    'Danapur': 34,
    'Biharsharif': 50,
    'Nalanda': 60,
    'Pawapuri': 67,
    'Rajgir': 82,
    'Gaya': 118,
    'Buxar': 148,
  },
  'Biharsharif': {
    'Pawapuri': 14,
    'Nalanda': 15,
    'Rajgir': 24,
    'Fatuha': 50,
    'Patna City': 62,
    'Gaya': 68,
    'Patna': 72,
    'Danapur': 82,
    'Buxar': 185,
  },
  'Nalanda': {
    'Pawapuri': 11,
    'Rajgir': 14,
    'Biharsharif': 15,
    'Fatuha': 60,
    'Gaya': 65,
    'Patna City': 72,
    'Patna': 81,
    'Danapur': 91,
    'Buxar': 180,
  },
  'Pawapuri': {
    'Nalanda': 11,
    'Biharsharif': 14,
    'Rajgir': 19,
    'Gaya': 72,
    'Fatuha': 67,
    'Patna City': 79,
    'Patna': 88,
    'Danapur': 98,
    'Buxar': 192,
  },
  'Rajgir': {
    'Nalanda': 14,
    'Pawapuri': 19,
    'Biharsharif': 24,
    'Gaya': 55,
    'Fatuha': 82,
    'Patna City': 93,
    'Patna': 102,
    'Danapur': 112,
    'Buxar': 188,
  },
  'Gaya': {
    'Rajgir': 55,
    'Nalanda': 65,
    'Biharsharif': 68,
    'Pawapuri': 72,
    'Patna': 108,
    'Danapur': 114,
    'Patna City': 115,
    'Fatuha': 118,
    'Buxar': 160,
  },
  'Buxar': {
    'Danapur': 118,
    'Patna': 128,
    'Patna City': 138,
    'Fatuha': 148,
    'Gaya': 160,
    'Nalanda': 180,
    'Biharsharif': 185,
    'Rajgir': 188,
    'Pawapuri': 192,
  },
};

/**
 * Get approximate distance in km between two centers
 */
export function getDistanceBetweenCenters(centerA: string, centerB: string): number {
  if (centerA === centerB) return 0;
  const fromA = DISTANCE_MATRIX[centerA]?.[centerB];
  if (fromA !== undefined) return fromA;
  const fromB = DISTANCE_MATRIX[centerB]?.[centerA];
  if (fromB !== undefined) return fromB;
  return 999;
}

/**
 * Find nearest centers from an available pool, ordered by proximity
 */
export function rankCentersByProximity(
  originCenterName: string,
  candidateCenterNames: string[]
): { name: string; distanceKm: number }[] {
  return candidateCenterNames
    .filter((name) => name !== originCenterName)
    .map((name) => ({
      name,
      distanceKm: getDistanceBetweenCenters(originCenterName, name),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Helper to fetch center metadata by name
 */
export function getCenterMetadataByName(name: string): CenterGeoMetadata | undefined {
  return CENTER_METADATA_LIST.find(
    (c) => c.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
}
