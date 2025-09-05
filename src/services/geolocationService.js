// Geolocation service for detecting user's state and location
export async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Reverse geocoding to get state from coordinates
export async function getStateFromCoordinates(latitude, longitude) {
  try {
    // Using a free geocoding service (in production, you might want to use Google Maps API)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }
    
    const data = await response.json()
    
    return {
      state: data.principalSubdivision || 'Unknown',
      city: data.city || 'Unknown',
      country: data.countryName || 'Unknown',
      fullAddress: data.locality || 'Unknown location'
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    
    // Fallback: try to determine state from coordinates using basic logic
    const state = getStateFromCoordinatesOffline(latitude, longitude)
    return {
      state,
      city: 'Unknown',
      country: 'United States',
      fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    }
  }
}

// Offline state detection using coordinate ranges (basic implementation)
function getStateFromCoordinatesOffline(lat, lng) {
  // Basic coordinate ranges for major US states
  const stateRanges = {
    'California': { latMin: 32.5, latMax: 42.0, lngMin: -124.4, lngMax: -114.1 },
    'Texas': { latMin: 25.8, latMax: 36.5, lngMin: -106.6, lngMax: -93.5 },
    'Florida': { latMin: 24.4, latMax: 31.0, lngMin: -87.6, lngMax: -80.0 },
    'New York': { latMin: 40.5, latMax: 45.0, lngMin: -79.8, lngMax: -71.9 },
    'Illinois': { latMin: 36.9, latMax: 42.5, lngMin: -91.5, lngMax: -87.0 },
    'Pennsylvania': { latMin: 39.7, latMax: 42.3, lngMin: -80.5, lngMax: -74.7 },
    'Ohio': { latMin: 38.4, latMax: 42.3, lngMin: -84.8, lngMax: -80.5 },
    'Georgia': { latMin: 30.4, latMax: 35.0, lngMin: -85.6, lngMax: -80.8 },
    'North Carolina': { latMin: 33.8, latMax: 36.6, lngMin: -84.3, lngMax: -75.5 },
    'Michigan': { latMin: 41.7, latMax: 48.2, lngMin: -90.4, lngMax: -82.4 }
  }
  
  for (const [state, range] of Object.entries(stateRanges)) {
    if (lat >= range.latMin && lat <= range.latMax && 
        lng >= range.lngMin && lng <= range.lngMax) {
      return state
    }
  }
  
  return 'California' // Default fallback
}

// Get user's current state with full error handling
export async function getUserState() {
  try {
    const location = await getCurrentLocation()
    const locationData = await getStateFromCoordinates(location.latitude, location.longitude)
    
    return {
      state: locationData.state,
      city: locationData.city,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      accuracy: location.accuracy,
      fullAddress: locationData.fullAddress
    }
  } catch (error) {
    console.error('Failed to get user state:', error)
    
    // Return default state if geolocation fails
    return {
      state: 'California',
      city: 'Unknown',
      coordinates: null,
      accuracy: null,
      fullAddress: 'Location unavailable',
      error: error.message
    }
  }
}

// List of all US states for state selector
export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
]

// Check if geolocation is available
export function isGeolocationAvailable() {
  return 'geolocation' in navigator
}
