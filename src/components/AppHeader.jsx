import React, { useState } from 'react'
import { Shield, Menu, X, Bell, User } from 'lucide-react'

export default function AppHeader({ activeSection, setActiveSection, onSubscriptionClick }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'scripts', label: 'Scripts' },
    { id: 'record', label: 'Record' },
    { id: 'laws', label: 'Laws' },
    { id: 'records', label: 'Records' }
  ]

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container max-w-screen-lg mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-md">
            <Shield className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">Know Your Rights Now</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-lg">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-md py-sm rounded-md text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-md">
            <button
              onClick={onSubscriptionClick}
              className="hidden sm:inline-flex px-md py-sm bg-accent text-white rounded-md font-medium hover:bg-accent/90 transition-colors"
            >
              Upgrade
            </button>
            
            <button className="p-sm text-white/80 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <button className="p-sm text-white/80 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-sm text-white"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden pb-md">
            <nav className="flex flex-col gap-sm">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setShowMobileMenu(false)
                  }}
                  className={`px-md py-sm rounded-md text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onSubscriptionClick()
                  setShowMobileMenu(false)
                }}
                className="px-md py-sm bg-accent text-white rounded-md font-medium hover:bg-accent/90 transition-colors text-left mt-sm"
              >
                Upgrade to Premium
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}