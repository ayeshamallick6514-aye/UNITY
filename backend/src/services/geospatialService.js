'use strict';

/**
 * geospatialService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Open-source reverse geocoding using OpenStreetMap Nominatim API.
 * Zero API key required. Rate-limited to comply with OSM usage policy.
 *
 * Responsibilities:
 *  1. Reverse-geocode (lat, lng) → human-readable Bhopal municipal address
 *  2. Map OSM locality strings to UNITY ward identifiers
 *  3. Link resolved ward to the C-Lock interlock tracking matrix
 *  4. Cache recent lookups in-memory to respect OSM rate limits (1 req/s)
 */

// ─── Bhopal ward → C-Lock interlock matrix mapping ───────────────────────────
// Maps known Bhopal neighbourhood/locality names → ward administrative tokens
const WARD_MAP = [
  { keywords: ['mp nagar', 'malviya nagar'],            ward: 'WARD_042', name: 'MP Nagar Zone-II',       dept: 'PWD'    },
  { keywords: ['arera colony', 'arera'],                ward: 'WARD_031', name: 'Arera Colony',             dept: 'BMC'    },
  { keywords: ['kolar', 'kolar road'],                  ward: 'WARD_055', name: 'Kolar Road',               dept: 'BMC'    },
  { keywords: ['aiims', 'saket nagar'],                 ward: 'WARD_028', name: 'AIIMS Corridor',           dept: 'BSCDC'  },
  { keywords: ['vip road', 'vip', 'shivaji nagar'],     ward: 'WARD_011', name: 'VIP Road Corridor',        dept: 'PWD'    },
  { keywords: ['db mall', 'maharana pratap', 'zone 2'], ward: 'WARD_019', name: 'DB Mall Junction',         dept: 'BMC'    },
  { keywords: ['habibganj', 'rani kamlapati'],          ward: 'WARD_007', name: 'Rani Kamlapati Zone',      dept: 'MPRDCL' },
  { keywords: ['hoshangabad road', 'hoshangabad'],      ward: 'WARD_033', name: 'Hoshangabad Road Corridor',dept: 'PWD'    },
  { keywords: ['shahpura'],                             ward: 'WARD_062', name: 'Shahpura Colony',           dept: 'BMC'    },
  { keywords: ['misrod'],                               ward: 'WARD_071', name: 'Misrod Industrial Area',   dept: 'MPPCB'  },
  { keywords: ['berasia road', 'berasia'],              ward: 'WARD_082', name: 'Berasia Road',              dept: 'PWD'    },
  { keywords: ['bhopal'],                               ward: 'WARD_000', name: 'Bhopal General Area',      dept: 'BMC'    }, // fallback
];

// Department code → full name
const DEPT_NAMES = {
  PWD:   'MP Public Works Department',
  BMC:   'Bhopal Municipal Corporation',
  BSCDC: 'Bhopal Smart City Development Corp.',
  MPRDCL:'MP Road Development Corp. Ltd.',
  MPPCB: 'MP Pollution Control Board',
};

// ─── In-memory cache (avoids hammering Nominatim) ─────────────────────────────
const _cache = new Map();   // key: "lat,lng" → cached result
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function _cacheKey(lat, lng) {
  // Round to 4 decimal places (~11m precision) for cache hit rate
  return `${parseFloat(lat).toFixed(4)},${parseFloat(lng).toFixed(4)}`;
}

// ─── Nominatim request (Node 18+ native fetch) ────────────────────────────────
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
const USER_AGENT    = 'UNITY-GovTech/2.0 (MPOnline-PS5; bhopal.gov.in)';

async function _nominatimReverse(lat, lng) {
  const url = `${NOMINATIM_URL}?lat=${lat}&lng=${lng}&format=json&addressdetails=1&zoom=17`;

  let fetchFn;
  try {
    // Node 18+ has native fetch
    fetchFn = globalThis.fetch ?? require('node-fetch');
  } catch {
    fetchFn = globalThis.fetch;
  }

  const response = await fetchFn(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(8000),   // 8s timeout
  });

  if (!response.ok) {
    throw new Error(`Nominatim responded with HTTP ${response.status}`);
  }

  return response.json();
}

// ─── Ward resolver ────────────────────────────────────────────────────────────
function _resolveWard(osmData) {
  const addr = osmData.address ?? {};
  // Build a searchable string from all address components
  const haystack = [
    addr.neighbourhood, addr.suburb, addr.quarter,
    addr.city_district,  addr.road, addr.county,
    addr.city, osmData.display_name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const entry of WARD_MAP) {
    if (entry.keywords.some((kw) => haystack.includes(kw))) {
      return entry;
    }
  }
  // Fallback — unrecognized area still in Bhopal district
  return { ward: 'WARD_UNK', name: 'Unclassified Zone', dept: 'BMC' };
}

