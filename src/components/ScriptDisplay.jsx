import React, { useState, useEffect } from 'react'
import { Copy, Volume2, Globe, RefreshCw } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import { generateScript } from '../services/openaiService'

export default function ScriptDisplay() {
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [selectedScenario, setSelectedScenario] = useState('traffic-stop')
  const [scripts, setScripts] = useState({})
  const [loading, setLoading] = useState(false)

  const scenarios = [
    { id: 'traffic-stop', label: 'Traffic Stop' },
    { id: 'pedestrian-stop', label: 'Pedestrian Stop' },
    { id: 'home-visit', label: 'Home Visit' },
    { id: 'public-space', label: 'Public Space Encounter' }
  ]

  const defaultScripts = {
    'traffic-stop': {
      english: {
        greeting: "Officer, I want to comply with your lawful orders.",
        rights: "I am exercising my right to remain silent. I do not consent to any searches.",
        questions: "Am I free to leave? If not, am I under arrest?",
        documents: "Here are my license, registration, and insurance as required by law."
      },
      spanish: {
        greeting: "Oficial, quiero cumplir con sus órdenes legales.",
        rights: "Estoy ejerciendo mi derecho a permanecer en silencio. No consiento ningún registro.",
        questions: "¿Soy libre de irme? Si no, ¿estoy bajo arresto?",
        documents: "Aquí están mi licencia, registro y seguro como lo requiere la ley."
      }
    }
  }

  useEffect(() => {
    loadScript()
  }, [selectedScenario, selectedLanguage])

  const loadScript = async () => {
    setLoading(true)
    
    // Use default scripts for demo - in production, this would call OpenAI API
    const script = defaultScripts[selectedScenario]?.[selectedLanguage] || defaultScripts['traffic-stop']['english']
    
    // Simulate API delay
    setTimeout(() => {
      setScripts(script)
      setLoading(false)
    }, 800)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage === 'spanish' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-lg">
      <div className="text-center mb-xl">
        <h1 className="text-4xl font-bold text-white mb-md">On-the-Spot Scripts</h1>
        <p className="text-lg text-white/80">Know exactly what to say during police encounters</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
        <div className="card-gradient rounded-lg p-lg">
          <label className="block text-white font-medium mb-md">Scenario</label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="w-full p-md rounded-md bg-white/20 text-white border border-white/30 focus:border-accent focus:outline-none"
          >
            {scenarios.map(scenario => (
              <option key={scenario.id} value={scenario.id} className="bg-gray-800">
                {scenario.label}
              </option>
            ))}
          </select>
        </div>

        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>

      {/* Scripts */}
      {loading ? (
        <div className="space-y-md">
          {[1,2,3,4].map(i => (
            <div key={i} className="card-gradient rounded-lg p-lg animate-pulse-slow">
              <div className="h-6 bg-white/20 rounded mb-md"></div>
              <div className="h-20 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-md">
          {Object.entries(scripts).map(([category, text]) => (
            <div key={category} className="card-gradient rounded-lg p-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-md">
                <h3 className="text-lg font-semibold text-white capitalize">
                  {category.replace('-', ' ')}
                </h3>
                <div className="flex gap-sm">
                  <button
                    onClick={() => copyToClipboard(text)}
                    className="p-sm bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => speakText(text)}
                    className="p-sm bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <p className="text-white/90 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadScript}
          disabled={loading}
          className="inline-flex items-center gap-sm px-lg py-md bg-accent text-white rounded-md font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Generate New Scripts
        </button>
      </div>
    </div>
  )
}