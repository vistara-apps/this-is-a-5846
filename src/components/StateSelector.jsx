import React from 'react'
import { MapPin, ChevronDown } from 'lucide-react'

export default function StateSelector({ selectedState, onStateChange, variant = 'dropdown' }) {
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ]

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use a geocoding service to convert coordinates to state
          alert('Location detected! This would normally determine your state automatically.')
        },
        (error) => {
          alert('Unable to detect location. Please select your state manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
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
          className="text-accent hover:text-accent/80 font-medium text-sm"
        >
          Auto-detect location
        </button>
      </div>
      
      <div className="relative">
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full p-md rounded-md bg-white/20 text-white border border-white/30 focus:border-accent focus:outline-none appearance-none cursor-pointer"
        >
          {states.map(state => (
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