// ─── C-Lock matrix linker ─────────────────────────────────────────────────────
function _buildCLockLink(wardEntry) {
  return {
    wardCode:       wardEntry.ward,
    wardName:       wardEntry.name,
    responsibleDept:wardEntry.dept,
    deptFullName:   DEPT_NAMES[wardEntry.dept] ?? wardEntry.dept,
    interlockMatrix:`/api/v1/matrix/grid?ward=${wardEntry.ward}`,
    projectFeed:    `/api/v1/dashboard?ward=${wardEntry.ward}`,
    zone:           'BHOPAL_METRO_ZONE_01',
  };
}

// ─── Bhopal bounds check ──────────────────────────────────────────────────────
// Approximate bounding box for Bhopal district
const BHOPAL_BOUNDS = {
  latMin: 22.90, latMax: 23.50,
  lngMin: 77.20, lngMax: 77.70,
};

function _inBhopalBounds(lat, lng) {
  const la = parseFloat(lat);
  const ln = parseFloat(lng);
  return (
    la >= BHOPAL_BOUNDS.latMin && la <= BHOPAL_BOUNDS.latMax &&
    ln >= BHOPAL_BOUNDS.lngMin && ln <= BHOPAL_BOUNDS.lngMax
  );
}

// ─── Main exported function ───────────────────────────────────────────────────
/**
 * reverseGeocode(lat, lng)
 * @param {number|string} lat
 * @param {number|string} lng
 * @returns {Object} full geospatial validation payload
 */
async function reverseGeocode(lat, lng) {
  const startMs = Date.now();

  // Validate inputs
  const la = parseFloat(lat);
  const ln = parseFloat(lng);
  if (isNaN(la) || isNaN(ln)) {
    throw new Error('Invalid coordinates: lat and lng must be numeric values.');
  }
  if (la < -90 || la > 90 || ln < -180 || ln > 180) {
    throw new Error('Coordinates out of valid range.');
  }

  // Bhopal jurisdiction check
  const inJurisdiction = _inBhopalBounds(la, ln);

  // Cache lookup
  const key = _cacheKey(la, ln);
  const cached = _cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return { ...cached.data, fromCache: true };
  }

  // Nominatim call
  let osmData;
  try {
    osmData = await _nominatimReverse(la, ln);
  } catch (err) {
    // Offline fallback — resolve ward from bounds heuristic only
    console.warn('[GEO] Nominatim unreachable, using offline fallback:', err.message);
    const fallbackWard = inJurisdiction
      ? { ward: 'WARD_OFF', name: 'Bhopal (Offline Geocode)', dept: 'BMC' }
      : { ward: 'WARD_OOJ', name: 'Outside Bhopal Jurisdiction', dept: 'N/A' };
    return {
      valid:          inJurisdiction,
      inJurisdiction,
      fromCache:      false,
      offline:        true,
      coordinates:    { lat: la, lng: ln },
      displayAddress: `Approx. ${la.toFixed(4)}°N, ${ln.toFixed(4)}°E (Offline)`,
      osmAddress:     null,
      cLock:          _buildCLockLink(fallbackWard),
      processingMs:   Date.now() - startMs,
    };
  }

  // Parse OSM response
  const addr = osmData.address ?? {};
  const wardEntry = _resolveWard(osmData);

  const result = {
    valid:          true,
    inJurisdiction,
    fromCache:      false,
    offline:        false,
    coordinates:    { lat: la, lng: ln },
    displayAddress: osmData.display_name ?? 'Unknown location',
    osmAddress: {
      road:          addr.road            ?? null,
      neighbourhood: addr.neighbourhood   ?? addr.suburb ?? null,
      district:      addr.city_district   ?? null,
      city:          addr.city            ?? addr.town ?? 'Bhopal',
      state:         addr.state           ?? 'Madhya Pradesh',
      postcode:      addr.postcode        ?? null,
      country:       addr.country         ?? 'India',
    },
    cLock:          _buildCLockLink(wardEntry),
    processingMs:   Date.now() - startMs,
  };

  // Cache result
  _cache.set(key, { ts: Date.now(), data: result });

  // Evict old entries (keep cache bounded at 500 entries)
  if (_cache.size > 500) {
    const oldest = _cache.keys().next().value;
    _cache.delete(oldest);
  }

  return result;
}

/**
 * batchGeocode(points) — geocode up to 10 points with 1.1s delay between
 * to respect OSM usage policy (max 1 req/s)
 */
async function batchGeocode(points) {
  if (!Array.isArray(points) || points.length === 0) return [];
  if (points.length > 10) throw new Error('Batch limit: max 10 coordinates per request.');

  const results = [];
  for (let i = 0; i < points.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 1100)); // OSM rate limit
    try {
      const result = await reverseGeocode(points[i].lat, points[i].lng);
      results.push({ input: points[i], ...result });
    } catch (err) {
      results.push({ input: points[i], valid: false, error: err.message });
    }
  }
  return results;
}

module.exports = { reverseGeocode, batchGeocode };
