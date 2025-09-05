import React, { useState, useEffect } from 'react'
import { Shield, Menu, X, MapPin, Globe, Mic, Video, FileText, Phone, AlertTriangle, Check } from 'lucide-react'
import { generateLegalSummary } from './services/openaiService'
import AppHeader from './components/AppHeader'
import Dashboard from './components/Dashboard'
import ScriptDisplay from './components/ScriptDisplay'
import RecordButton from './components/RecordButton'
import StateSelector from './components/StateSelector'
import SubscriptionModal from './components/SubscriptionModal'
import LanguageSelector from './components/LanguageSelector'
import { UserProvider } from './context/UserContext'
import { RecordingProvider } from './context/RecordingContext'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  return (
    <UserProvider>
      <RecordingProvider>
        <div className="min-h-screen gradient-bg">
          <AppHeader 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onSubscriptionClick={() => setShowSubscriptionModal(true)}
          />
          
          <main className="container max-w-screen-lg mx-auto px-5 py-xl">
            {activeSection === 'dashboard' && <Dashboard setActiveSection={setActiveSection} />}
            {activeSection === 'scripts' && <ScriptDisplay />}
            {activeSection === 'record' && <RecordButton />}
            {activeSection === 'laws' && <StateLaws />}
            {activeSection === 'records' && <MyRecords />}
          </main>

          {showSubscriptionModal && (
            <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
          )}
        </div>
      </RecordingProvider>
    </UserProvider>
  )
}

// State Laws Component
function StateLaws() {
  const [selectedState, setSelectedState] = useState('California')
  const [laws, setLaws] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchStateLaws = async (state) => {
    setLoading(true)
    
    const topics = ['Traffic Stops', 'Search and Seizure', 'Recording Police']
    const language = 'english' // TODO: Get from UserContext
    
    try {
      const lawPromises = topics.map(async (topic) => {
        const content = await generateLegalSummary(topic, state, language)
        return {
          topic,
          summary: content.summary || content,
          details: content.details || content
        }
      })
      
      const lawsData = await Promise.all(lawPromises)
      setLaws(lawsData)
    } catch (error) {
      console.error('Failed to fetch state laws:', error)
      // Fallback to basic content
      setLaws([
        {
          topic: 'Traffic Stops',
          summary: 'You have the right to remain silent. You must provide license, registration, and insurance if requested.',
          details: 'In ' + state + ', during traffic stops you are required to comply with lawful orders but can exercise your right to remain silent.'
        },
        {
          topic: 'Search and Seizure',
          summary: 'Police need probable cause or a warrant to search your vehicle in most cases.',
          details: 'The Fourth Amendment protects against unreasonable searches. In ' + state + ', specific exceptions apply.'
        },
        {
          topic: 'Recording Police',
          summary: 'You have the right to record police in public spaces as long as you don\'t interfere.',
          details: state + ' law generally allows recording of police activities in public areas.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStateLaws(selectedState)
  }, [selectedState])

  return (
    <div className="space-y-lg">
      <div className="text-center mb-xl">
        <h1 className="text-4xl font-bold text-white mb-md">State-Specific Laws</h1>
        <p className="text-lg text-white/80">Know your legal rights by state</p>
      </div>

      <StateSelector 
        selectedState={selectedState}
        onStateChange={setSelectedState}
      />

      {loading ? (
        <div className="space-y-md">
          {[1,2,3].map(i => (
            <div key={i} className="card-gradient rounded-lg p-lg animate-pulse-slow">
              <div className="h-6 bg-white/20 rounded mb-md"></div>
              <div className="h-4 bg-white/10 rounded mb-sm"></div>
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-md">
          {laws.map((law, index) => (
            <div key={index} className="card-gradient rounded-lg p-lg">
              <h3 className="text-xl font-semibold text-white mb-md">{law.topic}</h3>
              <p className="text-white/90 mb-md">{law.summary}</p>
              <p className="text-sm text-white/70">{law.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// My Records Component
function MyRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load records from localStorage
    const loadRecords = () => {
      try {
        const savedRecords = JSON.parse(localStorage.getItem('evidenceRecords') || '[]')
        setRecords(savedRecords)
      } catch (error) {
        console.error('Failed to load records:', error)
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [])

  return (
    <div className="space-y-lg">
      <div className="text-center mb-xl">
        <h1 className="text-4xl font-bold text-white mb-md">My Records</h1>
        <p className="text-lg text-white/80">Your saved encounter evidence</p>
      </div>

      {loading ? (
        <div className="space-y-md">
          {[1,2,3].map(i => (
            <div key={i} className="card-gradient rounded-lg p-lg animate-pulse-slow">
              <div className="h-6 bg-white/20 rounded mb-md"></div>
              <div className="h-4 bg-white/10 rounded mb-sm"></div>
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-md">
          {records.map(record => (
            <div key={record.recordId || record.id} className="card-gradient rounded-lg p-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-md">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-sm">
                    {new Date(record.timestamp).toLocaleString()}
                  </h3>
                  <p className="text-white/80 mb-sm flex items-center gap-sm">
                    <MapPin className="w-4 h-4" />
                    {record.location}
                  </p>
                  <p className="text-white/70 mb-sm">{record.notes}</p>
                  {record.ipfsHash && (
                    <p className="text-xs text-white/50">
                      IPFS: {record.ipfsHash.substring(0, 20)}...
                    </p>
                  )}
                </div>
                
                <div className="flex gap-sm">
                  {record.hasAudio && (
                    <button 
                      onClick={() => record.ipfsUrl && window.open(record.ipfsUrl, '_blank')}
                      className="p-sm bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                      title="View on IPFS"
                    >
                      <Mic className="w-5 h-5 text-white" />
                    </button>
                  )}
                  {record.hasVideo && (
                    <button 
                      onClick={() => record.ipfsUrl && window.open(record.ipfsUrl, '_blank')}
                      className="p-sm bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                      title="View on IPFS"
                    >
                      <Video className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <button 
                    onClick={() => record.ipfsUrl && window.open(record.ipfsUrl, '_blank')}
                    className="p-sm bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                    title="View full record on IPFS"
                  >
                    <FileText className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {records.length === 0 && (
        <div className="text-center py-xl">
          <FileText className="w-16 h-16 text-white/50 mx-auto mb-md" />
          <p className="text-white/70">No records yet. Use the Record feature during encounters.</p>
        </div>
      )}
    </div>
  )
}

export default App
