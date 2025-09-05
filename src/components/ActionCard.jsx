import React from 'react'

export default function ActionCard({ icon: Icon, title, description, variant = 'info', onClick }) {
  const variantClasses = {
    info: 'bg-blue-500/20 border-blue-400/30 hover:bg-blue-500/30',
    warning: 'bg-yellow-500/20 border-yellow-400/30 hover:bg-yellow-500/30',
    critical: 'bg-red-500/20 border-red-400/30 hover:bg-red-500/30',
    highlight: 'bg-accent/20 border-accent/30 hover:bg-accent/30'
  }

  const iconClasses = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
    highlight: 'text-accent'
  }

  return (
    <button
      onClick={onClick}
      className={`p-lg rounded-lg border backdrop-blur-md transition-all duration-250 hover:scale-105 text-left w-full ${variantClasses[variant]}`}
    >
      <Icon className={`w-8 h-8 ${iconClasses[variant]} mb-md`} />
      <h3 className="text-xl font-semibold text-white mb-sm">{title}</h3>
      <p className="text-white/80">{description}</p>
    </button>
  )
}