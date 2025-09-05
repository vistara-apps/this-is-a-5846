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
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    if (metadata) {
      formData.append('pinataMetadata', JSON.stringify({
        name: metadata.name || file.name,
        keyvalues: metadata.keyvalues || {}
      }))
    }

    const response = await pinataApi.post('/pinning/pinFileToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return {
      hash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      size: response.data.PinSize
    }
  } catch (error) {
    console.error('Error uploading to Pinata:', error)
    throw new Error('Failed to upload file to secure storage')
  }
}

export async function uploadJSONToPinata(data, name) {
  try {
    const response = await pinataApi.post('/pinning/pinJSONToIPFS', data, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        pinataMetadata: JSON.stringify({ name })
      }
    })

    return {
      hash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    }
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error)
    throw new Error('Failed to upload data to secure storage')
  }
}