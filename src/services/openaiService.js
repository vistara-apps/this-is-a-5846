import OpenAI from 'openai'

// Initialize OpenAI with environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

// Fallback scripts for when API is unavailable
const fallbackScripts = {
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
  },
  'pedestrian-stop': {
    english: {
      greeting: "Officer, I understand you want to speak with me.",
      rights: "I am exercising my right to remain silent. I do not consent to any searches.",
      questions: "Am I being detained? Am I free to leave?",
      documents: "I will provide identification if legally required in this state."
    },
    spanish: {
      greeting: "Oficial, entiendo que quiere hablar conmigo.",
      rights: "Estoy ejerciendo mi derecho a permanecer en silencio. No consiento ningún registro.",
      questions: "¿Estoy siendo detenido? ¿Soy libre de irme?",
      documents: "Proporcionaré identificación si es legalmente requerido en este estado."
    }
  },
  'home-visit': {
    english: {
      greeting: "Officer, how can I help you today?",
      rights: "I do not consent to any search of my home. Do you have a warrant?",
      questions: "What is the purpose of your visit? Am I required to answer questions?",
      documents: "I will not open my door without seeing proper identification and a warrant."
    },
    spanish: {
      greeting: "Oficial, ¿cómo puedo ayudarle hoy?",
      rights: "No consiento ningún registro de mi hogar. ¿Tiene una orden judicial?",
      questions: "¿Cuál es el propósito de su visita? ¿Estoy obligado a responder preguntas?",
      documents: "No abriré mi puerta sin ver identificación apropiada y una orden judicial."
    }
  },
  'public-space': {
    english: {
      greeting: "Officer, I want to be respectful and cooperative.",
      rights: "I am exercising my right to remain silent. I do not consent to any searches.",
      questions: "Am I free to leave? What is the reason for this contact?",
      documents: "I will provide identification if legally required in this jurisdiction."
    },
    spanish: {
      greeting: "Oficial, quiero ser respetuoso y cooperativo.",
      rights: "Estoy ejerciendo mi derecho a permanecer en silencio. No consiento ningún registro.",
      questions: "¿Soy libre de irme? ¿Cuál es la razón de este contacto?",
      documents: "Proporcionaré identificación si es legalmente requerido en esta jurisdicción."
    }
  }
}

export async function generateScript(scenario, language = 'english', state = 'California') {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  // Use fallback scripts if no API key or in development
  if (!apiKey || apiKey === 'your-api-key-here') {
    console.log('Using fallback scripts - no API key configured')
    return fallbackScripts[scenario]?.[language] || fallbackScripts['traffic-stop']['english']
  }

  try {
    const prompt = `Generate a concise, legally sound script for someone during a ${scenario.replace('-', ' ')} encounter with police in ${state}. 
    
    The script should be in ${language} and include these 4 categories as a JSON object:
    1. "greeting": Respectful greeting/acknowledgment
    2. "rights": Clear statement of rights
    3. "questions": Important questions to ask
    4. "documents": Document requests handling
    
    Keep each section brief, practical, and easy to remember under stress. Focus on constitutional rights and state-specific considerations.
    
    Return ONLY a JSON object with these 4 keys.`

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a legal rights expert who helps people understand their constitutional rights during police encounters. Provide clear, accurate, and practical guidance. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    })

    const response = completion.choices[0].message.content
    
    // Try to parse JSON response
    try {
      const parsedScript = JSON.parse(response)
      return parsedScript
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON, using fallback')
      return fallbackScripts[scenario]?.[language] || fallbackScripts['traffic-stop']['english']
    }

  } catch (error) {
    console.error('Error generating script:', error)
    // Return fallback scripts on API error
    return fallbackScripts[scenario]?.[language] || fallbackScripts['traffic-stop']['english']
  }
}

