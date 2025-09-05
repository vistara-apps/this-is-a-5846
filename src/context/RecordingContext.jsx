import React, { createContext, useContext, useState, useRef } from 'react'

const RecordingContext = createContext()

export function useRecording() {
  const context = useContext(RecordingContext)
  if (!context) {
    throw new Error('useRecording must be used within a RecordingProvider')
  }
  return context
}

export function RecordingProvider({ children }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState(null)
  const [recordings, setRecordings] = useState([])
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)

  const startRecording = async (type) => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: type === 'video' ? 'video/webm' : 'audio/webm' })
        const url = URL.createObjectURL(blob)
        
        const recording = {
          id: Date.now(),
          type,
          blob,
          url,
          timestamp: new Date().toISOString()
        }
        
        setRecordings(prev => [...prev, recording])
        
        // Clean up
        stream.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingType(type)
    } catch (error) {
      console.error('Error starting recording:', error)
      throw error
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingType(null)
    }
  }

  const value = {
    isRecording,
    recordingType,
    recordings,
    startRecording,
    stopRecording
  }

  return (
    <RecordingContext.Provider value={value}>
      {children}
    </RecordingContext.Provider>
  )
}