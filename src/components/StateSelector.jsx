import React, { useState } from 'react'
import { MapPin, ChevronDown, Loader, CheckCircle } from 'lucide-react'
import { getUserState, US_STATES } from '../services/geolocationService'
import { useUser } from '../context/UserContext'

export default function StateSelector({ selectedState, onStateChange, variant = 'dropdown' }) {
  const { user, updateUser } = useUser()
  const [detecting, setDetecting] = useState(false)
  const [detectionSuccess, setDetectionSuccess] = useState(false)

  const detectLocation = async () => {
    setDetecting(true)
    setDetectionSuccess(false)
    
    try {
      const locationData = await getUserState()
      
      if (locationData.state && locationData.state !== 'Unknown') {
        onStateChange(locationData.state)
        updateUser({ 
          state: locationData.state, 
          city: locationData.city,
          locationDetected: true 
        })
        
        setDetectionSuccess(true)
        setTimeout(() => setDetectionSuccess(false), 3000)
      } else {
        alert('Unable to determine your state from location. Please select manually.')
      }
    } catch (error) {
      console.error('Location detection failed:', error)
      alert('Unable to detect location. Please select your state manually.')
    } finally {
      setDetecting(false)
    }
  }

  return (
    <div className="card-gradient rounded-lg p-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-md">
        <h3 className="text-lg font-semibold text-white flex items-center gap-sm">
          <MapPin className="w-5 h-5 text-accent" />
          Select Your State
        </h3>
        <button
          onClick={detectLocation}
          disabled={detecting}
          className="text-accent hover:text-accent/80 font-medium text-sm flex items-center gap-xs disabled:opacity-50"
        >
          {detecting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Detecting...
            </>
          ) : detectionSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Location detected!
            </>
          ) : (
            'Auto-detect location'
          )}
        </button>
      </div>
      
      <div className="relative">
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full p-md rounded-md bg-white/20 text-white border border-white/30 focus:border-accent focus:outline-none appearance-none cursor-pointer"
        >
          {US_STATES.map(state => (
            <option key={state} value={state} className="bg-gray-800">
              {state}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-md top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none" />
      </div>
    </div>
  )
}