// Fallback legal content database
const legalContentDatabase = {
  'Traffic Stops': {
    'California': {
      english: {
        summary: 'You have the right to remain silent during traffic stops. You must provide license, registration, and insurance if requested.',
        details: 'In California, during traffic stops you are required to comply with lawful orders but can exercise your right to remain silent. Police need probable cause or a warrant to search your vehicle in most cases. You have the right to record police interactions in public spaces.'
      },
      spanish: {
        summary: 'Tienes derecho a permanecer en silencio durante las paradas de tráfico. Debes proporcionar licencia, registro y seguro si se solicita.',
        details: 'En California, durante las paradas de tráfico debes cumplir con órdenes legales pero puedes ejercer tu derecho a permanecer en silencio. La policía necesita causa probable o una orden para registrar tu vehículo en la mayoría de los casos.'
      }
    },
    'Texas': {
      english: {
        summary: 'During traffic stops in Texas, you must provide identification when requested. You have the right to remain silent.',
        details: 'Texas law requires you to identify yourself during a traffic stop. You can remain silent about other questions. Police need reasonable suspicion to extend the stop beyond its original purpose.'
      },
      spanish: {
        summary: 'Durante las paradas de tráfico en Texas, debes proporcionar identificación cuando se solicite. Tienes derecho a permanecer en silencio.',
        details: 'La ley de Texas requiere que te identifiques durante una parada de tráfico. Puedes permanecer en silencio sobre otras preguntas. La policía necesita sospecha razonable para extender la parada más allá de su propósito original.'
      }
    }
  },
  'Search and Seizure': {
    'California': {
      english: {
        summary: 'Police need probable cause or a warrant to search your vehicle in most cases.',
        details: 'The Fourth Amendment protects against unreasonable searches. In California, specific exceptions apply including consent, plain view, search incident to arrest, and exigent circumstances.'
      },
      spanish: {
        summary: 'La policía necesita causa probable o una orden para registrar tu vehículo en la mayoría de los casos.',
        details: 'La Cuarta Enmienda protege contra registros irrazonables. En California, se aplican excepciones específicas incluyendo consentimiento, vista simple, registro incidental al arresto y circunstancias exigentes.'
      }
    }
  },
  'Recording Police': {
    'California': {
      english: {
        summary: 'You have the right to record police in public spaces as long as you don\'t interfere.',
        details: 'California law generally allows recording of police activities in public areas. You must maintain a reasonable distance and not interfere with police duties. Recording from private property may have different rules.'
      },
      spanish: {
        summary: 'Tienes derecho a grabar a la policía en espacios públicos siempre que no interfiera.',
        details: 'La ley de California generalmente permite grabar actividades policiales en áreas públicas. Debes mantener una distancia razonable y no interferir con los deberes policiales.'
      }
    }
  }
}

export async function generateLegalSummary(topic, state, language = 'english') {
  // Check if API key is available
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  // Use fallback content if no API key
  if (!apiKey || apiKey === 'your-api-key-here') {
    console.log('Using fallback legal content - no API key configured')
    const content = legalContentDatabase[topic]?.[state]?.[language] || 
                   legalContentDatabase[topic]?.['California']?.[language] ||
                   legalContentDatabase['Traffic Stops']['California']['english']
    return content
  }

  try {
    const prompt = `Provide a clear, accessible summary of ${topic} laws in ${state} in ${language}. 
    
    Return a JSON object with:
    - "summary": Brief overview (under 100 words)
    - "details": More detailed explanation (under 200 words)
    
    Focus on:
    - Key rights and protections
    - What citizens should know
    - Practical implications
    - State-specific variations from federal law
    
    Use simple, clear language that non-lawyers can understand.`

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a legal educator who specializes in making complex laws understandable to the general public. Provide accurate, simplified explanations. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.2
    })

    const response = completion.choices[0].message.content
    
    try {
      const parsedContent = JSON.parse(response)
      return parsedContent
    } catch (parseError) {
      console.warn('Failed to parse AI legal response as JSON, using fallback')
      const content = legalContentDatabase[topic]?.[state]?.[language] || 
                     legalContentDatabase[topic]?.['California']?.[language] ||
                     legalContentDatabase['Traffic Stops']['California']['english']
      return content
    }

  } catch (error) {
    console.error('Error generating legal summary:', error)
    // Return fallback content on API error
    const content = legalContentDatabase[topic]?.[state]?.[language] || 
                   legalContentDatabase[topic]?.['California']?.[language] ||
                   legalContentDatabase['Traffic Stops']['California']['english']
    return content
  }
}
