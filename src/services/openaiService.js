import OpenAI from 'openai'

// Initialize OpenAI with environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export async function generateScript(scenario, language = 'english', state = 'California') {
  try {
    const prompt = `Generate a concise, legally sound script for someone during a ${scenario} encounter with police in ${state}. 
    
    The script should be in ${language} and include:
    1. Respectful greeting/acknowledgment
    2. Clear statement of rights
    3. Important questions to ask
    4. Document requests handling
    
    Keep it brief, practical, and easy to remember under stress. Focus on constitutional rights and state-specific considerations.`

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a legal rights expert who helps people understand their constitutional rights during police encounters. Provide clear, accurate, and practical guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('Error generating script:', error)
    throw new Error('Failed to generate script. Please try again.')
  }
}

export async function generateLegalSummary(topic, state, language = 'english') {
  try {
    const prompt = `Provide a clear, accessible summary of ${topic} laws in ${state} in ${language}. 
    
    Focus on:
    - Key rights and protections
    - What citizens should know
    - Practical implications
    - State-specific variations from federal law
    
    Keep it under 200 words and use simple language.`

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a legal educator who specializes in making complex laws understandable to the general public. Provide accurate, simplified explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.2
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('Error generating legal summary:', error)
    throw new Error('Failed to generate legal summary. Please try again.')
  }
}