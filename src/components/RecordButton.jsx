import React, { useState, useRef } from 'react'
import { Mic, Video, Square, Play, Pause, Save, Share, FileText, Upload, CheckCircle } from 'lucide-react'
import { useRecording } from '../context/RecordingContext'
import { useUser } from '../context/UserContext'
import { uploadEvidenceRecord } from '../services/pinataService'

export default function RecordButton() {
  const {
    isRecording,
    recordingType,
    startRecording,
    stopRecording,
    recordings
  } = useRecording()
  
  const { user } = useUser()
  
  const [notes, setNotes] = useState('')
  const [location, setLocation] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleStartRecording = async (type) => {
    try {
      await startRecording(type)
      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`)
        })
      }
    } catch (error) {
      console.error('Failed to start recording:', error)
      alert('Failed to start recording. Please check your browser permissions.')
    }
  }

  const handleStopRecording = () => {
    stopRecording()
    // Reset form
    setNotes('')
    setLocation('')
  }

  const saveRecord = async () => {
    if (recordings.length === 0) {
      alert('No recordings to save!')
      return
    }

    setUploading(true)
    setUploadSuccess(false)

    try {
      const recordId = `record_${Date.now()}`
      const recordData = {
        recordId,
        userId: user.userId,
        timestamp: new Date().toISOString(),
        location: location || 'Unknown',
        notes: notes || 'No notes',
        hasAudio: recordingType === 'audio',
        hasVideo: recordingType === 'video'
      }

      // Get the latest recording files
      const recordingFiles = recordings.map(recording => {
        return new File([recording.blob], `${recordId}_${recording.type}.webm`, {
          type: recording.blob.type
        })
      })

      // Upload to IPFS via Pinata
      const uploadResult = await uploadEvidenceRecord(recordData, recordingFiles)
      
      console.log('Evidence uploaded successfully:', uploadResult)
      
      // Store record locally for user access
      const savedRecord = {
        ...recordData,
        ipfsHash: uploadResult.ipfsHash,
        ipfsUrl: uploadResult.ipfsUrl,
        files: uploadResult.files
      }
      
      // Save to localStorage for demo (in production, this would be in a database)
      const existingRecords = JSON.parse(localStorage.getItem('evidenceRecords') || '[]')
      existingRecords.push(savedRecord)
      localStorage.setItem('evidenceRecords', JSON.stringify(existingRecords))
      
      setUploadSuccess(true)
      
      // Reset form
      setNotes('')
      setLocation('')
      
      setTimeout(() => {
        setUploadSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error('Failed to save record:', error)
      alert('Failed to save recording. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-lg">
      <div className="text-center mb-xl">
        <h1 className="text-4xl font-bold text-white mb-md">Evidence Capture</h1>
        <p className="text-lg text-white/80">Record audio/video and document encounters</p>
      </div>

      {/* Recording Controls */}
      <div className="card-gradient rounded-lg p-lg">
        <h2 className="text-xl font-semibold text-white mb-lg">Record Evidence</h2>
        
        {!isRecording ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <button
              onClick={() => handleStartRecording('audio')}
              className="flex items-center justify-center gap-md p-lg bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              <Mic className="w-8 h-8 text-blue-400" />
              <span className="text-white font-medium">Start Audio Recording</span>
            </button>
            
            <button
              onClick={() => handleStartRecording('video')}
              className="flex items-center justify-center gap-md p-lg bg-red-500/20 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <Video className="w-8 h-8 text-red-400" />
              <span className="text-white font-medium">Start Video Recording</span>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-md p-lg bg-red-500/20 border border-red-400/30 rounded-lg mb-lg">
              {recordingType === 'audio' ? (
                <Mic className="w-8 h-8 text-red-400 animate-pulse" />
              ) : (
                <Video className="w-8 h-8 text-red-400 animate-pulse" />
              )}
              <span className="text-white font-medium">
                Recording {recordingType}... 
              </span>
            </div>
            
            <button
              onClick={handleStopRecording}
              className="inline-flex items-center gap-sm px-lg py-md bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </button>
          </div>
        )}
      </div>

      {/* Notes and Location */}
      <div className="card-gradient rounded-lg p-lg">
        <h2 className="text-xl font-semibold text-white mb-lg">Encounter Details</h2>
        
        <div className="space-y-md">
          <div>
            <label className="block text-white font-medium mb-sm">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location or address"
              className="w-full p-md rounded-md bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-accent focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-sm">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the encounter, officers involved, etc."
              rows={4}
              className="w-full p-md rounded-md bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-accent focus:outline-none resize-none"
            />
          </div>
        </div>
        
        <button
          onClick={saveRecord}
          disabled={(!notes && !location) || uploading}
          className="mt-lg inline-flex items-center gap-sm px-lg py-md bg-accent text-white rounded-md font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Upload className="w-5 h-5 animate-spin" />
              Uploading to IPFS...
            </>
          ) : uploadSuccess ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Saved Successfully!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Record
            </>
          )}
        </button>
      </div>

      {/* Safety Tips */}
      <div className="card-gradient rounded-lg p-lg">
        <h2 className="text-xl font-semibold text-white mb-md">Recording Safety Tips</h2>
        <ul className="space-y-sm text-white/90">
          <li>• Keep your phone visible and announce you are recording</li>
          <li>• Don't interfere with the officer's duties</li>
          <li>• Record from a safe distance</li>
          <li>• Know your state's recording laws</li>
          <li>• Keep recordings secure and backed up</li>
        </ul>
      </div>
    </div>
  )
}
