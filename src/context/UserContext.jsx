import React, { createContext, useContext, useState, useEffect } from 'react'
import { getUserState } from '../services/geolocationService'

const UserContext = createContext()

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    userId: 'user_123',
    preferredLanguage: 'english',
    state: 'California',
    subscriptionTier: 'free',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    locationDetected: false,
    city: 'Unknown'
  })

  // Auto-detect user's location on app load
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const locationData = await getUserState()
        
        setUser(prev => ({
          ...prev,
          state: locationData.state,
          city: locationData.city,
          locationDetected: !locationData.error,
          coordinates: locationData.coordinates,
          updatedAt: new Date().toISOString()
        }))
        
        console.log('Location detected:', locationData)
      } catch (error) {
        console.error('Failed to detect location:', error)
        // Keep default state if detection fails
      }
    }

    detectLocation()
  }, [])

  const updateUser = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }))
  }

  const value = {
    user,
    updateUser,
    isPremium: user.subscriptionTier === 'premium'
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
