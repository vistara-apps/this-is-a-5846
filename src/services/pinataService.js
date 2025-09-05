import axios from 'axios'

const PINATA_API_URL = 'https://api.pinata.cloud'
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY

const pinataApi = axios.create({
  baseURL: PINATA_API_URL,
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_KEY
  }
})

export async function uploadToPinata(file, metadata = {}) {
  // Check if API keys are configured
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY || 
      PINATA_API_KEY === 'your_pinata_api_key_here' || 
      PINATA_SECRET_KEY === 'your_pinata_secret_key_here') {
    console.log('Pinata API keys not configured - simulating upload')
    
    // Return mock response for development
    return {
      hash: 'QmMockHash' + Date.now(),
      url: `https://gateway.pinata.cloud/ipfs/QmMockHash${Date.now()}`,
      size: file.size || 0,
      mock: true
    }
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // Enhanced metadata with encryption info
    const enhancedMetadata = {
      name: metadata.name || file.name,
      keyvalues: {
        ...metadata.keyvalues,
        uploadedAt: new Date().toISOString(),
        fileType: file.type || 'unknown',
        encrypted: metadata.encrypted || false,
        userId: metadata.userId || 'anonymous'
      }
    }
    
    formData.append('pinataMetadata', JSON.stringify(enhancedMetadata))

    const response = await pinataApi.post('/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return {
      hash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      size: response.data.PinSize,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error uploading to Pinata:', error)
    throw new Error('Failed to upload file to secure storage')
  }
}

export async function uploadJSONToPinata(data, name) {
  // Check if API keys are configured
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY || 
      PINATA_API_KEY === 'your_pinata_api_key_here' || 
      PINATA_SECRET_KEY === 'your_pinata_secret_key_here') {
    console.log('Pinata API keys not configured - simulating JSON upload')
    
    // Return mock response for development
    return {
      hash: 'QmMockJSONHash' + Date.now(),
      url: `https://gateway.pinata.cloud/ipfs/QmMockJSONHash${Date.now()}`,
      mock: true
    }
  }

  try {
    const response = await pinataApi.post('/pinning/pinJSONToIPFS', data, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        pinataMetadata: JSON.stringify({ 
          name,
          uploadedAt: new Date().toISOString()
        })
      }
    })

    return {
      hash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error)
    throw new Error('Failed to upload data to secure storage')
  }
}

// Upload evidence record with all associated files
export async function uploadEvidenceRecord(recordData, files = []) {
  try {
    const uploadedFiles = []
    
    // Upload each file to IPFS
    for (const file of files) {
      const fileUpload = await uploadToPinata(file, {
        userId: recordData.userId,
        recordId: recordData.recordId,
        encrypted: true
      })
      uploadedFiles.push({
        type: file.type.startsWith('video/') ? 'video' : 'audio',
        hash: fileUpload.hash,
        url: fileUpload.url,
        size: fileUpload.size,
        mock: fileUpload.mock
      })
    }
    
    // Create complete evidence record
    const evidenceRecord = {
      ...recordData,
      files: uploadedFiles,
      createdAt: new Date().toISOString(),
      ipfsHash: null // Will be set after JSON upload
    }
    
    // Upload the complete record as JSON
    const jsonUpload = await uploadJSONToPinata(evidenceRecord, `evidence-record-${recordData.recordId}`)
    evidenceRecord.ipfsHash = jsonUpload.hash
    
    return {
      record: evidenceRecord,
      ipfsHash: jsonUpload.hash,
      ipfsUrl: jsonUpload.url,
      files: uploadedFiles
    }
    
  } catch (error) {
    console.error('Error uploading evidence record:', error)
    throw new Error('Failed to upload evidence record to secure storage')
  }
}
