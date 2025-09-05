import React, { createContext, useContext, useState, useEffect } from 'react'

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
    updatedAt: new Date().toISOString()
  })

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