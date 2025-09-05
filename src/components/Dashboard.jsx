import React from 'react'
import { MessageSquare, FileText, Mic, Video, Globe, MapPin, Shield, AlertTriangle } from 'lucide-react'
import ActionCard from './ActionCard'

export default function Dashboard({ setActiveSection }) {
  const quickActions = [
    {
      icon: MessageSquare,
      title: 'Quick Scripts',
      description: 'Get instant scripts for police encounters',
      variant: 'highlight',
      action: () => setActiveSection('scripts')
    },
    {
      icon: Mic,
      title: 'Start Recording',
      description: 'Begin audio/video evidence capture',
      variant: 'critical',
      action: () => setActiveSection('record')
    },
    {
      icon: FileText,
      title: 'Know Your Laws',
      description: 'State-specific legal information',
      variant: 'info',
      action: () => setActiveSection('laws')
    }
  ]

  const emergencyTips = [
    'Stay calm and keep your hands visible',
    'You have the right to remain silent',
    'Ask "Am I free to leave?" if unsure',
    'Do not consent to searches without a warrant',
    'Record the interaction if possible'
  ]

  return (
    <div className="space-y-xl">
      {/* Hero Section */}
      <div className="text-center mb-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-md">
          Know Your Rights Now
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
          Instant legal guidance and rights protection, right in your pocket. 
          Get scripts, record evidence, and know your state-specific laws.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {quickActions.map((action, index) => (
          <ActionCard
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            variant={action.variant}
            onClick={action.action}
          />
        ))}
      </div>

      {/* Emergency Tips */}
      <div className="card-gradient rounded-lg p-lg">
        <div className="flex items-center gap-md mb-lg">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-semibold text-white">Emergency Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {emergencyTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-sm">
              <Shield className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
              <p className="text-white/90">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="card-gradient rounded-lg p-lg">
          <h3 className="text-xl font-semibold text-white mb-md flex items-center gap-md">
            <Globe className="w-6 h-6 text-accent" />
            Multilingual Support
          </h3>
          <p className="text-white/80 mb-md">
            Access rights information and scripts in English and Spanish, with more languages coming soon.
          </p>
          <div className="flex gap-sm">
            <span className="px-sm py-xs bg-white/20 rounded text-sm text-white">English</span>
            <span className="px-sm py-xs bg-white/20 rounded text-sm text-white">Español</span>
          </div>
        </div>

        <div className="card-gradient rounded-lg p-lg">
          <h3 className="text-xl font-semibold text-white mb-md flex items-center gap-md">
            <MapPin className="w-6 h-6 text-accent" />
            Location-Based Laws
          </h3>
          <p className="text-white/80 mb-md">
            Get accurate, state-specific legal information tailored to your current location.
          </p>
          <button 
            onClick={() => setActiveSection('laws')}
            className="text-accent hover:text-accent/80 font-medium"
          >
            View State Laws →
          </button>
        </div>
      </div>
    </div>
  )
}