# Know Your Rights Now

A comprehensive web application providing immediate legal guidance and rights protection during police encounters.

## 🚀 Features

### Core Features Implemented

1. **On-the-Spot Scripting & Rights Cards**
   - AI-generated scripts for various police encounter scenarios
   - State-specific legal guidance
   - Multilingual support (English/Spanish)
   - Text-to-speech functionality

2. **State-Specific Law Summaries**
   - Automatic location detection
   - Curated legal information by state
   - AI-enhanced legal summaries
   - Offline fallback content

3. **Real-time Evidence Capture**
   - Audio/video recording capabilities
   - Secure IPFS storage via Pinata
   - Metadata collection and encryption
   - Evidence management dashboard

4. **Subscription System**
   - Free tier with basic features
   - Premium tier ($5/month) with advanced features
   - Stripe payment integration
   - Demo mode for development

## 🛠️ Technical Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **APIs**: OpenAI, Stripe, Pinata IPFS
- **Geolocation**: Browser API + reverse geocoding
- **Storage**: IPFS for evidence, localStorage for demo

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ActionCard.jsx   # Feature cards
│   ├── AppHeader.jsx    # Navigation header
│   ├── Dashboard.jsx    # Main dashboard
│   ├── LanguageSelector.jsx
│   ├── RecordButton.jsx # Evidence recording
│   ├── ScriptDisplay.jsx # Legal scripts
│   ├── StateSelector.jsx # Location selection
│   └── SubscriptionModal.jsx
├── context/             # React Context providers
│   ├── RecordingContext.jsx
│   └── UserContext.jsx
├── services/            # API integrations
│   ├── geolocationService.js
│   ├── openaiService.js
│   ├── pinataService.js
│   └── stripeService.js
├── App.jsx             # Main application
└── main.jsx           # Entry point
```

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-5846.git
   cd this-is-a-5846
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy `.env.example` to `.env` and configure:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   VITE_PINATA_API_KEY=your_pinata_api_key_here
   VITE_PINATA_SECRET_KEY=your_pinata_secret_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔑 API Integrations

### OpenAI API
- **Purpose**: Generate legal scripts and summaries
- **Features**: State-specific content, multilingual support
- **Fallback**: Offline content when API unavailable

### Stripe API
- **Purpose**: Handle subscription payments
- **Features**: Payment intents, webhook support
- **Demo Mode**: Simulated payments for development

### Pinata IPFS
- **Purpose**: Secure evidence storage
- **Features**: File encryption, metadata enhancement
- **Fallback**: Mock responses for development

### Geolocation Services
- **Purpose**: Automatic state detection
- **Features**: Browser geolocation + reverse geocoding
- **Fallback**: Manual state selection

## 🎨 Design System

The application uses a comprehensive design system with:

- **Colors**: Primary, accent, success, error, surface
- **Typography**: Display, heading, subheading, body, caption
- **Spacing**: Consistent spacing scale (xs to xxl)
- **Components**: Modular, reusable UI components
- **Motion**: Smooth transitions and animations

## 📱 User Experience

### User Flows

1. **Onboarding**
   - Welcome screen with app value proposition
   - Location permission request
   - Language preference selection
   - Subscription tier selection

2. **During a Police Stop**
   - Quick access to relevant scripts
   - One-tap recording functionality
   - State-specific legal information
   - Evidence capture and storage

3. **Evidence Management**
   - View saved recordings
   - Access IPFS-stored evidence
   - Share evidence securely
   - Manage storage

## 🔒 Security & Privacy

- **IPFS Storage**: Decentralized, secure evidence storage
- **Encryption**: Evidence files encrypted before upload
- **Privacy**: No personal data stored without consent
- **Security**: TruffleHog scanning for secrets

## 🚀 Deployment

The application is configured for deployment on modern hosting platforms:

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Static hosting**: Compatible with Vercel, Netlify, etc.

## 📊 Business Model

- **Free Tier**: Basic scripts, English only, limited storage
- **Premium Tier**: $5/month for full features
  - State-specific laws
  - Multilingual support
  - Unlimited cloud storage
  - Advanced scripting
  - Priority support

## 🧪 Development Features

- **Hot Reload**: Instant development feedback
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliance considerations
- **Performance**: Optimized bundle size and loading

## 📈 Future Enhancements

- **Legal Consultation**: Direct lawyer referrals
- **Community Features**: User-generated content
- **Advanced Analytics**: Usage insights
- **Mobile App**: Native iOS/Android versions
- **AI Improvements**: Enhanced script generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please contact:
- Email: support@knowyourrightsnow.com
- Documentation: [Link to docs]
- Issues: GitHub Issues tab

---

**Know Your Rights Now** - Empowering individuals with immediate legal guidance and evidence protection tools.
